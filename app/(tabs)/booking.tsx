import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Ionicons, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { COLORS } from "@/constants/colors";

const BRANCHES = [
  {
    id: "1",
    name: "信義店",
    address: "台北市信義區信義路五段7號",
    phone: "02-2723-8899",
  },
  {
    id: "2",
    name: "東區店",
    address: "台北市大安區忠孝東路四段181號",
    phone: "02-2771-5588",
  },
];

const DESIGNERS_BY_BRANCH: Record<string, typeof DESIGNERS_ALL> = {
  "1": [
    { id: "1", name: "Emily Chen", title: "首席設計師", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&q=80" },
    { id: "2", name: "Alex Wang", title: "資深設計師", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&q=80" },
    { id: "3", name: "Sophia Lin", title: "設計師", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
  ],
  "2": [
    { id: "4", name: "Kevin Liu", title: "設計師", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80" },
    { id: "5", name: "Amy Chou", title: "資深設計師", image: "https://images.unsplash.com/photo-1494790108755-2616b332c1c8?w=300&q=80" },
    { id: "6", name: "Brian Hsu", title: "設計師", image: "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=300&q=80" },
  ],
};

const DESIGNERS_ALL = [
  { id: "1", name: "Emily Chen", title: "首席設計師", image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&q=80" },
];

const SERVICES = [
  { id: "1", name: "剪髮", duration: "60分鐘", price: "NT$ 800" },
  { id: "2", name: "染髮", duration: "90-120分鐘", price: "NT$ 2,200起" },
  { id: "3", name: "燙髮", duration: "120-180分鐘", price: "NT$ 3,500起" },
  { id: "4", name: "護髮療程", duration: "45分鐘", price: "NT$ 1,200起" },
  { id: "5", name: "剪髮 + 染髮", duration: "150分鐘", price: "NT$ 2,800起" },
  { id: "6", name: "造型諮詢", duration: "30分鐘", price: "免費" },
];

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30", "18:00",
];

function generateDates() {
  const dates: { date: Date; label: string; day: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayNames = ["日", "一", "二", "三", "四", "五", "六"];
    dates.push({
      date: d,
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      day: `週${dayNames[d.getDay()]}`,
    });
  }
  return dates;
}

const DATES = generateDates();

type Step = 1 | 2 | 3 | 4 | 5;

export default function BookingScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [step, setStep] = useState<Step>(1);
  const [branch, setBranch] = useState<(typeof BRANCHES)[0] | null>(null);
  const [designer, setDesigner] = useState<(typeof DESIGNERS_ALL)[0] | null>(null);
  const [service, setService] = useState<(typeof SERVICES)[0] | null>(null);
  const [dateIdx, setDateIdx] = useState<number | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const designers = branch ? DESIGNERS_BY_BRANCH[branch.id] : [];

  const handleNext = () => {
    if (step < 5) {
      setStep((step + 1) as Step);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((step - 1) as Step);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  };

  const canProceed = () => {
    if (step === 1) return !!branch;
    if (step === 2) return !!designer;
    if (step === 3) return !!service;
    if (step === 4) return dateIdx !== null && !!timeSlot;
    if (step === 5) return name.trim().length > 0 && phone.trim().length >= 8;
    return false;
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const booking = {
      id: Date.now().toString(),
      branch: branch?.name,
      designer: designer?.name,
      service: service?.name,
      date: dateIdx !== null ? DATES[dateIdx].label : "",
      time: timeSlot,
      name,
      phone,
      note,
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = await AsyncStorage.getItem("bookings");
      const list = existing ? JSON.parse(existing) : [];
      list.push(booking);
      await AsyncStorage.setItem("bookings", JSON.stringify(list));
    } catch {}
    setShowSuccess(true);
  };

  const resetForm = () => {
    setStep(1);
    setBranch(null);
    setDesigner(null);
    setService(null);
    setDateIdx(null);
    setTimeSlot(null);
    setName("");
    setPhone("");
    setNote("");
    setShowSuccess(false);
  };

  const STEP_LABELS = ["選分店", "選設計師", "選服務", "選時間", "確認"];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) }]}>
        <View style={styles.headerTop}>
          {step > 1 ? (
            <Pressable onPress={handleBack} hitSlop={12}>
              <Feather name="arrow-left" size={22} color={COLORS.primary} />
            </Pressable>
          ) : (
            <View style={{ width: 22 }} />
          )}
          <Text style={styles.headerTitle}>預約</Text>
          <View style={{ width: 22 }} />
        </View>
        <View style={styles.stepIndicator}>
          {STEP_LABELS.map((label, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={[styles.stepDot, i + 1 <= step && styles.stepDotActive]}>
                {i + 1 < step ? (
                  <Feather name="check" size={10} color={COLORS.white} />
                ) : (
                  <Text style={[styles.stepNum, i + 1 <= step && styles.stepNumActive]}>
                    {i + 1}
                  </Text>
                )}
              </View>
              {i < STEP_LABELS.length - 1 && (
                <View style={[styles.stepLine, i + 1 < step && styles.stepLineActive]} />
              )}
            </View>
          ))}
        </View>
        <Text style={styles.stepLabel}>{STEP_LABELS[step - 1]}</Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.body}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
      >
        {step === 1 && (
          <View style={styles.section}>
            <Text style={styles.stepTitle}>請選擇門市</Text>
            {BRANCHES.map((b) => (
              <Pressable
                key={b.id}
                style={[styles.optionCard, branch?.id === b.id && styles.optionCardActive]}
                onPress={() => { setBranch(b); setDesigner(null); Haptics.selectionAsync(); }}
              >
                <View style={styles.optionIcon}>
                  <Ionicons name="location-outline" size={22} color={branch?.id === b.id ? COLORS.gold : COLORS.textSecondary} />
                </View>
                <View style={styles.optionText}>
                  <Text style={[styles.optionTitle, branch?.id === b.id && styles.optionTitleActive]}>
                    Found Hair {b.name}
                  </Text>
                  <Text style={styles.optionSub}>{b.address}</Text>
                  <Text style={styles.optionSub}>{b.phone}</Text>
                </View>
                {branch?.id === b.id && (
                  <Feather name="check-circle" size={20} color={COLORS.gold} />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {step === 2 && (
          <View style={styles.section}>
            <Text style={styles.stepTitle}>請選擇設計師</Text>
            {designers.map((d) => (
              <Pressable
                key={d.id}
                style={[styles.designerCard, designer?.id === d.id && styles.optionCardActive]}
                onPress={() => { setDesigner(d); Haptics.selectionAsync(); }}
              >
                <Image source={{ uri: d.image }} style={styles.designerAvatar} contentFit="cover" />
                <View style={styles.designerInfo}>
                  <Text style={[styles.designerName, designer?.id === d.id && styles.optionTitleActive]}>
                    {d.name}
                  </Text>
                  <Text style={styles.designerTitle}>{d.title}</Text>
                </View>
                {designer?.id === d.id && (
                  <Feather name="check-circle" size={20} color={COLORS.gold} />
                )}
              </Pressable>
            ))}
          </View>
        )}

        {step === 3 && (
          <View style={styles.section}>
            <Text style={styles.stepTitle}>請選擇服務項目</Text>
            {SERVICES.map((s) => (
              <Pressable
                key={s.id}
                style={[styles.serviceCard, service?.id === s.id && styles.optionCardActive]}
                onPress={() => { setService(s); Haptics.selectionAsync(); }}
              >
                <View style={styles.serviceInfo}>
                  <Text style={[styles.serviceName, service?.id === s.id && styles.optionTitleActive]}>
                    {s.name}
                  </Text>
                  <Text style={styles.serviceDuration}>{s.duration}</Text>
                </View>
                <View style={styles.serviceRight}>
                  <Text style={[styles.servicePrice, service?.id === s.id && { color: COLORS.gold }]}>
                    {s.price}
                  </Text>
                  {service?.id === s.id && (
                    <Feather name="check-circle" size={18} color={COLORS.gold} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {step === 4 && (
          <View style={styles.section}>
            <Text style={styles.stepTitle}>請選擇日期</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
              {DATES.map((d, i) => (
                <Pressable
                  key={i}
                  style={[styles.dateBtn, dateIdx === i && styles.dateBtnActive]}
                  onPress={() => { setDateIdx(i); Haptics.selectionAsync(); }}
                >
                  <Text style={[styles.dateDay, dateIdx === i && styles.dateDayActive]}>{d.day}</Text>
                  <Text style={[styles.dateLabel, dateIdx === i && styles.dateLabelActive]}>{d.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={[styles.stepTitle, { marginTop: 24 }]}>請選擇時間</Text>
            <View style={styles.slotsGrid}>
              {TIME_SLOTS.map((t) => (
                <Pressable
                  key={t}
                  style={[styles.timeSlot, timeSlot === t && styles.timeSlotActive]}
                  onPress={() => { setTimeSlot(t); Haptics.selectionAsync(); }}
                >
                  <Text style={[styles.timeText, timeSlot === t && styles.timeTextActive]}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === 5 && (
          <View style={styles.section}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>預約摘要</Text>
              {[
                { label: "門市", value: `Found Hair ${branch?.name}` },
                { label: "設計師", value: designer?.name ?? "" },
                { label: "服務", value: service?.name ?? "" },
                { label: "日期", value: dateIdx !== null ? `${DATES[dateIdx].label} (${DATES[dateIdx].day})` : "" },
                { label: "時間", value: timeSlot ?? "" },
              ].map((row) => (
                <View key={row.label} style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{row.label}</Text>
                  <Text style={styles.summaryValue}>{row.value}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.stepTitle, { marginTop: 24 }]}>聯絡資訊</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>姓名 *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="請輸入您的姓名"
                placeholderTextColor={COLORS.textLight}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>手機號碼 *</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="09XX-XXX-XXX"
                placeholderTextColor={COLORS.textLight}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>備註（選填）</Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                value={note}
                onChangeText={setNote}
                placeholder="特殊需求或問題"
                placeholderTextColor={COLORS.textLight}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 16 }]}>
        <Pressable
          style={[styles.nextBtn, !canProceed() && styles.nextBtnDisabled]}
          onPress={step === 5 ? handleSubmit : handleNext}
          disabled={!canProceed()}
        >
          <Text style={styles.nextBtnText}>
            {step === 5 ? "確認預約" : "下一步"}
          </Text>
          {step < 5 && <Feather name="arrow-right" size={18} color={COLORS.white} />}
        </Pressable>
      </View>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.successOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Feather name="check" size={36} color={COLORS.white} />
            </View>
            <Text style={styles.successTitle}>預約成功！</Text>
            <Text style={styles.successMsg}>
              我們已收到您的預約申請{"\n"}門市將以簡訊確認預約時間
            </Text>
            <View style={styles.successDetail}>
              <Text style={styles.successDetailText}>
                {`Found Hair ${branch?.name}\n${designer?.name} | ${service?.name}\n${dateIdx !== null ? DATES[dateIdx].label : ""} ${timeSlot}`}
              </Text>
            </View>
            <Pressable style={styles.successBtn} onPress={resetForm}>
              <Text style={styles.successBtnText}>返回首頁</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: COLORS.gold,
  },
  stepNum: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: COLORS.textLight,
  },
  stepNumActive: {
    color: COLORS.white,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  stepLineActive: {
    backgroundColor: COLORS.gold,
  },
  stepLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: COLORS.textSecondary,
  },
  body: { flex: 1 },
  section: { padding: 20 },
  stepTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    gap: 12,
  },
  optionCardActive: {
    borderColor: COLORS.gold,
    backgroundColor: "#FFFDF8",
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: { flex: 1 },
  optionTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.primary,
    marginBottom: 3,
  },
  optionTitleActive: { color: COLORS.gold },
  optionSub: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  designerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    gap: 14,
  },
  designerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  designerInfo: { flex: 1 },
  designerName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.primary,
    marginBottom: 3,
  },
  designerTitle: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
  },
  serviceInfo: { flex: 1 },
  serviceName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.primary,
    marginBottom: 3,
  },
  serviceDuration: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
  },
  serviceRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  servicePrice: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
  },
  datesRow: {
    gap: 10,
    paddingBottom: 4,
  },
  dateBtn: {
    width: 60,
    height: 70,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dateBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dateDay: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: COLORS.textSecondary,
  },
  dateDayActive: { color: "rgba(255,255,255,0.7)" },
  dateLabel: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
  },
  dateLabelActive: { color: COLORS.white },
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  timeSlot: {
    width: "22%",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.borderLight,
    alignItems: "center",
  },
  timeSlotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: COLORS.primary,
  },
  timeTextActive: { color: COLORS.white },
  summaryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    paddingBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.primary,
  },
  inputGroup: { marginBottom: 16 },
  inputLabel: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: COLORS.primary,
  },
  inputMulti: {
    height: 80,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  footer: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  nextBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: COLORS.white,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  successCard: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 360,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gold,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  successMsg: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  successDetail: {
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 16,
    width: "100%",
    marginBottom: 24,
  },
  successDetailText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: COLORS.primary,
    lineHeight: 22,
    textAlign: "center",
  },
  successBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 48,
  },
  successBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: COLORS.white,
  },
});
