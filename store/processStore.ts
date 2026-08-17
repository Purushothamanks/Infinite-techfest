import { create } from "zustand";

interface ProcessState {
  isRegistered: boolean;
  isPaymentSubmitted: boolean;
  isPaymentVerified: boolean;
  completeRegistration: () => void;
  submitPaymentProof: () => void;
  completeFullProcess: () => void;
  resetProcess: () => void;
}

/**
 * Manages the step-by-step student onboarding process state:
 * Fresh User -> Register -> Upload Payment Proof -> Verification Complete ("You're all set!").
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
