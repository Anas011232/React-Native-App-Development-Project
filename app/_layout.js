import { Ionicons } from "@expo/vector-icons";
import { Stack, usePathname, useRouter } from "expo-router";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const router = useRouter();
  const pathname = usePathname();

  // কোন পেজে থাকলে কোন ট্যাব হাইলাইট হবে তার লজিক
  const isActive = (route) => pathname === route;

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      {/* মেইন পেজগুলো এখানে লোড হবে */}
      <Stack screenOptions={{ headerShown: false }} />

      {/* Global Bottom Tab Navigation */}
      <View style={styles.bottomTabContainer}>
        <TabItem 
          icon="home" label="Home" 
          active={isActive('/')} 
          onPress={() => router.push('/')} 
        />
        <TabItem 
          icon="notifications" label="Notices" 
          active={isActive('/NoticeList')} 
          onPress={() => router.push('/NoticeList')} 
        />
        <TabItem 
          icon="people" label="Faculty" 
          active={isActive('/faculty') || pathname.includes('teacher')} 
          onPress={() => router.push('/faculty')} 
        />
        <TabItem 
          icon="bus" label="Bus" 
          active={isActive('/BusSchedule')} 
          onPress={() => router.push('/BusSchedule')} 
        />
        <TabItem 
          icon="grid" label="Menu" 
          active={isActive('/AdminDashboard')} 
          onPress={() => router.push('/AdminDashboard')} 
        />
      </View>
      
      {Platform.OS === 'android' && <View style={{ height: 5, backgroundColor: '#fff' }} />}
    </SafeAreaProvider>
  );
}

// কাস্টম ট্যাব আইটেম কম্পোনেন্ট
const TabItem = ({ icon, label, active, onPress }) => (
  <TouchableOpacity style={styles.tabItem} onPress={onPress} activeOpacity={0.8}>
    <View style={[styles.tabIconCircle, active && styles.activeTabCircle]}>
      <Ionicons 
        name={active ? icon : `${icon}-outline`} 
        size={24} 
        color={active ? "#D10069" : "#64748B"} 
      />
    </View>
    <Text style={[styles.tabLabel, { color: active ? "#D10069" : "#64748B" }]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  bottomTabContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: Platform.OS === 'ios' ? 95 : 110,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 40,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  tabIconCircle: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  activeTabCircle: { backgroundColor: '#FFF0F6' },
  tabLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 }
});