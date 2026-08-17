import {
  Bookmark,
  BookmarkCheck,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StudentBottomNav } from "@/components/dashboard/StudentBottomNav";
import { fetchSchedule } from "@/services/scheduleService";
import { colors, shadows } from "@/theme";
import type { ScheduleSession } from "@/services/scheduleService";

export function ScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState<"Day 1" | "Day 2">("Day 1");
  const [viewTab, setViewTab] = useState<"all" | "bookmarked">("all");
  const [sessions, setSessions] = useState<ScheduleSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchSchedule(selectedDay);
    setSessions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selectedDay]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const toggleBookmark = (id: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isBookmarked: !s.isBookmarked } : s))
    );
  };

  const displayedSessions =
    viewTab === "bookmarked"
      ? sessions.filter((s) => s.isBookmarked)
      : sessions;

  const renderSessionItem = ({ item }: { item: ScheduleSession }) => {
    return (
      <View
        style={shadows.sm}
        className="mb-4 flex-row overflow-hidden rounded-2xl border border-border bg-surface"
      >
        {/* Time Left Bar Accent */}
        <View
          className={`w-2 ${
            item.category === "Keynote"
              ? "bg-accent"
              : item.category === "Technical"
              ? "bg-primary"
              : item.category === "Workshop"
              ? "bg-emerald-500"
              : "bg-royalblue"
          }`}
        />

        <View className="flex-1 p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5 rounded-full bg-background px-3 py-1 border border-border">
              <Clock size={12} color={colors.primary} />
              <Text className="font-poppins-semibold text-xs text-primary">
                {item.time}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => toggleBookmark(item.id)}
              className="p-1"
            >
              {item.isBookmarked ? (
                <BookmarkCheck size={20} color={colors.accent} fill={colors.accent} />
              ) : (
                <Bookmark size={20} color={colors.text.disabled} />
              )}
            </TouchableOpacity>
          </View>

          <Text className="mt-2.5 font-poppins-bold text-base text-primary">
            {item.title}
          </Text>

          {item.speakerOrHost && (
            <View className="mt-1.5 flex-row items-center gap-1.5">
              <User size={13} color={colors.text.secondary} />
              <Text className="font-poppins-medium text-xs text-text-secondary">
                {item.speakerOrHost}
              </Text>
            </View>
          )}

          <View className="mt-3 flex-row items-center justify-between border-t border-border/50 pt-2.5">
            <View className="flex-row items-center gap-1.5">
              <MapPin size={14} color={colors.royalblue} />
              <Text className="font-poppins-medium text-xs text-text-secondary">
                {item.location}
              </Text>
            </View>

            <View className="rounded-full bg-primary/10 px-2.5 py-0.5">
              <Text className="font-poppins-medium text-[11px] text-primary">
                {item.category}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Screen Header */}
      <View className="px-6 pt-3 pb-2 border-b border-border bg-surface">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-poppins-bold text-2xl text-primary">
              Symposium Schedule
            </Text>
            <Text className="font-poppins-regular text-xs text-text-secondary">
              August 23 - 24, 2026 • RPSIT Campus
            </Text>
          </View>

          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Calendar size={20} color={colors.primary} />
          </View>
        </View>

        {/* Tab Selector (Full Schedule vs My Schedule) */}
        <View className="mt-4 flex-row rounded-full bg-background p-1 border border-border">
          <TouchableOpacity
            onPress={() => setViewTab("all")}
            className={`flex-1 py-2 rounded-full items-center ${
              viewTab === "all" ? "bg-primary" : ""
            }`}
          >
            <Text
              className={`font-poppins-semibold text-xs ${
                viewTab === "all" ? "text-text-inverse" : "text-text-secondary"
              }`}
            >
              Full Schedule
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewTab("bookmarked")}
            className={`flex-1 py-2 rounded-full items-center ${
              viewTab === "bookmarked" ? "bg-primary" : ""
            }`}
          >
            <Text
              className={`font-poppins-semibold text-xs ${
                viewTab === "bookmarked" ? "text-text-inverse" : "text-text-secondary"
              }`}
            >
              My Agenda
            </Text>
          </TouchableOpacity>
        </View>

        {/* Day Selector Pills */}
        <View className="mt-3 flex-row gap-3">
          {(["Day 1", "Day 2"] as const).map((day) => {
            const isSelected = selectedDay === day;
            const dateStr = day === "Day 1" ? "Aug 23 (Day 1)" : "Aug 24 (Day 2)";

            return (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedDay(day)}
                className={`flex-1 py-2.5 rounded-xl border items-center ${
                  isSelected
                    ? "bg-accent border-accent"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`font-poppins-bold text-xs ${
                    isSelected ? "text-primary" : "text-text-secondary"
                  }`}
                >
                  {dateStr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Main Timeline List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={displayedSessions}
          keyExtractor={(item) => item.id}
          renderItem={renderSessionItem}
          contentContainerClassName="px-6 pt-4 pb-10"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Sparkles size={36} color={colors.text.disabled} />
              <Text className="mt-3 font-poppins-semibold text-md text-primary">
                No sessions bookmarked yet
              </Text>
              <Text className="mt-1 font-poppins-regular text-xs text-text-secondary text-center px-4">
                Tap the bookmark icon on any session in the Full Schedule tab to add it to your personal agenda!
              </Text>
            </View>
          }
        />
      )}

      <StudentBottomNav />
    </SafeAreaView>
  );
}
