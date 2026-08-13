import { router, useLocalSearchParams } from "expo-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  PhoneCall,
  Share2,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserCheck,
  Users,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ROUTES } from "@/constants/navigation";
import { fetchEventById } from "@/services/eventsService";
import { colors, shadows } from "@/theme";
import type { EventDetail } from "@/types/events";

export function EventDetailsScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "rules" | "prizes" | "coordinators"
  >("overview");
  const [registerModalVisible, setRegisterModalVisible] = useState(false);

  // Form state
  const [teamName, setTeamName] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [collegeName, setCollegeName] = useState(
    "R.P. Sarathy Institute of Technology"
  );
  const [department, setDepartment] = useState("Computer Science & Engineering");
  const [year, setYear] = useState("3rd Year");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!eventId) return;
      setLoading(true);
      const data = await fetchEventById(eventId);
      setEvent(data);
      setLoading(false);
    }
    load();
  }, [eventId]);

  const handleRegisterSubmit = async () => {
    if (!participantName.trim()) {
      Alert.alert("Required Field", "Please enter participant / team leader name.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 600));
    setIsSubmitting(false);
    setRegisterModalVisible(false);

    if (event) {
      setEvent({
        ...event,
        isRegistered: true,
        registrationStatus: event.registrationFee > 0 ? "pending_payment" : "registered",
      });
    }

    if (event && event.registrationFee > 0) {
      Alert.alert(
        "Registration Initiated!",
        `Registration for ${event.title} saved! Complete payment of ₹${event.registrationFee} to verify registration.`,
        [
          {
            text: "Proceed to Payment",
            onPress: () => router.push(ROUTES.PAYMENT_STATUS),
          },
          { text: "Later", style: "cancel" },
        ]
      );
    } else {
      Alert.alert(
        "Registration Complete!",
        `You have successfully registered for ${event?.title}. Your pass is updated in My QR Pass!`
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="mt-3 font-poppins-medium text-sm text-text-secondary">
          Fetching event details...
        </Text>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center px-6">
        <AlertCircle size={48} color={colors.error} />
        <Text className="mt-3 font-poppins-bold text-lg text-primary">
          Event Not Found
        </Text>
        <Text className="mt-1 font-poppins-regular text-xs text-text-secondary text-center">
          The requested event could not be found or may have been updated.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 rounded-full bg-primary px-6 py-3"
        >
          <Text className="font-poppins-semibold text-xs text-text-inverse">
            Back to Events
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      {/* Top Header Bar */}
      <View className="flex-row items-center justify-between px-6 pt-3 pb-2 border-b border-border bg-surface">
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-10 w-10 items-center justify-center rounded-full bg-background border border-border"
        >
          <ArrowLeft size={20} color={colors.primary} />
        </TouchableOpacity>

        <Text className="font-poppins-bold text-base text-primary">
          Event Details
        </Text>

        <TouchableOpacity
          onPress={() =>
            Alert.alert("Share Event", `Sharing ${event.title} - Infinite Techfest 2026!`)
          }
          className="h-10 w-10 items-center justify-center rounded-full bg-background border border-border"
        >
          <Share2 size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Banner Section */}
        <View className="bg-primary p-6">
          <View className="flex-row items-center justify-between">
            <View className="rounded-full bg-accent px-3 py-1">
              <Text className="font-poppins-bold text-xs text-primary">
                {event.category}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 rounded-full bg-white/20 px-3 py-1">
              <Users size={12} color="#fff" />
              <Text className="font-poppins-medium text-xs text-white capitalize">
                {event.type === "team"
                  ? `Team (${event.minTeamSize}-${event.maxTeamSize} Members)`
                  : "Individual"}
              </Text>
            </View>
          </View>

          <Text className="mt-4 font-poppins-bold text-3xl text-text-inverse leading-9">
            {event.title}
          </Text>

          <Text className="mt-2 font-poppins-regular text-xs text-text-inverse/90 leading-5">
            {event.shortDescription}
          </Text>

          <View className="mt-5 flex-row items-center justify-between border-t border-white/20 pt-4">
            <View>
              <Text className="font-poppins-regular text-xs text-text-inverse/70">
                Registration Fee
              </Text>
              <Text className="font-poppins-bold text-xl text-accent">
                {event.registrationFee > 0 ? `₹${event.registrationFee}` : "Free Entry"}
              </Text>
            </View>

            <View className="items-end">
              <Text className="font-poppins-regular text-xs text-text-inverse/70">
                Registration Closes
              </Text>
              <Text className="font-poppins-semibold text-xs text-text-inverse">
                {event.registrationDeadline}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Info Strip */}
        <View className="flex-row border-b border-border bg-surface px-6 py-4">
          <View className="flex-1 flex-row items-center gap-2 border-r border-border pr-2">
            <Calendar size={18} color={colors.primary} />
            <View>
              <Text className="font-poppins-regular text-[11px] text-text-secondary">
                Date
              </Text>
              <Text className="font-poppins-semibold text-xs text-primary">
                {event.date}
              </Text>
            </View>
          </View>

          <View className="flex-1 flex-row items-center gap-2 border-r border-border px-2">
            <Clock size={18} color={colors.accent} />
            <View>
              <Text className="font-poppins-regular text-[11px] text-text-secondary">
                Timing
              </Text>
              <Text className="font-poppins-semibold text-xs text-primary">
                {event.time}
              </Text>
            </View>
          </View>

          <View className="flex-1 flex-row items-center gap-2 pl-2">
            <MapPin size={18} color={colors.royalblue} />
            <View>
              <Text className="font-poppins-regular text-[11px] text-text-secondary">
                Venue
              </Text>
              <Text
                numberOfLines={1}
                className="font-poppins-semibold text-xs text-primary"
              >
                {event.location}
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row border-b border-border bg-background px-6">
          {(["overview", "rules", "prizes", "coordinators"] as const).map(
            (tab) => {
              const isActive = activeTab === tab;
              const labels = {
                overview: "Overview",
                rules: "Rules",
                prizes: "Prizes",
                coordinators: "Coordinators",
              };

              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 py-3 items-center border-b-2 ${
                    isActive ? "border-primary" : "border-transparent"
                  }`}
                >
                  <Text
                    className={`font-poppins-medium text-xs capitalize ${
                      isActive ? "text-primary font-poppins-semibold" : "text-text-secondary"
                    }`}
                  >
                    {labels[tab]}
                  </Text>
                </TouchableOpacity>
              );
            }
          )}
        </View>

        {/* Tab Content */}
        <View className="p-6">
          {activeTab === "overview" && (
            <View>
              <Text className="font-poppins-bold text-lg text-primary">
                About the Event
              </Text>
              <Text className="mt-2 font-poppins-regular text-sm text-text-secondary leading-6">
                {event.fullDescription}
              </Text>

              <View style={shadows.sm} className="mt-6 rounded-2xl border border-border bg-surface p-4">
                <View className="flex-row items-center gap-2">
                  <ShieldCheck size={20} color={colors.primary} />
                  <Text className="font-poppins-bold text-sm text-primary">
                    Certificate of Participation
                  </Text>
                </View>
                <Text className="mt-1 font-poppins-regular text-xs text-text-secondary">
                  All registered attendees will receive a verified e-certificate issued by R.P. Sarathy Institute of Technology.
                </Text>
              </View>
            </View>
          )}

          {activeTab === "rules" && (
            <View>
              <Text className="font-poppins-bold text-lg text-primary">
                Rules & Competition Guidelines
              </Text>
              <View className="mt-3 gap-3">
                {event.rules.map((rule, idx) => (
                  <View
                    key={idx}
                    className="flex-row items-start gap-3 rounded-xl border border-border bg-surface p-3.5"
                  >
                    <View className="h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Text className="font-poppins-bold text-xs text-primary">
                        {idx + 1}
                      </Text>
                    </View>
                    <Text className="flex-1 font-poppins-regular text-xs text-text-primary leading-5 pt-0.5">
                      {rule}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === "prizes" && (
            <View>
              <Text className="font-poppins-bold text-lg text-primary">
                Cash Prizes & Honors
              </Text>
              <View className="mt-3 gap-3">
                {event.prizes.map((prize, idx) => (
                  <View
                    key={idx}
                    style={shadows.sm}
                    className="flex-row items-center justify-between rounded-2xl border border-border bg-surface p-4"
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className={`h-10 w-10 items-center justify-center rounded-full ${
                          idx === 0
                            ? "bg-amber-100"
                            : idx === 1
                            ? "bg-slate-200"
                            : "bg-amber-800/15"
                        }`}
                      >
                        <Trophy
                          size={20}
                          color={
                            idx === 0 ? "#d97706" : idx === 1 ? "#475569" : "#b45309"
                          }
                        />
                      </View>
                      <View>
                        <Text className="font-poppins-bold text-sm text-primary">
                          {prize.position}
                        </Text>
                        <Text className="font-poppins-regular text-xs text-text-secondary">
                          Award & Merit Certificate
                        </Text>
                      </View>
                    </View>

                    <Text className="font-poppins-bold text-lg text-emerald-600">
                      {prize.amount}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {activeTab === "coordinators" && (
            <View>
              <Text className="font-poppins-bold text-lg text-primary">
                Event Coordinators
              </Text>
              <Text className="mt-1 font-poppins-regular text-xs text-text-secondary">
                Have questions or need assistance? Reach out to the coordinators below:
              </Text>

              <View className="mt-4 gap-3">
                {event.coordinators.map((c, idx) => (
                  <View
                    key={idx}
                    style={shadows.sm}
                    className="flex-row items-center justify-between rounded-2xl border border-border bg-surface p-4"
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <UserCheck size={20} color={colors.primary} />
                      </View>
                      <View>
                        <Text className="font-poppins-bold text-sm text-primary">
                          {c.name}
                        </Text>
                        <Text className="font-poppins-medium text-xs text-accent">
                          {c.role}
                        </Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() =>
                        Alert.alert("Contact Coordinator", `Calling ${c.name} at ${c.phone}`)
                      }
                      className="flex-row items-center gap-1.5 rounded-full bg-primary px-3.5 py-2"
                    >
                      <PhoneCall size={14} color={colors.text.inverse} />
                      <Text className="font-poppins-semibold text-xs text-text-inverse">
                        Call
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View className="border-t border-border bg-surface px-6 py-4">
        {event.isRegistered ? (
          <View className="flex-row items-center justify-between gap-3">
            <View className="flex-row items-center gap-2 rounded-full bg-emerald-50 px-4 py-3">
              <CheckCircle2 size={18} color="#059669" />
              <Text className="font-poppins-semibold text-xs text-emerald-700">
                Already Registered
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => router.push(ROUTES.PAYMENT_STATUS)}
              className="flex-1 items-center justify-center rounded-full bg-primary py-3"
            >
              <Text className="font-poppins-semibold text-xs text-text-inverse">
                View Payment / Status
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setRegisterModalVisible(true)}
            className="flex-row items-center justify-center gap-2 rounded-full bg-primary py-3.5"
          >
            <Sparkles size={18} color={colors.accent} />
            <Text className="font-poppins-bold text-sm text-text-inverse">
              Register Now {event.registrationFee > 0 ? `(₹${event.registrationFee})` : "(Free)"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Registration Modal */}
      <Modal
        visible={registerModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setRegisterModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="rounded-t-3xl bg-surface p-6">
            <View className="flex-row items-center justify-between pb-4 border-b border-border">
              <View>
                <Text className="font-poppins-bold text-lg text-primary">
                  {event.title} Registration
                </Text>
                <Text className="font-poppins-regular text-xs text-text-secondary">
                  {event.type === "team" ? "Team Registration" : "Individual Participant"}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setRegisterModalVisible(false)}>
                <X size={24} color={colors.text.disabled} />
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-[380px] my-4 gap-3">
              {event.type === "team" && (
                <View>
                  <Text className="font-poppins-medium text-xs text-primary mb-1">
                    Team Name *
                  </Text>
                  <TextInput
                    placeholder="Enter your team name (e.g. Algo Knights)"
                    value={teamName}
                    onChangeText={setTeamName}
                    className="rounded-xl border border-border bg-background p-3 font-poppins-regular text-sm"
                  />
                </View>
              )}

              <View>
                <Text className="font-poppins-medium text-xs text-primary mb-1">
                  {event.type === "team" ? "Team Leader Name *" : "Full Name *"}
                </Text>
                <TextInput
                  placeholder="Enter full name"
                  value={participantName}
                  onChangeText={setParticipantName}
                  className="rounded-xl border border-border bg-background p-3 font-poppins-regular text-sm"
                />
              </View>

              <View>
                <Text className="font-poppins-medium text-xs text-primary mb-1">
                  College Name
                </Text>
                <TextInput
                  value={collegeName}
                  onChangeText={setCollegeName}
                  className="rounded-xl border border-border bg-background p-3 font-poppins-regular text-sm"
                />
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="font-poppins-medium text-xs text-primary mb-1">
                    Department
                  </Text>
                  <TextInput
                    value={department}
                    onChangeText={setDepartment}
                    className="rounded-xl border border-border bg-background p-3 font-poppins-regular text-sm"
                  />
                </View>
                <View className="w-28">
                  <Text className="font-poppins-medium text-xs text-primary mb-1">
                    Year
                  </Text>
                  <TextInput
                    value={year}
                    onChangeText={setYear}
                    className="rounded-xl border border-border bg-background p-3 font-poppins-regular text-sm"
                  />
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              onPress={handleRegisterSubmit}
              disabled={isSubmitting}
              className="items-center justify-center rounded-full bg-primary py-3.5 mt-2"
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="font-poppins-bold text-sm text-text-inverse">
                  Confirm & Submit Registration
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
