import { useProcessStore } from "@/store/processStore";

export interface PaymentDetails {
  upiId: string;
  upiName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolder: string;
  totalFee: number;
  currency: string;
  registeredEventsCount: number;
  utrNumber?: string;
  status: "verified" | "pending" | "rejected" | "none";
  verifiedAt?: string;
  itemizedSummary: Array<{
    title: string;
    description: string;
    amount: number;
  }>;
}

export const BASE_PAYMENT_DETAILS: PaymentDetails = {
  upiId: "rpsit.techfest2026@upi",
  upiName: "R.P. Sarathy Institute of Technology - Symposium",
  bankName: "State Bank of India (SBI)",
  accountNumber: "3892019481029",
  ifscCode: "SBIN0004128",
  accountHolder: "RPSIT Techfest 2026",
  totalFee: 600,
  currency: "INR (₹)",
  registeredEventsCount: 3,
  utrNumber: "429810294812",
  status: "none",
  itemizedSummary: [
    {
      title: "CodeCraft Flagship Contest",
      description: "Individual Slot",
      amount: 150,
    },
    {
      title: "AI Innovators Hackathon",
      description: "Team Entry (3 Members)",
      amount: 300,
    },
    {
      title: "RoboWars Arena Entry",
      description: "Bot Slot",
      amount: 150,
    },
  ],
};

export async function fetchPaymentDetails(): Promise<PaymentDetails> {
  await new Promise((res) => setTimeout(res, 200));
  const { isPaymentSubmitted, isPaymentVerified } = useProcessStore.getState();

  const status = isPaymentVerified
    ? "verified"
    : isPaymentSubmitted
    ? "pending"
    : "none";

  return {
    ...BASE_PAYMENT_DETAILS,
    status,
    utrNumber: isPaymentSubmitted || isPaymentVerified ? "429810294812" : undefined,
    verifiedAt: isPaymentVerified ? "Aug 22, 2026, 04:15 PM" : undefined,
  };
}

export async function submitPaymentProof(
  utrNumber: string,
  proofImageUri?: string
): Promise<{ success: boolean; message: string }> {
  await new Promise((res) => setTimeout(res, 600));
  useProcessStore.getState().submitPaymentProof();

  return {
    success: true,
    message: "Payment proof submitted successfully! Verification takes 1-2 hours.",
  };
}

