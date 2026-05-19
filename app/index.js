import { useRouter } from "expo-router"; // ১. Router ইমপোর্ট করা হয়েছে
import { Bus, GraduationCap, Home, Info, Megaphone, Search, User, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const CampusConnect = () => {
  const router = useRouter(); // ২. রাউটার হুক ডিক্লেয়ার
  const [activeTab, setActiveTab] = useState("Home");

  // ৩. নেভিগেশন হ্যান্ডলার ফাংশন
  const handleNavigation = (routeName, tabName) => {
    setActiveTab(tabName);
    if (routeName === 'Home') {
      router.push('/');
    } else {
      router.push(`/${routeName}`); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* --- TopAppBar --- */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/40' }} 
            style={styles.profilePic} 
          />
          <Text style={styles.headerTitle}>Campus Connect</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Search size={22} color="#004f45" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- Search Bar --- */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6e7976" style={styles.searchIcon} />
            <TextInput 
              placeholder="Search academics, events, maps..." 
              placeholderTextColor="#6e7976"
              style={styles.input}
            />
          </View>
        </View>

        {/* --- Hero Banner --- */}
        <View style={styles.heroBanner}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=600' }} 
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTag}>CAMPUS LIFE</Text>
            <Text style={styles.heroTitle}>Green Campus, Great Minds.</Text>
            <View style={styles.pagination}>
              <View style={[styles.dot, styles.activeDot]} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </View>

        {/* --- Explore Campus Grid --- */}
        <Text style={styles.sectionTitle}>Explore Campus</Text>
        <View style={styles.grid}>
          {/* ৪. এখানে ফাইলের নাম অনুযায়ী রাউটিং সেট করা হয়েছে */}
          <ExploreItem 
            icon={<Megaphone size={24} color="#004f45" />} 
            label="Notices" 
            color="#a0f2e1" 
            onPress={() => handleNavigation('NoticeList', 'Notices')} 
          />
          <ExploreItem 
            icon={<Users size={24} color="#795900" />} 
            label="Faculty" 
            color="#ffdea0" 
            onPress={() => handleNavigation('faculty', 'Faculty')} 
          />
          <ExploreItem 
            icon={<Bus size={24} color="#005111" />} 
            label="Transport" 
            color="#a3f69c" 
            onPress={() => handleNavigation('BusSchedule', 'Bus')} 
          />
          <ExploreItem 
            icon={<Info size={24} color="#3e4946" />} 
            label="About" 
            color="#e0e3e6" 
            onPress={() => handleNavigation('AboutUniversity', 'More')} 
          />
        </View>

        {/* --- Latest Notices Section --- */}
        <View style={styles.noticeHeader}>
          <Text style={styles.sectionTitle}>Latest Notices</Text>
          <TouchableOpacity onPress={() => handleNavigation('NoticeList', 'Notices')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.noticeList}>
          {/* ৫. ক্লিক করলে ডিটেইলস পেজে প্যারামিটারসহ যাবে */}
          <NoticeCard 
            date="24" month="OCT" 
            title="Final Examination Schedule for Fall Semester 2024" 
            onPress={() => router.push({ pathname: '/NoticeDetails', params: { id: 1, title: 'Final Exam...' } })}
          />
          <NoticeCard 
            date="21" month="OCT" 
            title="Inter-Department Cricket Tournament Registration" 
            onPress={() => router.push({ pathname: '/NoticeDetails', params: { id: 2, title: 'Cricket Tournament...' } })}
          />
          <NoticeCard 
            date="18" month="OCT" 
            title="Scholarship Application Deadline Extension" 
            onPress={() => router.push({ pathname: '/NoticeDetails', params: { id: 3, title: 'Scholarship...' } })}
          />
        </View>

      </ScrollView>

      {/* --- Bottom NavBar (Dynamic Active State) --- */}
      <View style={styles.bottomNav}>
        <BottomNavItem 
          icon={<Home size={22} />} 
          label="Home" 
          active={activeTab === "Home"} 
          onPress={() => handleNavigation('Home', 'Home')} 
        />
        <BottomNavItem 
          icon={<GraduationCap size={22} />} 
          label="Academics" 
          active={activeTab === "Academics"} 
          onPress={() => handleNavigation('Academics', 'Academics')} 
        />
        <BottomNavItem 
          icon={<Bus size={22} />} 
          label="Transport" 
          active={activeTab === "Bus"} 
          onPress={() => handleNavigation('BusSchedule', 'Bus')} 
        />
        <BottomNavItem 
          icon={<User size={22} />} 
          label="Profile" 
          active={activeTab === "Profile"} 
          onPress={() => handleNavigation('Profile', 'Profile')} 
        />
      </View>
    </SafeAreaView>
  );
};

// --- সাব-কম্পোনেন্টসমূহ (Sub-components) ---

const ExploreItem = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.gridItem} onPress={onPress}>
    <View style={[styles.iconContainer, { backgroundColor: color }]}>{icon}</View>
    <Text style={styles.gridLabel}>{label}</Text>
  </TouchableOpacity>
);

const NoticeCard = ({ date, month, title, onPress }) => (
  <TouchableOpacity style={styles.noticeCard} onPress={onPress}>
    <View style={styles.dateBox}>
      <Text style={styles.monthText}>{month}</Text>
      <Text style={styles.dateText}>{date}</Text>
    </View>
    <Text style={styles.noticeTitle} numberOfLines={2}>{title}</Text>
  </TouchableOpacity>
);

const BottomNavItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity 
    style={active ? styles.activeNavItem : styles.navItem} 
    onPress={onPress}
  >
    {React.cloneElement(icon, { color: active ? "#ffdea0" : "#004f4599" })}
    <Text style={active ? styles.activeNavText : styles.navText}>{label}</Text>
  </TouchableOpacity>
);

// --- স্টাইলসমূহ (Styles) ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafd' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#004f45',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    paddingTop: Platform.OS === 'android' ? 35 : 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profilePic: { width: 40, height: 40, borderRadius: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#004f45' },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f4f7', justifyContent: 'center', alignItems: 'center' },
  
  searchSection: { marginVertical: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebeef1',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#181c1e' },

  heroBanner: { height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 30 },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    padding: 20, 
    justifyContent: 'flex-end' 
  },
  heroTag: { color: '#fff', fontSize: 10, fontWeight: 'bold', letterSpacing: 2, marginBottom: 5 },
  heroTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  pagination: { flexDirection: 'row', gap: 6, marginTop: 15 },
  dot: { width: 6, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' },
  activeDot: { width: 24, backgroundColor: '#fff' },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#181c1e', marginBottom: 15 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  gridItem: { alignItems: 'center', width: '22%' },
  iconContainer: { width: 56, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  gridLabel: { fontSize: 11, fontWeight: '600', color: '#6e7976', textTransform: 'uppercase', marginTop: 8 },

  noticeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { color: '#004f45', fontSize: 14, fontWeight: '600' },
  noticeList: { gap: 12 },
  noticeCard: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    gap: 16,
    shadowColor: '#004f45',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    elevation: 2,
  },
  dateBox: { width: 60, height: 60, backgroundColor: '#f1f4f7', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  monthText: { fontSize: 10, fontWeight: '700', color: '#6e7976' },
  dateText: { fontSize: 20, fontWeight: '800', color: '#004f45' },
  noticeTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#181c1e', lineHeight: 20 },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
    paddingHorizontal: 15,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'space-around',
    width: '100%',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  navItem: { alignItems: 'center', padding: 8, flex: 1 },
  activeNavItem: { 
    backgroundColor: '#004f45', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 16,
    gap: 6,
    marginHorizontal: 5
  },
  navText: { fontSize: 10, color: '#004f4599', fontWeight: '500', marginTop: 4, textTransform: 'uppercase' },
  activeNavText: { fontSize: 10, color: '#ffdea0', fontWeight: '700', textTransform: 'uppercase' }
});

export default CampusConnect;