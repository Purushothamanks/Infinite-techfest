import { router } from "expo-router";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  Search,
  Sparkles,
  Trophy,
  Users,
  X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StudentBottomNav } from "@/components/dashboard/StudentBottomNav";
import { eventDetailsRoute } from "@/constants/navigation";
import { fetchEvents } from "@/services/eventsService";
import { colors, shadows } from "@/theme";
import type { EventCategory, EventDetail } from "@/types/events";

const CATEGORIES: EventCategory[] = [
  "All",
  "Coding",
  "AI / ML",
  "Quiz",
  "Robotics",
  "Paper Presentation",
  "Web Dev",
  "Gaming",
];

export function EventsListScreen() {
  const [selectedCategory, setSelectedCategory] =
    useState<EventCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await fetchEvents(selectedCategory, searchQuery);
    setEvents(data);
    setLoading(false);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const featuredEvent = events.find((e) => e.id === "evt-codecraft") || events[0];

  const renderEventItem = ({ item }: { item: EventDetail }) => {
    const isRegistered = item.isRegistered;

    return (
      <TouchableOpacity
        onPress={() => router.push(eventDetailsRoute(item.id))}
        activeOpacity={0.9}
        style={shadows.sm}
        className="mb-4 rounded-2xl border border-border bg-surface p-4"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="rounded-full bg-primary/10 px-3 py-1">
              <Text className="font-poppins-semibold text-xs text-primary">
                {item.category}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5">
              <Users size={12} color={colors.text.secondary} />
              <Text className="font-poppins-medium text-[11px] text-text-secondary capitalize">
                {item.type === "team"
                  ? `Team (${item.minTeamSize}-${item.maxTeamSize})`
                  : "Individual"}
              </Text>
            </View>
          </View>

          <View className="rounded-full bg-accent/15 px-3 py-1">
            <Text className="font-poppins-bold text-xs text-text-primary">
              {item.registrationFee > 0 ? `₹${item.registrationFee}` : "Free"}
            </Text>
          </View>
        </View>

        <Text className="mt-3 font-poppins-bold text-lg text-primary">
          {item.title}
        </Text>

        <Text
          numberOfLines={2}
          className="mt-1 font-poppins-regular text-xs text-text-secondary leading-5"
        >
          {item.shortDescription}
        </Text>

        <View className="mt-3.5 flex-row flex-wrap items-center gap-y-2 gap-x-4 border-t border-border/60 pt-3">
          <View className="flex-row items-center gap-1.5">
            <Calendar size={14} color={colors.primary} />
            <Text className="font-poppins-medium text-xs text-text-secondary">
              {item.date}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5">
            <Clock size={14} color={colors.accent} />
            <Text className="font-poppins-medium text-xs text-text-secondary">
              {item.time}
            </Text>
          </View>

          <View className="flex-row items-center gap-1.5">
            <MapPin size={14} color={colors.royalblue} />
            <Text className="font-poppins-medium text-xs text-text-secondary">
              {item.location}
            </Text>
          </View>
        </View>

        <View className="mt-4 flex-row items-center justify-between border-t border-border/40 pt-3">
          {isRegistered ? (
            <View className="flex-row items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5">
              <CheckCircle2 size={16} color="#059669" />
              <Text className="font-poppins-semibold text-xs text-emerald-700">
                Registered
              </Text>
            </View>
          ) : (
            <Text className="font-poppins-medium text-xs text-text-secondary">
              Closes {item.registrationDeadline}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => router.push(eventDetailsRoute(item.id))}
            className="rounded-full bg-primary px-4 py-2"
          >
            <Text className="font-poppins-semibold text-xs text-text-inverse">
              View Details →
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-6 pt-3 pb-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="font-poppins-bold text-2xl text-primary">
              Events & Contests
            </Text>
            <Text className="font-poppins-regular text-xs text-text-secondary">
              Infinite Techfest 2026 • RPSIT
            </Text>
          </View>
          <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Sparkles size={20} color={colors.primary} />
          </View>
        </View>

        {/* Search Bar */}
        <View className="mt-4 flex-row items-center rounded-xl border border-border bg-surface px-3.5 py-2.5">
          <Search size={18} color={colors.text.disabled} />
          <TextInput
            placeholder="Search events, workshops, hackathons..."
            placeholderTextColor={colors.text.disabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="ml-2.5 flex-1 font-poppins-regular text-sm text-text-primary p-0"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={18} color={colors.text.disabled} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Pills Header */}
      <View className="py-2">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-6 gap-2"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                className={`rounded-full px-4 py-2 border ${
                  isSelected
                    ? "bg-primary border-primary"
                    : "bg-surface border-border"
                }`}
              >
                <Text
                  className={`font-poppins-medium text-xs ${
                    isSelected ? "text-text-inverse" : "text-text-secondary"
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
          <Text className="mt-3 font-poppins-medium text-sm text-text-secondary">
            Loading symposium events...
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={renderEventItem}
          contentContainerClassName="px-6 pt-2 pb-10"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            featuredEvent && selectedCategory === "All" && !searchQuery ? (
              <View
                style={shadows.md}
                className="mb-6 overflow-hidden rounded-3xl bg-primary p-5"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1.5 rounded-full bg-accent px-3 py-1">
                    <Trophy size={14} color={colors.primary} />
                    <Text className="font-poppins-bold text-xs text-primary">
                      FLAGSHIP CONTEST
                    </Text>
                  </View>
                  <Text className="font-poppins-medium text-xs text-text-inverse/80">
                    Grand Prizes ₹9,500
                  </Text>
                </View>

                <Text className="mt-3 font-poppins-bold text-2xl text-text-inverse">
                  {featuredEvent.title}
                </Text>

                <Text className="mt-1 font-poppins-regular text-xs text-text-inverse/90 leading-5">
                  {featuredEvent.shortDescription}
                </Text>

                <View className="mt-4 flex-row items-center justify-between border-t border-text-inverse/20 pt-3">
                  <View className="flex-row items-center gap-2">
                    <Calendar size={14} color={colors.accent} />
                    <Text className="font-poppins-medium text-xs text-text-inverse">
                      {featuredEvent.date}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push(eventDetailsRoute(featuredEvent.id))}
                    className="rounded-full bg-accent px-4 py-2"
                  >
                    <Text className="font-poppins-bold text-xs text-primary">
                      Explore Now →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Filter size={36} color={colors.text.disabled} />
              <Text className="mt-3 font-poppins-semibold text-md text-primary">
                No events found
              </Text>
              <Text className="mt-1 font-poppins-regular text-xs text-text-secondary text-center">
                Try selecting a different category or clearing search filter.
              </Text>
            </View>
          }
        />
      )}

      <StudentBottomNav />
    </SafeAreaView>
  );
}
