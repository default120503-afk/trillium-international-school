import { NextResponse } from "next/server";
import { deliverInquiry } from "@/lib/admissions/delivery";
import {
  validateInquiry,
  type AdmissionInquiry,
} from "@/lib/admissions/schema";
import { campuses } from "@/content/campuses";

/**
 * POST /api/admissions
 *
 * Contract:
 *  - 400 + field errors when client and server validation disagree
 *  - 503 when no delivery channel is configured  (NOT a success)
 *  - 502 when a configured transport reports failure
 *  - 201 only when the transport genuinely reported delivery
 *
 * The endpoint path is configurable via ADMISSIONS_ENDPOINT_PATH so a future
 * reverse-proxy or hosting rewrite can change it without code changes.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

/**
 * Abuse controls for a public, unauthenticated POST endpoint.
 *
 * While `deliverInquiry` reports `delivered: false` the endpoint is harmless.
 * The moment a real transport is attached it becomes a spam relay, so the
 * guards belong here from the start rather than being retrofitted.
 *
 * - Origin / Sec-Fetch-Site check blocks cross-site form posts.
 * - A small in-memory per-IP token bucket caps request volume. This is
 *   deliberately simple and per-instance; a multi-instance deployment should
 *   move the counter into shared storage (see README, "Known limitations").
 */
const RATE_LIMIT = { windowMs: 60_000, max: 5 };
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = rateBuckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    return { ok: true, retryAfter: 0 };
  }
  bucket.count += 1;
  if (bucket.count > RATE_LIMIT.max) {
    return {
      ok: false,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return { ok: true, retryAfter: 0 };
}

class BodyTooLargeError extends Error {
  constructor() {
    super("Request body exceeds the maximum accepted size.");
    this.name = "BodyTooLargeError";
  }
}

/**
 * Reads the request body as text, refusing anything over `maxBytes`.
 *
 * The byte cap is enforced while reading rather than after, so a chunked
 * request with no `content-length` header cannot stream an unbounded body into
 * memory.
 */
async function readCappedBody(
  request: Request,
  maxBytes: number,
): Promise<string> {
  const body = request.body;
  if (!body) return "";

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new BodyTooLargeError();
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
}

/** Best-effort client identity for rate limiting. */
function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Cross-site request guard. Browsers attach Origin to cross-origin POSTs;
 * Sec-Fetch-Site is the modern equivalent. A missing header means a non-browser
 * client (curl, a server-side test), which the rate limiter still constrains.
 */
function crossSiteRequest(request: Request): boolean {
  const site = request.headers.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return true;

  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).host !== new URL(request.url).host;
  } catch {
    return true;
  }
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function pick(value: unknown, field: keyof AdmissionInquiry): string {
  if (!isString(value)) return "";
  return value.trim();
}

export async function POST(request: Request) {
  const endpointPath = process.env.ADMISSIONS_ENDPOINT_PATH || "/api/admissions";

  // Accept only requests aimed at the configured path.
  let path: string;
  try {
    path = new URL(request.url).pathname;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }
  if (path !== endpointPath) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (crossSiteRequest(request)) {
    return NextResponse.json(
      { delivered: false, error: "Cross-site submissions are not accepted." },
      { status: 403 },
    );
  }

  const limit = checkRateLimit(clientKey(request));
  if (!limit.ok) {
    return NextResponse.json(
      {
        delivered: false,
        error: "Too many inquiries submitted. Please wait a moment and try again.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  // `content-length` is client-supplied and absent on chunked requests, so it
  // cannot be trusted as the sole guard. It is used only to reject early; the
  // authoritative cap is applied to the text actually read below.
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Submission is too large." },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    // Read as text first so the size cap is enforced against real bytes. A
    // chunked request has no content-length, which previously let an
    // arbitrarily large body straight through to request.json().
    const raw = await readCappedBody(request, MAX_BODY_BYTES);
    if (raw === null) {
      return NextResponse.json(
        { error: "Submission is too large." },
        { status: 413 },
      );
    }
    body = JSON.parse(raw);
  } catch (parseError) {
    if (parseError instanceof BodyTooLargeError) {
      return NextResponse.json(
        { error: "Submission is too large." },
        { status: 413 },
      );
    }
    return NextResponse.json(
      { error: "Could not read the submission." },
      { status: 400 },
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const payload = body as Record<string, unknown>;

  // Honeypot: a hidden field only an automated filler would complete.
  if (isString(payload.website) && payload.website.trim() !== "") {
    // Respond exactly as we would on success to avoid teaching the bot
    // anything, but do NOT deliver anything.
    return NextResponse.json(
      { delivered: false, reference: "ignored" },
      { status: 202 },
    );
  }

  const values: AdmissionInquiry = {
    parentName: pick(payload.parentName, "parentName"),
    studentName: pick(payload.studentName, "studentName"),
    gradeOfInterest: pick(payload.gradeOfInterest, "gradeOfInterest"),
    preferredCampus: pick(payload.preferredCampus, "preferredCampus"),
    phone: pick(payload.phone, "phone"),
    email: pick(payload.email, "email"),
    message: isString(payload.message) ? payload.message.trim() : "",
  };

  // Reject campuses that are not real records.
  if (
    values.preferredCampus &&
    !campuses.some((c) => c.id === values.preferredCampus)
  ) {
    return NextResponse.json(
      {
        delivered: false,
        error: "Invalid submission.",
        fieldErrors: {
          preferredCampus: "Choose one of the listed campuses.",
        },
      },
      { status: 400 },
    );
  }

  const fieldErrors = validateInquiry(values);
  if (Object.keys(fieldErrors).length > 0) {
    return NextResponse.json(
      { delivered: false, error: "Please correct the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  // Reference id: opaque to the sender, useful in a reply thread.
  const reference = `TISS-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

  const result = await deliverInquiry({ reference, values });

  if (!result.delivered) {
    // The precise reason can disclose server configuration state to an
    // anonymous caller. The operator detail is logged instead.
    console.error("[admissions] delivery did not complete:", result.reason);
    return NextResponse.json(
      {
        delivered: false,
        deliveryConfigured: false,
        error: "No delivery channel is configured for admissions inquiries on this server.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json(
    { delivered: true, reference: result.reference ?? reference },
    { status: 201 },
  );
}

/** Explicit 405 so a GET does not fall through to a confusing 404. */
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed." },
    { status: 405, headers: { Allow: "POST" } },
  );
}