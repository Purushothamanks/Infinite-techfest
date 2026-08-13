import { FileBadge } from "lucide-react-native";
import { memo } from "react";
import { Text, View } from "react-native";

import { EmptyState } from "@/components/dashboard/EmptyState";
import { colors } from "@/theme";

interface CertificatesCardProps {
  certificateCount: number;
}

const CERT_BADGE_ICON_SIZE = 28;

/**
 * "Certificates" card, per
 * Designs/Student Module/1. STUDENT HOME DASHBOARD UI DESIGN.png. Shows a
 * count summary when certificates exist, or the design's icon-based empty
 * state ("No certificates yet") when `certificateCount` is 0 — using
 * EmptyState.tsx to stay consistent with other dashboard empty states.
 * Uses lucide's FileBadge (a document-with-ribbon glyph) to mirror the
 * design's certificate illustration without introducing a raster asset.
 */
function CertificatesCardBase({ certificateCount }: CertificatesCardProps) {
  return (
    <View className="flex-1 rounded-2xl border border-border bg-surface p-4">
      <Text className="font-poppins-bold text-md text-primary">
        Certificates
      </Text>

      {certificateCount > 0 ? (
        <View className="mt-3 flex-1 items-center justify-center gap-2 py-2">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-primary/5">
            <FileBadge
              size={CERT_BADGE_ICON_SIZE}
              color={colors.primary}
              strokeWidth={1.5}
            />
          </View>
          <Text className="font-poppins-bold text-lg text-primary">
            {certificateCount}
          </Text>
          <Text className="text-center font-poppins-regular text-xs text-text-secondary">
            {certificateCount === 1
              ? "Certificate available"
              : "Certificates available"}
          </Text>
        </View>
      ) : (
        <EmptyState
          icon={FileBadge}
          title="No certificates yet"
          description="Your certificates will appear here after eligible events."
        />
      )}
    </View>
  );
}

export const CertificatesCard = memo(CertificatesCardBase);
