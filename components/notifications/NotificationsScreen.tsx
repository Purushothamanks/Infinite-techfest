import {
  Bell,
  CheckCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  Megaphone,
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
import { fetchNotifications } from "@/services/notificationsService";
import { colors, shadows } from "@/theme";
import type { NotificationItem } from "@/services/notificationsService";

export function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const loadData = async () => {
    setLoading(true);
    const data = await fetchNotifications();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const filteredNotifications =
    filterCategory === "All"
      ? notifications
      : notifications.filter((n) => n.category === filterCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Registration":
        return <CheckCircle2 size={18} color="#059669" />;
      case "Payment":
        return <CreditCard size={18} color={colors.primary} />;
      case "Schedule":
        return <Clock size={18} color={colors.accent} />;
      default:
        return <Megaphone size={18} color={colors.royalblue} />;
    }
  };

  const renderItem = ({ item }: { item: NotificationItem }) => {
    return (
      <TouchableOpacity
        onPress={() => toggleRead(item.id)}
        activeOpacity={0.8}
        style={shadows.sm}
        className={`mb-3 flex-row items-start gap-3 rounded-2xl border p-4 ${
          item.isRead
            ? "border-border bg-surface"
            : "border-primary/30 bg-primary/5"
        }`}
      >
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${
            item.category === "Registration"
              ? "bg-emerald-100"
              : item.category === "Payment"
              ? "bg-primary/10"
              : item.category === "Schedule"
              ? "bg-amber-100"
              : "bg-blue-100"
          }`}
        >
          {getCategoryIcon(item.category)}
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="font-poppins-bold text-sm text-primary">
              {item.title}
            </Text>
            <Text className="font-poppins-regular text-[11px] text-text-secondary">
              {item.timestamp}
            </Text>
          </View>

          <Text className="mt-1 font-poppins-regular text-xs text-text-secondary leading-5">
            {item.message}
          </Text>

          <View className="mt-2 flex-row items-center justify-between">
            <View className="rounded-full bg-background px-2.5 py-0.5 border border-border">
              <Text className="font-poppins-medium text-[10px] text-text-secondary">
                {item.category}
              </Text>
            </View>

            {!item.isRead && (
              <View className="flex-row items-center gap-1">
                <View className="h-2 w-2 rounded-full bg-primary" />
                <Text className="font-poppins-semibold text-[10px] text-primary">
                  New
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      {/* Header */}
      <View className="px-6 pt-3 pb-2 border-b border-border bg-surface">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Text className="font-poppins-bold text-2xl text-primary">
              Notifications
            </Text>
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <View className="rounded-full bg-primary px-2.5 py-0.5">
                <Text className="font-poppins-bold text-xs text-text-inverse">
                  {notifications.filter((n) => !n.isRead).length}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={markAllAsRead}
            className="flex-row items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5"
          >
            <CheckCheck size={14} color={colors.primary} />
            <Text className="font-poppins-semibold text-xs text-primary">
              Mark Read
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View className="mt-3 flex-row gap-2">
          {["All", "Registration", "Payment", "Announcement"].map((cat) => {
            const isSelected = filterCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setFilterCategory(cat)}
                className={`rounded-full px-3 py-1.5 border ${
                  isSelected
                    ? "bg-primary border-primary"
                    : "bg-background border-border"
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
        </View>
      </View>

      {/* Main List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerClassName="px-6 pt-4 pb-10"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-12">
              <Bell size={36} color={colors.text.disabled} />
              <Text className="mt-3 font-poppins-semibold text-md text-primary">
                No notifications found
              </Text>
            </View>
          }
        />
      )}

      <StudentBottomNav />
    </SafeAreaView>
  );
}
