import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "@/constants/colors";

const CDN = "https://storage.googleapis.com/studio-cms-assets/projects/Nxqg26DmO1";

const HERO_SLIDES = [
  {
    id: "1",
    title: "Your Basic Beauty",
    subtitle: "找回最真實的自己",
    image: { uri: `${CDN}/s-2400x2400_v-frms_webp_8d831f6b-38e3-4b30-96ee-6370f5b0d932_small.webp` },
  },
  {
    id: "2",
    title: "量身打造剪髮",
    subtitle: "每一剪都為您而生",
    image: { uri: `${CDN}/s-960x960_v-fs_webp_7dcf0513-2ffb-44df-a8f5-3ab9c28c6d2f_small.webp` },
  },
  {
    id: "3",
    title: "全新形象改造",
    subtitle: "讓髮型說出您的故事",
    image: { uri: `${CDN}/s-2160x2160_v-frms_webp_2df05603-0b23-4b78-812f-e70ba9107213_small.webp` },
  },
];

const SERVICES = [
  { id: "1", icon: "cut-outline" as const, title: "量身打造" },
  { id: "2", icon: "refresh-outline" as const, title: "易於整理" },
  { id: "3", icon: "sparkles-outline" as const, title: "形象改造" },
];

const DESIGNERS = [
  {
    id: "1",
    name: "Emily Chen",
    title: "首席設計師",
    specialty: "精緻剪髮 · 染髮設計",
    experience: "12年",
    image: "https://storage.googleapis.com/studio-cms-assets/projects/Nxqg26DmO1/s-1280x1280_v-fms_webp_40a7edb0-2dd9-43f1-a321-e7ff386043e7_small.webp",
  },
  {
    id: "2",
    name: "Alex Wang",
    title: "資深設計師",
    specialty: "燙髮造型 · 頭皮護理",
    experience: "8年",
    image: `${CDN}/s-960x1280_v-fms_webp_b9431a2b-1323-48f1-af38-3091c8dfd8ae_small.webp`,
  },
  {
    id: "3",
    name: "Sophia Lin",
    title: "設計師",
    specialty: "韓系剪染 · 護髮療程",
    experience: "5年",
    image: `${CDN}/s-600x864_v-fs_webp_30e9ca4b-daef-49d9-b203-a90d275bd1e7_small.webp`,
  },
  {
    id: "4",
    name: "Kevin Liu",
    title: "設計師",
    specialty: "男士剪髮 · 質感造型",
    experience: "6年",
    image: `${CDN}/s-2400x2400_v-frms_webp_c25d7de4-e518-40c7-b3f3-b0bae2bd6f53_small.webp`,
  },
];

const REVIEWS = [
  {
    id: "1",
    name: "Vivian H.",
    rating: 5,
    text: "Emily 設計師真的非常專業！剪完之後朋友一直問我去哪裡剪的，造型超符合我的臉型。",
    date: "2025年11月",
  },
  {
    id: "2",
    name: "Tommy C.",
    rating: 5,
    text: "已經固定來這邊好幾年了，每次都非常滿意。Alex 設計師很有耐心，會詳細溝通想要的效果。",
    date: "2025年12月",
  },
  {
    id: "3",
    name: "Michelle W.",
    rating: 5,
    text: "環境超舒適，Sophia 設計師的技術一流，染出來的顏色完全就是我要的！強力推薦！",
    date: "2026年1月",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={12}
          color={COLORS.gold}
        />
      ))}
    </View>
  );
}

function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentIndex];

  return (
    <View style={styles.heroContainer}>
      <Image
        source={slide.image}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={600}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.75)"]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.heroTextContainer}>
        <Text style={styles.heroTitle}>{slide.title}</Text>
        <Text style={styles.heroSubtitle}>{slide.subtitle}</Text>
      </View>
      <View style={styles.dotContainer}>
        {HERO_SLIDES.map((_, i) => (
          <Pressable
            key={i}
            onPress={() => setCurrentIndex(i)}
            style={[styles.dot, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

function SectionHeader({ title, onPress }: { title: string; onPress?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onPress && (
        <Pressable onPress={onPress} hitSlop={8}>
          <Text style={styles.sectionMore}>查看全部</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.headerBar, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
        <Text style={styles.brandName}>Found Hair</Text>
        <Pressable onPress={() => router.push("/(tabs)/booking")} hitSlop={8}>
          <View style={styles.bookBtn}>
            <Text style={styles.bookBtnText}>立即預約</Text>
          </View>
        </Pressable>
      </View>

      <HeroCarousel />

      <View style={styles.body}>
        <SectionHeader title="我們的服務" />
        <View style={styles.servicesRow}>
          {SERVICES.map((s) => (
            <View key={s.id} style={styles.serviceCard}>
              <View style={styles.serviceIconWrap}>
                <Ionicons name={s.icon} size={22} color={COLORS.gold} />
              </View>
              <Text style={styles.serviceTitle}>{s.title}</Text>
            </View>
          ))}
        </View>

        <SectionHeader
          title="設計師團隊"
          onPress={() => router.push("/(tabs)/more")}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.designersRow}
        >
          {DESIGNERS.map((d) => (
            <Pressable key={d.id} style={styles.designerCard} onPress={() => router.push("/(tabs)/booking")}>
              <Image
                source={{ uri: d.image }}
                style={styles.designerImage}
                contentFit="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.7)"]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 0, y: 1 }}
              />
              <View style={styles.designerInfo}>
                <Text style={styles.designerName}>{d.name}</Text>
                <Text style={styles.designerTitle}>{d.title}</Text>
                <Text style={styles.designerSpec}>{d.specialty}</Text>
              </View>
              <View style={styles.expBadge}>
                <Text style={styles.expText}>{d.experience}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.bannerCta}>
          <LinearGradient
            colors={["#1C1C1C", "#2A2010"]}
            style={styles.bannerGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.bannerTitle}>享受專屬美麗體驗</Text>
            <Text style={styles.bannerSubtitle}>立即預約您的造型諮詢</Text>
            <Pressable
              onPress={() => router.push("/(tabs)/booking")}
              style={({ pressed }) => [styles.bannerBtn, { opacity: pressed ? 0.85 : 1 }]}
            >
              <Text style={styles.bannerBtnText}>馬上預約</Text>
              <Feather name="arrow-right" size={16} color={COLORS.primary} />
            </Pressable>
          </LinearGradient>
        </View>

        <SectionHeader
          title="顧客評價"
          onPress={() => {}}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.reviewsRow}
        >
          {REVIEWS.map((r) => (
            <View key={r.id} style={styles.reviewCard}>
              <StarRating rating={r.rating} />
              <Text style={styles.reviewText} numberOfLines={4}>{r.text}</Text>
              <View style={styles.reviewFooter}>
                <View style={styles.reviewAvatar}>
                  <Text style={styles.reviewAvatarText}>{r.name[0]}</Text>
                </View>
                <View>
                  <Text style={styles.reviewName}>{r.name}</Text>
                  <Text style={styles.reviewDate}>{r.date}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
  },
  brandName: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    letterSpacing: 1,
  },
  bookBtn: {
    backgroundColor: COLORS.gold,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bookBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  heroContainer: {
    height: 480,
    position: "relative",
  },
  heroTextContainer: {
    position: "absolute",
    bottom: 60,
    left: 24,
    right: 24,
  },
  heroTitle: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    color: COLORS.white,
    lineHeight: 42,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.5,
  },
  dotContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.gold,
  },
  body: {
    paddingTop: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  sectionMore: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: COLORS.gold,
  },
  servicesRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 36,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    alignItems: "center",
    gap: 10,
  },
  serviceIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceTitle: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    textAlign: "center",
  },
  designersRow: {
    paddingHorizontal: 20,
    gap: 14,
    paddingBottom: 4,
    marginBottom: 36,
  },
  designerCard: {
    width: 160,
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: COLORS.primary,
  },
  designerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  designerInfo: {
    position: "absolute",
    bottom: 14,
    left: 12,
    right: 12,
  },
  designerName: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: COLORS.white,
    marginBottom: 2,
  },
  designerTitle: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: COLORS.gold,
    marginBottom: 3,
  },
  designerSpec: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
  },
  expBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  expText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: COLORS.white,
  },
  bannerCta: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 36,
  },
  bannerGrad: {
    padding: 28,
  },
  bannerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: COLORS.white,
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 20,
  },
  bannerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: COLORS.gold,
    alignSelf: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  bannerBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.primary,
  },
  reviewsRow: {
    paddingHorizontal: 20,
    gap: 14,
    paddingBottom: 4,
    marginBottom: 8,
  },
  reviewCard: {
    width: 260,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    gap: 10,
  },
  reviewText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
    lineHeight: 20,
    flex: 1,
  },
  reviewFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reviewAvatarText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
  },
  reviewName: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.primary,
  },
  reviewDate: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: COLORS.textLight,
  },
});
