import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

const NEWS_ITEMS = [
  {
    id: "1",
    tag: "公告",
    tagColor: "#E74C3C",
    title: "2026年3月公休日通知",
    date: "2026.03.01",
    preview: "親愛的顧客您好，以下為本月公休日安排，請提前預約以免向隅。",
    content: `親愛的顧客您好，

以下為 Found Hair 3月份公休日安排：

信義店
• 3月3日（週一）公休
• 3月10日（週一）公休
• 3月17日（週一）公休
• 3月24日（週一）公休

東區店
• 3月4日（週二）公休
• 3月11日（週二）公休
• 3月18日（週二）公休
• 3月25日（週二）公休

如需預約，請透過APP或電話提前預約，我們將竭誠為您服務。

謝謝您的配合！
Found Hair 團隊`,
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&q=80",
  },
  {
    id: "2",
    tag: "美髮知識",
    tagColor: COLORS.gold,
    title: "春季護髮全攻略：讓秀髮煥然一新",
    date: "2026.02.20",
    preview: "換季時節，頭皮與髮絲需要特別的呵護。本篇將分享專業設計師的春季護髮秘訣。",
    content: `春天來臨，氣候轉變容易導致頭皮出油、頭髮乾燥分叉。以下是我們首席設計師 Emily Chen 的春季護髮建議：

一、加強保濕
換季時，頭髮容易缺水。建議每週使用一次深層護髮膜，重點護理髮尾。選擇含有玻尿酸或胺基酸成分的護髮產品效果最佳。

二、頭皮清潔
春季溫度升高，頭皮皮脂分泌增加，建議每2-3天洗一次頭，使用清爽型洗髮精保持頭皮健康。

三、減少熱風傷害
吹髮時保持30公分距離，溫度不超過120度，並使用護髮噴霧保護髮絲。

四、定期修剪
建議每6-8週修剪一次髮尾，去除分叉，讓頭髮保持健康光澤。

如果您需要專業護髮諮詢，歡迎預約我們的免費造型諮詢服務！`,
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&q=80",
  },
  {
    id: "3",
    tag: "優惠活動",
    tagColor: "#27AE60",
    title: "春季染髮優惠 · 現在預約享85折",
    date: "2026.02.15",
    preview: "春暖花開，換個心情換個髮色！即日起至3月31日，染髮服務享85折優惠。",
    content: `春暖花開，是改變形象的最佳時機！

活動內容：
即日起至 2026年3月31日，全館染髮服務享 85折優惠

適用範圍：
• 單色染
• 挑染 / 漸層染
• 特殊色系
• 局部補色

注意事項：
• 需搭配剪髮服務使用
• 每位顧客限用一次
• 不與其他優惠併用
• 預約時請告知使用優惠

三月份染髮流行色推薦：
1. 奶茶棕 - 溫柔知性感
2. 玫瑰金 - 女神氣場
3. 炭灰色 - 現代時尚
4. 暖橙棕 - 活力青春

快來預約，讓我們的設計師為您打造春天最美的樣子！`,
    image: "https://www.shima-hair.com/wp-content/uploads/2026/03/97841d3e7732a73733291e7287213507-640x960.jpg",
  },
  {
    id: "4",
    tag: "新品介紹",
    tagColor: "#8E44AD",
    title: "全新引進日本頂級護髮療程",
    date: "2026.02.05",
    preview: "我們最新引進來自日本的 TOKIO INKARAMI 頂級修護療程，讓受損髮絲重生。",
    content: `Found Hair 隆重引進日本頂級護髮品牌 TOKIO INKARAMI！

TOKIO INKARAMI 是什麼？
這是來自日本的頂級修護療程，以獨特的「親水性水解膠原蛋白」為核心成分，能深層滲透髮絲，從內部修復受損結構。

適合哪些頭髮？
• 燙染後受損的頭髮
• 乾燥易斷裂的髮絲
• 缺乏光澤的頭髮
• 靜電問題嚴重的頭髮

療程效果：
✓ 即刻感受光滑柔順
✓ 修復燙染造成的傷害
✓ 長效維持約2-3個月
✓ 增加頭髮強度與韌性

療程費用：
• 短髮：NT$ 1,800
• 中長髮：NT$ 2,400
• 長髮：NT$ 3,000起

預約特惠：本月首推優惠，加購剪髮享九折！`,
    image: "https://www.shima-hair.com/wp-content/uploads/2026/03/657223c49075976474b40dd881ebebf2-640x853.jpg",
  },
];

export default function NewsScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<(typeof NEWS_ITEMS)[0] | null>(null);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === "web" ? 48 : 0) }]}>
        <Text style={styles.headerTitle}>最新消息</Text>
        <Text style={styles.headerSub}>Found Hair 官方公告與美髮資訊</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {NEWS_ITEMS.map((item, idx) => (
          <Pressable
            key={item.id}
            style={({ pressed }) => [styles.newsCard, { opacity: pressed ? 0.95 : 1 }]}
            onPress={() => setSelected(item)}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.newsImage}
              contentFit="cover"
            />
            <View style={styles.newsContent}>
              <View style={styles.newsTop}>
                <View style={[styles.newsTag, { backgroundColor: item.tagColor }]}>
                  <Text style={styles.newsTagText}>{item.tag}</Text>
                </View>
                <Text style={styles.newsDate}>{item.date}</Text>
              </View>
              <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.newsPreview} numberOfLines={2}>{item.preview}</Text>
              <View style={styles.readMore}>
                <Text style={styles.readMoreText}>閱讀全文</Text>
                <Feather name="arrow-right" size={14} color={COLORS.gold} />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <Modal
        visible={!!selected}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelected(null)}
      >
        {selected && (
          <View style={styles.articleContainer}>
            <View style={styles.articleHeader}>
              <Pressable onPress={() => setSelected(null)} hitSlop={12}>
                <Feather name="x" size={22} color={COLORS.primary} />
              </Pressable>
              <Text style={styles.articleHeaderTitle}>最新消息</Text>
              <View style={{ width: 22 }} />
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
              <Image
                source={{ uri: selected.image }}
                style={styles.articleImage}
                contentFit="cover"
              />
              <View style={styles.articleBody}>
                <View style={styles.articleMeta}>
                  <View style={[styles.newsTag, { backgroundColor: selected.tagColor }]}>
                    <Text style={styles.newsTagText}>{selected.tag}</Text>
                  </View>
                  <Text style={styles.newsDate}>{selected.date}</Text>
                </View>
                <Text style={styles.articleTitle}>{selected.title}</Text>
                <Text style={styles.articleContent}>{selected.content}</Text>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
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
    paddingBottom: 12,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
  },
  newsCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  newsImage: {
    width: "100%",
    height: 180,
  },
  newsContent: {
    padding: 16,
    gap: 8,
  },
  newsTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  newsTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newsTagText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    color: COLORS.white,
  },
  newsDate: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: COLORS.textLight,
  },
  newsTitle: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    lineHeight: 24,
  },
  newsPreview: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  readMore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  readMoreText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.gold,
  },
  articleContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  articleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  articleHeaderTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.primary,
  },
  articleImage: {
    width: "100%",
    height: 260,
  },
  articleBody: {
    padding: 20,
    gap: 12,
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  articleTitle: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    color: COLORS.primary,
    lineHeight: 30,
  },
  articleContent: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: COLORS.textSecondary,
    lineHeight: 26,
    marginTop: 4,
  },
});
