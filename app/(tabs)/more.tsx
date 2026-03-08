import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "@/constants/colors";
import { router } from "expo-router";
import { DESIGNERS } from "@/constants/designers";

const BRANCHES = [
  {
    id: "1",
    name: "Found Hair 信義店",
    address: "台北市信義區信義路五段7號 2樓",
    phone: "02-2723-8899",
    hours: "週二至週日 10:00 - 20:00",
    closed: "週一公休",
    mapLat: 25.0329694,
    mapLng: 121.5654177,
    mapQuery: "台北市信義區信義路五段7號",
    mrt: "捷運象山站 2號出口步行3分鐘",
  },
  {
    id: "2",
    name: "Found Hair 東區店",
    address: "台北市大安區忠孝東路四段181號 3樓",
    phone: "02-2771-5588",
    hours: "週三至週一 10:00 - 20:00",
    closed: "週二公休",
    mapLat: 25.0417,
    mapLng: 121.5489,
    mapQuery: "台北市大安區忠孝東路四段181號",
    mrt: "捷運忠孝敦化站 6號出口步行2分鐘",
  },
];


function MapThumbnail({ lat, lng, query, onPress }: { lat: number; lng: number; query: string; onPress: () => void }) {
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=600x300&maptype=roadmap&markers=color:0xC9A96E%7C${lat},${lng}&style=element:geometry%7Ccolor:0xf5f5f5&style=element:labels.icon%7Cvisibility:off`;
  return (
    <Pressable onPress={onPress} style={styles.mapContainer}>
      <View style={styles.mapPlaceholder}>
        <LinearGradient
          colors={["#E8E4DC", "#D4CFC5"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.mapGrid}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} style={styles.mapGridLine} />
          ))}
        </View>
        <View style={styles.mapPin}>
          <Ionicons name="location" size={32} color={COLORS.gold} />
        </View>
        <View style={styles.mapLabel}>
          <Text style={styles.mapLabelText}>{query}</Text>
          <View style={styles.mapOpenBtn}>
            <Text style={styles.mapOpenBtnText}>點擊開啟地圖</Text>
            <Feather name="external-link" size={12} color={COLORS.gold} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"branches" | "team">("branches");

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/-/g, "")}`);
  };

  const handleMap = (query: string) => {
    const url = Platform.select({
      ios: `maps://?q=${encodeURIComponent(query)}`,
      android: `geo:0,0?q=${encodeURIComponent(query)}`,
      default: `https://maps.google.com/maps?q=${encodeURIComponent(query)}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
        <Text style={styles.headerTitle}>更多</Text>
        <View style={styles.tabSwitcher}>
          <Pressable
            style={[styles.tabBtn, activeTab === "branches" && styles.tabBtnActive]}
            onPress={() => setActiveTab("branches")}
          >
            <Text style={[styles.tabBtnText, activeTab === "branches" && styles.tabBtnTextActive]}>
              門市資訊
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tabBtn, activeTab === "team" && styles.tabBtnActive]}
            onPress={() => setActiveTab("team")}
          >
            <Text style={[styles.tabBtnText, activeTab === "team" && styles.tabBtnTextActive]}>
              設計師
            </Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "branches" && (
          <View style={styles.branchesContainer}>
            {BRANCHES.map((branch) => (
              <View key={branch.id} style={styles.branchCard}>
                <LinearGradient
                  colors={["#1C1C1C", "#2A2010"]}
                  style={styles.branchHeader}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.branchName}>{branch.name}</Text>
                </LinearGradient>

                <MapThumbnail
                  lat={branch.mapLat}
                  lng={branch.mapLng}
                  query={branch.mapQuery}
                  onPress={() => handleMap(branch.mapQuery)}
                />

                <View style={styles.branchDetails}>
                  {[
                    { icon: "location-outline" as const, text: branch.address },
                    { icon: "time-outline" as const, text: branch.hours },
                    { icon: "close-circle-outline" as const, text: branch.closed },
                    { icon: "subway-outline" as const, text: branch.mrt },
                  ].map((row, i) => (
                    <View key={i} style={styles.detailRow}>
                      <Ionicons name={row.icon} size={18} color={COLORS.gold} />
                      <Text style={styles.detailText}>{row.text}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.branchActions}>
                  <Pressable
                    style={[styles.actionBtn, styles.callBtn]}
                    onPress={() => handleCall(branch.phone)}
                  >
                    <Feather name="phone" size={16} color={COLORS.white} />
                    <Text style={styles.callBtnText}>{branch.phone}</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionBtn, styles.mapBtn]}
                    onPress={() => handleMap(branch.mapQuery)}
                  >
                    <Feather name="map-pin" size={16} color={COLORS.primary} />
                    <Text style={styles.mapBtnText}>地圖導航</Text>
                  </Pressable>
                </View>

                <Pressable
                  style={styles.bookBranchBtn}
                  onPress={() => router.push("/(tabs)/booking")}
                >
                  <Text style={styles.bookBranchBtnText}>預約此門市</Text>
                  <Feather name="arrow-right" size={16} color={COLORS.white} />
                </Pressable>
              </View>
            ))}

            <View style={styles.socialCard}>
              <Text style={styles.socialTitle}>追蹤我們</Text>
              <View style={styles.socialRow}>
                {[
                  { icon: "logo-instagram" as const, label: "@foundhair_tw", color: "#E1306C" },
                  { icon: "logo-facebook" as const, label: "Found Hair", color: "#1877F2" },
                  { icon: "chatbubble-outline" as const, label: "LINE: @foundhair", color: "#06C755" },
                ].map((s, i) => (
                  <View key={i} style={styles.socialItem}>
                    <View style={[styles.socialIcon, { backgroundColor: s.color }]}>
                      <Ionicons name={s.icon} size={20} color={COLORS.white} />
                    </View>
                    <Text style={styles.socialLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {activeTab === "team" && (
          <View style={styles.teamContainer}>
            {DESIGNERS.map((d) => (
              <Pressable
                key={d.id}
                style={styles.teamCard}
                onPress={() => router.push("/(tabs)/booking")}
              >
                <Image
                  source={{ uri: d.image }}
                  style={styles.teamImage}
                  contentFit="cover"
                />
                <View style={styles.teamInfo}>
                  <View style={styles.teamTop}>
                    <View>
                      <Text style={styles.teamName}>{d.name}</Text>
                      <Text style={styles.teamTitle}>{d.title}</Text>
                    </View>
                    <View style={styles.teamBranch}>
                      <Text style={styles.teamBranchText}>{d.branch}</Text>
                    </View>
                  </View>
                  <Text style={styles.teamSpec}>{d.specialty}</Text>
                  <Text style={styles.teamBio} numberOfLines={2}>{d.bio}</Text>
                  <View style={styles.teamFooter}>
                    <View style={styles.expTag}>
                      <Ionicons name="time-outline" size={12} color={COLORS.gold} />
                      <Text style={styles.expText}>經驗 {d.experience}</Text>
                    </View>
                    <Pressable
                      style={styles.bookDesignerBtn}
                      onPress={() => router.push("/(tabs)/booking")}
                    >
                      <Text style={styles.bookDesignerText}>預約</Text>
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    marginBottom: 12,
  },
  tabSwitcher: {
    flexDirection: "row",
    backgroundColor: COLORS.borderLight,
    borderRadius: 12,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  tabBtnActive: {
    backgroundColor: COLORS.white,
  },
  tabBtnText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: COLORS.textSecondary,
  },
  tabBtnTextActive: {
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
  },
  branchesContainer: {
    padding: 20,
    gap: 20,
  },
  branchCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  branchHeader: {
    padding: 20,
  },
  branchName: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: COLORS.white,
  },
  mapContainer: {
    height: 160,
    overflow: "hidden",
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  mapGrid: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    opacity: 0.2,
  },
  mapGridLine: {
    width: "10%",
    height: 160,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.textLight,
  },
  mapPin: {
    zIndex: 2,
  },
  mapLabel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mapLabelText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: COLORS.primary,
    flex: 1,
    marginRight: 8,
  },
  mapOpenBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mapOpenBtnText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.gold,
  },
  branchDetails: {
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  detailText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  branchActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  callBtn: {
    backgroundColor: COLORS.primary,
  },
  callBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.white,
  },
  mapBtn: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.primary,
  },
  bookBranchBtn: {
    margin: 16,
    marginTop: 0,
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  bookBranchBtnText: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: COLORS.white,
  },
  socialCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  socialTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    marginBottom: 16,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  socialItem: {
    alignItems: "center",
    gap: 8,
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  socialLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
  },
  teamContainer: {
    padding: 20,
    gap: 14,
  },
  teamCard: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  teamImage: {
    width: 110,
    height: 160,
  },
  teamInfo: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  teamTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  teamName: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    marginBottom: 2,
  },
  teamTitle: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: COLORS.gold,
  },
  teamBranch: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  teamBranchText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
    color: COLORS.textSecondary,
  },
  teamSpec: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
  },
  teamBio: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: COLORS.textLight,
    lineHeight: 18,
    flex: 1,
  },
  teamFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  expTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  expText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: COLORS.textSecondary,
  },
  bookDesignerBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
  },
  bookDesignerText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: COLORS.white,
  },
});
