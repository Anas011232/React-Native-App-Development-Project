import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // ১. useRouter ইমপোর্ট করা হয়েছে
import React, { useState } from "react";
import {
  Dimensions, Image, Platform, SafeAreaView,
  ScrollView, StatusBar, StyleSheet, Text,
  TouchableOpacity, View
} from "react-native";
import Swiper from "react-native-swiper";

import NOTICES_DATA from "../noticesData.json";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [showAllNotices, setShowAllNotices] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const router = useRouter(); // ২. রাউটার হুক ডিক্লেয়ার করা হয়েছে

  const displayedNotices = showAllNotices ? NOTICES_DATA : NOTICES_DATA.slice(0, 3);

  const getTypeColor = (type) => {
    switch (type) {
      case 'Exam': return '#FF5252';
      case 'Event': return '#448AFF';
      case 'Transport': return '#FF9800';
      default: return '#9C27B0';
    }
  };

  // ৩. নেভিগেশন ফাংশন (router.push ব্যবহার করে)
  const handleNavigation = (routeName, tabName) => {
    setActiveTab(tabName);
    if (routeName === 'Home') {
      router.push('/');
    } else {
      // routeName যদি 'faculty' হয়, তবে এটি 'app/faculty.js' এ যাবে
      router.push(`/${routeName}`); 
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent={false} />
      <SafeAreaView style={{ backgroundColor: "#fff" }} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <Image 
            source={require("../assets/images/logo.jpg")} 
            style={styles.headerSmallLogo} 
            resizeMode="contain"
          />
          <Text style={styles.headerAppName}>JKKNIU Diary</Text>
        </View>
        <TouchableOpacity style={styles.bellIcon}>
          <Ionicons name="notifications-outline" size={24} color="#152238" />
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Slider */}
        <View style={styles.sliderWrapper}>
          <Swiper autoplay height={200} activeDotColor="#fff" paginationStyle={{ bottom: 10 }}>
            <Image source={require("../assets/images/JKKNIU.jpg")} style={styles.sliderImage} />
            <Image source={require("../assets/images/lib.jpg")} style={styles.sliderImage} />
          </Swiper>
        </View>

        {/* Quick Access - ৪. এখানে রাউট নামগুলো ছোট হাতের (ফাইলের নাম অনুযায়ী) দেওয়া হয়েছে */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.quickAccessGrid}>
          <AccessBtn icon="megaphone" label="Notices" color="#EFF6FF" iconColor="#3B82F6" onPress={() => handleNavigation('NoticeList', 'Notices')} />
          <AccessBtn icon="people" label="Faculty" color="#F0FDF4" iconColor="#22C55E" onPress={() => handleNavigation('faculty', 'Faculty')} />
          <AccessBtn icon="bus" label="Bus" color="#FFF7ED" iconColor="#F97316" onPress={() => handleNavigation('BusSchedule', 'Bus')} />
          <AccessBtn icon="information-circle" label="About" color="#FAF5FF" iconColor="#A855F7" onPress={() => handleNavigation('AboutUniversity', 'More')} />
          <AccessBtn icon="book" label="Nazrul" color="#FEF2F2" iconColor="#EF4444" />
        </View>

        {/* Latest Notices */}
        <View style={styles.noticeHeader}>
          <Text style={styles.sectionTitle}>Latest Notices</Text>
          <TouchableOpacity onPress={() => setShowAllNotices(!showAllNotices)}>
            <Text style={styles.seeAllText}>{showAllNotices ? "See Less" : "See All"}</Text>
          </TouchableOpacity>
        </View>

        {displayedNotices.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.noticeCard}
            onPress={() => router.push({ pathname: '/NoticeDetails', params: item })}
          >
            <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.noticeTitleText} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.noticeDateText}>{item.date} • {item.type}</Text>
            </View>
            {item.pdf && <FontAwesome5 name="file-pdf" size={18} color="#E11D48" />}
          </TouchableOpacity>
        ))}
      </ScrollView>

     </View>
  );
}

 
  


// সাব-কম্পোনেন্ট
const AccessBtn = ({ icon, label, color, iconColor, onPress }) => (
  <TouchableOpacity style={styles.accessItem} onPress={onPress}>
    <View style={[styles.iconBox, { backgroundColor: color }]}>
      <Ionicons name={icon} size={24} color={iconColor} />
    </View>
    <Text style={styles.accessLabel}>{label}</Text>
  </TouchableOpacity>
);

const TabItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.tabIconCircle, active && styles.activeTabCircle]}>
      <Ionicons 
        name={active ? icon : `${icon}-outline`} 
        size={active ? 24 : 22} 
        color={active ? "#D10069" : "#64748B"} 
      />
    </View>
    <Text style={[styles.tabLabel, { color: active ? "#D10069" : "#64748B" }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 15, 
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    backgroundColor: '#fff',
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5
  },
  brandGroup: { flexDirection: 'row', alignItems: 'center' },
  headerSmallLogo: { width: 35, height: 35, marginRight: 10 },
  headerAppName: { fontSize: 18, fontWeight: '800', color: '#0F172A' },
  bellIcon: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 12 },
  notifBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, backgroundColor: '#EF4444', borderRadius: 4, borderWidth: 1.5, borderColor: '#fff' },
  scrollContent: { paddingBottom: 120 },
  sliderWrapper: { height: 180, margin: 20, borderRadius: 20, overflow: 'hidden', elevation: 5 },
  sliderImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B', marginLeft: 20, marginTop: 15, marginBottom: 15 },
  quickAccessGrid: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 10 },
  accessItem: { alignItems: 'center', width: (width - 40) / 5 },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  accessLabel: { fontSize: 10, marginTop: 6, color: '#475569', fontWeight: '700' },
  noticeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20, marginTop: 10 },
  seeAllText: { color: '#166534', fontWeight: '800', fontSize: 13 },
  noticeCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    marginHorizontal: 20, padding: 15, borderRadius: 16, marginBottom: 12,
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5
  },
  typeIndicator: { width: 4, height: 40, borderRadius: 2, marginRight: 15 },
  noticeTitleText: { fontSize: 14, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  noticeDateText: { fontSize: 12, color: '#94A3B8' },
  bottomTabContainer: {
    flexDirection: 'row', position: 'absolute', bottom: 0, width: '100%',
    height: Platform.OS === 'ios' ? 95 : 110, backgroundColor: '#fff',
    borderTopLeftRadius: 25, borderTopRightRadius: 25,
    justifyContent: 'space-around', alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 35, elevation: 30
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  tabIconCircle: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  activeTabCircle: { backgroundColor: '#FFF0F6' },
  tabLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 }
});