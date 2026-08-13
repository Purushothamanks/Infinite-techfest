import type { LucideIcon } from "lucide-react-native";
import { ChevronDown } from "lucide-react-native";
import { memo, useCallback, useMemo, useState } from "react";
import {
    FlatList,
    Keyboard,
    Modal,
    Pressable,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

import { colors } from "@/theme";

export interface AuthSelectOption {
  code: string;
  label: string;
}

interface AuthSelectFieldProps {
  /** Leading icon rendered inside the field, e.g. GraduationCap or Calendar. */
  icon: LucideIcon;
  /** Title shown at the top of the options sheet. */
  label: string;
  /** Placeholder text shown when no option is selected yet. */
  placeholder: string;
  /** Currently selected option code, or an empty string when unselected. */
  value: string;
  /** Selectable options, e.g. constants/departments.ts or constants/academicYear.ts. */
  options: ReadonlyArray<AuthSelectOption>;
  /** Called with the selected option's code. */
  onChange: (code: string) => void;
  /** Validation error message shown below the field. */
  error?: string;
  /** Accessible label describing the field's purpose, e.g. "Department". */
  accessibilityLabel: string;
}

const ICON_SIZE = 20;
const ROW_HEIGHT = 56;

/** Vertical margin reserved above/below the sheet so it never touches the
 * physical screen edges or the status bar, regardless of device size. */
const SHEET_VERTICAL_MARGIN = 24;

/**
 * Shared select field used by the Register form per
 * Designs/Authentication/4. Register Screen.png: a rounded, bordered field
 * matching AuthTextField's shape with a leading icon, a trailing chevron,
 * and a bottom-sheet style modal listing the selectable options.
 *
 * The options sheet sizes itself from the actual window dimensions and
 * safe-area insets (via useWindowDimensions/useSafeAreaInsets) instead of a
 * percentage height, which would be relative to its parent's natural
 * (content-driven) height and resolve to nothing — see
 * /memories/repo/nativewind-notes.md. This keeps the sheet fully on-screen,
 * scrollable, and correctly sized on any phone/tablet size or orientation.
 *
 * Pure presentational — validation state and error text are supplied by the
 * parent (react-hook-form + zod), this component never validates itself.
 */
function AuthSelectFieldBase({
  icon: Icon,
  label,
  placeholder,
  value,
  options,
  onChange,
  error,
  accessibilityLabel,
}: AuthSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const { height: windowHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const selected = options.find((option) => option.code === value);

  // Cap the sheet at 60% of the window height, but never let it (plus its
  // margins) exceed the actual available vertical space — guards small
  // phones, large phones, and landscape alike. List content beyond this
  // height scrolls instead of being clipped by the screen edge.
  const sheetMaxHeight = useMemo(() => {
    const available =
      windowHeight - insets.top - insets.bottom - SHEET_VERTICAL_MARGIN;
    return Math.max(Math.min(windowHeight * 0.6, available), ROW_HEIGHT * 2);
  }, [windowHeight, insets.top, insets.bottom]);

  const handleOpen = useCallback(() => {
    Keyboard.dismiss();
    setOpen(true);
  }, []);
  const handleClose = useCallback(() => setOpen(false), []);

  const handleSelect = useCallback(
    (code: string) => {
      onChange(code);
      setOpen(false);
    },
    [onChange],
  );

  return (
    <View>
      <Pressable
        onPress={handleOpen}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={`Opens a list to select ${accessibilityLabel.toLowerCase()}`}
        className={`h-14 flex-row items-center gap-3 rounded-2xl border bg-surface px-4 ${
          error ? "border-error" : "border-border"
        }`}
      >
        <Icon size={ICON_SIZE} color={colors.text.disabled} />
        <Text
          className={`flex-1 font-poppins-regular text-md ${
            selected ? "text-text-primary" : "text-text-disabled"
          }`}
        >
          {selected ? selected.label : placeholder}
        </Text>
        <ChevronDown size={ICON_SIZE} color={colors.text.disabled} />
      </Pressable>
      {error ? (
        <Text
          className="mt-1.5 font-poppins-regular text-xs text-error"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      ) : null}

      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleClose}
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={handleClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <SafeAreaView edges={["bottom"]}>
            {/* Inner Pressable with no-op onPress swallows taps so they
                don't bubble to the backdrop Pressable above and close the
                sheet when a user taps the sheet itself. Height is capped via
                an inline style because it's derived from live window
                dimensions/insets, not a static design token — NativeWind
                utility classes can't express a runtime-computed value. */}
            <Pressable
              onPress={() => {}}
              style={{ maxHeight: sheetMaxHeight }}
              className="rounded-t-2xl bg-surface px-6 pb-6 pt-4"
            >
              <Text className="mb-2 font-poppins-semibold text-md text-text-primary">
                {label}
              </Text>
              <FlatList
                data={options}
                keyExtractor={(item) => item.code}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => handleSelect(item.code)}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                    accessibilityState={{ selected: item.code === value }}
                    style={{ minHeight: ROW_HEIGHT }}
                    className="flex-row items-center border-b border-border py-3"
                  >
                    <Text
                      numberOfLines={2}
                      className={`flex-1 font-poppins-regular text-md ${
                        item.code === value
                          ? "text-primary"
                          : "text-text-primary"
                      }`}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />
            </Pressable>
          </SafeAreaView>
        </Pressable>
      </Modal>
    </View>
  );
}

export const AuthSelectField = memo(AuthSelectFieldBase);
