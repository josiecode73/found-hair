import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  Modal,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_PAD = 16;
const CARD_GAP = 10;
const CARD_WIDTH = (SCREEN_WIDTH - GRID_PAD * 2 - CARD_GAP) / 2;

const CATEGORIES = ["全部", "剪髮", "染髮", "燙髮", "護髮"];

const SHIMA = "https://www.shima-hair.com/wp-content/uploads";

const GALLERY_ITEMS = [
  {
    id: "1",
    category: "剪髮",
    designer: "Emily Chen",
    desc: "自然感層次剪裁",
    image: `${SHIMA}/2026/03/803761337409e75589ce06f2cb57afed-640x853.jpg`,
  },
  {
    id: "2",
    category: "染髮",
    designer: "Sophia Lin",
    desc: "橄欖米棕漸層染",
    image: `${SHIMA}/2026/03/6c47272eaed3cb1c32b292160cfcce85-640x853.jpg`,
  },
  {
    id: "3",
    category: "燙髮",
    designer: "Alex Wang",
    desc: "活力感微燙短髮",
    image: `${SHIMA}/2026/03/e70fd31f274e0984a5ab519319f33a09-640x853.jpg`,
  },
  {
    id: "4",
    category: "剪髮",
    designer: "Kevin Liu",
    desc: "直髮感層次剪裁",
    image: `${SHIMA}/2026/03/48b93050bd8f5fe3b5e311fe63590ef3-640x853.jpg`,
  },
  {
    id: "5",
    category: "染髮",
    designer: "Emily Chen",
    desc: "深邃灰棕層次染",
    image: `${SHIMA}/2026/03/MIYUU-HIT-640x958.jpg`,
  },
  {
    id: "6",
    category: "護髮",
    designer: "Sophia Lin",
    desc: "摩卡棕護髮療程",
    image: `${SHIMA}/2026/03/657223c49075976474b40dd881ebebf2-640x853.jpg`,
  },
  {
    id: "7",
    category: "染髮",
    designer: "Brian Hsu",
    desc: "榛果米棕長層次",
    image: `${SHIMA}/2026/03/5d3dc2cfab36d12f09509f209a1814b7-640x853.jpg`,
  },
  {
    id: "8",
    category: "剪髮",
    designer: "Amy Chou",
    desc: "鬆鬆狼尾層次剪",
    image: `${SHIMA}/2026/03/eb878993024708315efc7e14ca447610-640x853.jpg`,
  },
  {
    id: "9",
    category: "染髮",
    designer: "Kevin Liu",
    desc: "果凍奶棕質感髮色",
    image: `${SHIMA}/2026/03/97841d3e7732a73733291e7287213507-640x960.jpg`,
  },
  {
    id: "10",
    category: "護髮",
    designer: "Amy Chou",
    desc: "灰米棕護髮療程",
    image: `${SHIMA}/2026/03/c8f5f9ab99b3c7d77b394fcaf27d4ec2-640x854.jpg`,
  },
  {
    id: "11",
    category: "染髮",
    designer: "Sophia Lin",
    desc: "亮感橄欖米棕",
    image: `${SHIMA}/2026/03/b3596bd6dc9116d8e14e23b10686d833-640x853.jpg`,
  },
  {
    id: "12",
    category: "剪髮",
    designer: "Emily Chen",
    desc: "柔美感短髮層次",
    image: `${SHIMA}/2026/03/SAYAKA-HIT1-1-640x854.jpg`,
  },
];

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState("全部");
  const [selected, setSelected] = useState<(typeof GALLERY_ITEMS)[0] | null>(null);

  const filtered =
    activeCategory === "全部"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((g) => g.category === activeCategory);

  const leftCol = filtered.filter((_, i) => i % 2 === 0);
  const rightCol = filtered.filter((_, i) => i % 2 !== 0);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + (Platform.OS === "web" ? 67 : 0) },
        ]}
      >
        <Text style={styles.headerTitle}>作品集</Text>
        <Text style={styles.headerSub}>設計師最新作品</Text>
      </View>

      <View style={styles.catWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catRow}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.catBtn, activeCategory === cat && styles.catBtnActive]}
            >
              <Text
                style={[styles.catText, activeCategory === cat && styles.catTextActive]}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.gridContainer,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        <View style={styles.grid}>
          <View style={styles.column}>
            {leftCol.map((item) => (
              <GalleryCard key={item.id} item={item} onPress={() => setSelected(item)} />
            ))}
          </View>
          <View style={[styles.column, { marginLeft: CARD_GAP }]}>
            {rightCol.map((item) => (
              <GalleryCard key={item.id} item={item} onPress={() => setSelected(item)} />
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelected(null)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            {selected && (
              <>
                <Image
                  source={{ uri: selected.image }}
                  style={styles.modalImage}
                  contentFit="cover"
                />
                <View style={styles.modalInfo}>
                  <Text style={styles.modalDesc}>{selected.desc}</Text>
                  <View style={styles.modalMeta}>
                    <View style={styles.modalTag}>
                      <Text style={styles.modalTagText}>{selected.category}</Text>
                    </View>
                    <Text style={styles.modalDesigner}>by {selected.designer}</Text>
                  </View>
                </View>
                <Pressable
                  style={styles.modalClose}
                  onPress={() => setSelected(null)}
                >
                  <Feather name="x" size={20} color={COLORS.primary} />
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function GalleryCard({
  item,
  onPress,
}: {
  item: (typeof GALLERY_ITEMS)[0];
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: item.image }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <View style={styles.cardCategoryBadge}>
        <Text style={styles.cardCategoryText}>{item.category}</Text>
      </View>
      <View style={styles.cardOverlay}>
        <Text style={styles.cardDesc} numberOfLines={1}>{item.desc}</Text>
        <Text style={styles.cardDesigner} numberOfLines={1}>{item.designer}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
  },
  catWrapper: {
    height: 52,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 8,
  },
  catRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  catBtn: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8,
  },
  catBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  catText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: COLORS.textSecondary,
  },
  catTextActive: {
    color: "#FFFFFF",
  },
  gridContainer: {
    paddingHorizontal: GRID_PAD,
    paddingTop: 4,
  },
  grid: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.35,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: COLORS.border,
    marginBottom: CARD_GAP,
  },
  cardCategoryBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: COLORS.gold,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  cardCategoryText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cardDesc: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  cardDesigner: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.75)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
    maxWidth: 380,
  },
  modalImage: {
    width: "100%",
    height: 340,
  },
  modalInfo: {
    padding: 20,
  },
  modalDesc: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    marginBottom: 10,
  },
  modalMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
  },
  modalTagText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.gold,
  },
  modalDesigner: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
  },
  modalClose: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
});
