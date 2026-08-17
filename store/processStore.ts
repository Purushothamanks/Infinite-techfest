import { create } from "zustand";

interface ProcessState {
  isRegistered: boolean;
  isPaymentSubmitted: boolean;
  isPaymentVerified: boolean;
  completeRegistration: () => void;
  submitPaymentProof: () => void;
  approvePaymentByAdmin: () => void;
  completeFullProcess: () => void;
  resetProcess: () => void;
}

/**
 * Manages the realistic step-by-step student onboarding process state:
 * 1. Fresh Unregistered User ->
 * 2. Complete Registration (Registration Active) ->
 * 3. Submit Payment UTR Proof (Payment Pending ⏳) ->
 * 4. Accounts Desk Approval (Payment Verified 🎉 -> "You're all set!").
 */
export const useProcessStore = create<ProcessState>((set) => ({
  isRegistered: false,
  isPaymentSubmitted: false,
  isPaymentVerified: false,

  completeRegistration: () =>
    set({
      isRegistered: true,
    }),

  submitPaymentProof: () =>
    set({
      isRegistered: true,
      isPaymentSubmitted: true,
      isPaymentVerified: false,
    }),

  approvePaymentByAdmin: () =>
    set({
      isRegistered: true,
      isPaymentSubmitted: true,
      isPaymentVerified: true,
    }),

  completeFullProcess: () =>
    set({
      isRegistered: true,
      isPaymentSubmitted: true,
      isPaymentVerified: true,
    }),

  resetProcess: () =>
    set({
      isRegistered: false,
      isPaymentSubmitted: false,
      isPaymentVerified: false,
    }),
}));

