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
}

export const MOCK_PAYMENT_DETAILS: PaymentDetails = {
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
  status: "verified",
  verifiedAt: "Aug 22, 2026, 04:15 PM"
};

export async function fetchPaymentDetails(): Promise<PaymentDetails> {
  await new Promise((res) => setTimeout(res, 200));
  return MOCK_PAYMENT_DETAILS;
}

export async function submitPaymentProof(utrNumber: string, proofImageUri?: string): Promise<{ success: boolean; message: string }> {
  await new Promise((res) => setTimeout(res, 800));
  MOCK_PAYMENT_DETAILS.status = "pending";
  MOCK_PAYMENT_DETAILS.utrNumber = utrNumber;
  return {
    success: true,
    message: "Payment proof submitted successfully! Verification takes 1-2 hours."
  };
}
