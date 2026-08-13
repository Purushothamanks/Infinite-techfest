/**
 * Centralized Expo Router path constants.
 *
 * Screens and components must navigate using these constants — never
 * hardcode a route path string inline. Extend this object as new routes
 * are added under app/.
 *
 * WELCOME, LOGIN, REGISTER, FORGOT_PASSWORD, RESET_PASSWORD, VERIFY_EMAIL,
 * RESET_EMAIL_SENT, PASSWORD_UPDATED, and HOME point to implemented routes
 * (app/(authentication)/welcome.tsx, login.tsx, register.tsx,
 * forgot-password.tsx, reset-password.tsx, verify-email.tsx,
 * reset-email-sent.tsx, password-updated.tsx, and app/(student)/home.tsx —
 * the real Student Home Dashboard).
 *
 * EVENTS, SCHEDULE, QR_PASS, PROFILE, PAYMENT_STATUS, and NOTIFICATIONS
 * point to temporary placeholder screens (app/(student)/events/index.tsx,
 * schedule.tsx, qr-pass.tsx, profile.tsx, payment-status.tsx,
 * notifications.tsx) — thin "Coming Soon" stubs standing in for the
 * not-yet-built Student Module screens (see Designs/Student Module/),
 * so the dashboard's navigation never dead-ends or crashes. Replace each
 * stub's contents in place once its real screen is built; the route path
 * itself should not need to change.
 */
export const ROUTES = {
  WELCOME: "/(authentication)/welcome",
  LOGIN: "/(authentication)/login",
  REGISTER: "/(authentication)/register",
  FORGOT_PASSWORD: "/(authentication)/forgot-password",
  RESET_PASSWORD: "/(authentication)/reset-password",
  VERIFY_EMAIL: "/(authentication)/verify-email",
  RESET_EMAIL_SENT: "/(authentication)/reset-email-sent",
  PASSWORD_UPDATED: "/(authentication)/password-updated",
  HOME: "/(student)/home",
  EVENTS: "/(student)/events",
  SCHEDULE: "/(student)/schedule",
  QR_PASS: "/(student)/qr-pass",
  PROFILE: "/(student)/profile",
  PAYMENT_STATUS: "/(student)/payment-status",
  NOTIFICATIONS: "/(student)/notifications",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

/**
 * Builds the Event Details route for a given event id
 * (app/(student)/events/[eventId].tsx — see ROUTES doc above for its
 * placeholder status). A function rather than a ROUTES entry since it
 * requires a dynamic segment.
 */
export function eventDetailsRoute(
  eventId: string,
): `/(student)/events/${string}` {
  return `/(student)/events/${eventId}`;
}
