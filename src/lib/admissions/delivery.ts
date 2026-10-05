/**
 * Admissions inquiry DELIVERY boundary.
 *
 * HONESTY CONTRACT
 * ----------------
 * There is no mail service, CRM or backend in this project, and none has been
 * added, because adding a paid or unconfigured third-party service to make the
 * form look complete would be worse than an honest limitation.
 *
 * `deliverInquiry` therefore does exactly one of two things:
 *   1. If ADMISSIONS_DELIVERY_ENABLED=1 and a notification address is set, it
 *      hands the inquiry to the configured transport and reports the real
 *      outcome (see `TODO` below for where to add one).
 *   2. Otherwise it reports `delivered: false` with a clear reason.
 *
 * The API route maps `delivered: false` to HTTP 503 and the UI renders an
 * honest "not delivered" state with the alternative contact route. It NEVER
 * returns success, and the form NEVER shows a success message unless
 * `deliverInquiry` actually returned `delivered: true`.
 *
 * TO ACTIVATE DELIVERY
 * --------------------
 * 1. Implement a transport in `sendViaConfiguredTransport` below (SMTP, an
 *    email API, a webhook to a school inbox). Keep credentials server-side.
 * 2. Set ADMISSIONS_DELIVERY_ENABLED=1 and ADMISSIONS_NOTIFICATION_EMAIL.
 * 3. Re-test the full form flow — the success state is deliberately gated on
 *    the transport's real return value.
 */

export interface DeliveryResult {
  delivered: boolean;
  /** Short human-readable reason. Never contains secrets. */
  reason: string;
  /** Only present when a real transport produced one. */
  reference?: string;
}

export interface DeliveryInput {
  reference: string;
  values: {
    parentName: string;
    studentName: string;
    gradeOfInterest: string;
    preferredCampus: string;
    phone: string;
    email: string;
    message: string;
  };
}

function isDeliveryEnabled(): boolean {
  return process.env.ADMISSIONS_DELIVERY_ENABLED === "1";
}

function hasNotificationTarget(): boolean {
  return Boolean(process.env.ADMISSIONS_NOTIFICATION_EMAIL?.trim());
}

/**
 * Transport hook.
 *
 * Returns null when no transport is implemented, which is the state this
 * project ships in. When someone adds a transport it must throw or return
 * false on failure so a failed send can never be reported as a success.
 */
async function sendViaConfiguredTransport(
  input: DeliveryInput,
): Promise<{ ok: true; reference: string } | { ok: false; reason: string } | null> {
  void input;
  // No transport is implemented. See the module docblock for how to add one.
  return null;
}

export async function deliverInquiry(input: DeliveryInput): Promise<DeliveryResult> {
  if (!isDeliveryEnabled()) {
    return {
      delivered: false,
      reason:
        "No delivery channel is configured for admissions inquiries on this server.",
    };
  }

  if (!hasNotificationTarget()) {
    return {
      delivered: false,
      reason:
        "Admissions delivery is enabled but no notification address is configured.",
    };
  }

  const result = await sendViaConfiguredTransport(input);

  if (result === null) {
    return {
      delivered: false,
      reason:
        "Admissions delivery is switched on but no transport has been implemented yet.",
    };
  }

  if (!result.ok) {
    return { delivered: false, reason: result.reason };
  }

  return { delivered: true, reason: "Delivered.", reference: result.reference };
}

/**
 * Public, client-safe statement of whether delivery is live. Used by the API to
 * pick a status code and by the UI to explain itself before the user submits.
 */
export function isDeliveryConfigured(): boolean {
  return isDeliveryEnabled() && hasNotificationTarget();
}