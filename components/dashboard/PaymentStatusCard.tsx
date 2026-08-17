import { router } from "expo-router";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Lock,
  Shield,
  ShieldCheck,
  XCircle,
} from "lucide-react-native";
import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { ROUTES } from "@/constants/navigation";
import { colors } from "@/theme";
import type { PaymentStatusSummary } from "@/types/dashboard";

interface PaymentStatusCardProps {
  summary: PaymentStatusSummary;
}

const STATUS_ICON_SIZE = 14;
const CHEVRON_ICON_SIZE = 14;
const SHIELD_WATERMARK_SIZE = 64;
const LOCK_WATERMARK_SIZE = 24;

const STATUS_META: Record<
  PaymentStatusSummary["status"],
  {
    label: string;
    icon: typeof CheckCircle2;
    textClass: string;
    iconColor: string;
  }
> = {
  verified: {
    label: "Verified",
    icon: CheckCircle2,
    textClass: "text-success",
    iconColor: colors.success,
  },
  pending: {
    label: "Pending",
    icon: Clock,
    textClass: "text-warning",
    iconColor: colors.warning,
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    textClass: "text-error",
    iconColor: colors.error,
  },
  none: {
    label: "Not Submitted",
    icon: Clock,
    textClass: "text-text-secondary",
    iconColor: colors.text.secondary,
  },
};

/**
 * "Payment Status" card with transparent security shield watermark in background,
 * per Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png.
 */
function PaymentStatusCardBase({ summary }: PaymentStatusCardProps) {
  const meta = STATUS_META[summary.status];
  const StatusIcon = meta.icon;

  return (
    <View className="relative flex-1 overflow-hidden rounded-2xl border border-border bg-surface p-4">
      {/* Transparent Security Shield & Lock Watermark Centered & Shifted Lower Down in Background */}
      <View
        className="absolute inset-x-0 bottom-0.5 items-center justify-center opacity-10"
        style={{ pointerEvents: "none" }}
        importantForAccessibility="no-hide-descendants"
      >
        <Shield
          size={SHIELD_WATERMARK_SIZE}
          color={colors.success}
          strokeWidth={1.5}
        />
        <View className="absolute items-center justify-center">
          <Lock
            size={LOCK_WATERMARK_SIZE}
            color={colors.success}
            strokeWidth={2}
          />
        </View>
      </View>



      {/* Top Header Row with Title */}
      <View className="flex-row items-center justify-between">
        <Text className="font-poppins-bold text-sm text-primary">
          Payment Status
        </Text>
      </View>

      <View className="mt-1.5 flex-row items-center gap-1.5">
        <StatusIcon size={STATUS_ICON_SIZE} color={meta.iconColor} />
        <Text className={`font-poppins-bold text-sm ${meta.textClass}`}>
          {meta.label}
        </Text>
      </View>

      <Text className="mt-1.5 font-poppins-regular text-xs leading-4 text-text-secondary z-10">
        {summary.message}
      </Text>

      <TouchableOpacity
        onPress={() => router.push(ROUTES.PAYMENT_STATUS)}
        accessibilityRole="button"
        accessibilityLabel="View payment details"
        className="mt-3 flex-row items-center gap-1 self-start z-10"
      >
        <Text className="font-poppins-semibold text-xs text-primary">
          View Details
        </Text>
        <ChevronRight size={CHEVRON_ICON_SIZE} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

export const PaymentStatusCard = memo(PaymentStatusCardBase);


