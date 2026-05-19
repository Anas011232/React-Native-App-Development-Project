import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AdminGate() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // ================= AUTO LOGIN CHECK =================
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const role = await AsyncStorage.getItem('role');

      if (token) {
        setIsLoggedIn(true);
        setUserRole(role);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogin = async () => {
  if (!email || !password) {
    return Alert.alert("Error", "সব তথ্য দিন");
  }

  setLoading(true);

  try {
    const res = await fetch("http://192.168.0.172:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("role", data.role);

      setIsLoggedIn(true);
      setUserRole(data.role);
      setModalVisible(false);

      Alert.alert("Success", "Login Success ✅");
    } else {
      Alert.alert("Error", data.error || "Login Failed");
    }
  } catch (error) {
    Alert.alert("Error", "Server Connection Failed");
  } finally {
    setLoading(false);
  }
};
  // ================= LOGOUT =================
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');

    setIsLoggedIn(false);
    setUserRole(null);
    setEmail('');
    setPassword('');
  };

  // ================= MENU =================
  const MENU_ITEMS = useMemo(
    () => [
      {
        id: '1',
        title: 'Manage Notices',
        icon: 'document-text',
        color: '#4F46E5',
        route: '/ManageNotice',
        role: 'admin',
        desc: 'Manage all notices',
      },
      {
        id: '2',
        title: 'Create Notice',
        icon: 'add-circle',
        color: '#DC2626',
        route: '/CreateNotice',
        role: 'superadmin',
        desc: 'Publish new notice',
      },
      {
        id: '3',
        title: 'Push Alerts',
        icon: 'notifications',
        color: '#EA580C',
        route: '/Notifications',
        role: 'superadmin',
        desc: 'Send notification',
      },
      {
        id: '4',
        title: 'Faculty Update',
        icon: 'people',
        color: '#7C3AED',
        route: '/faculty',
        role: 'admin',
        desc: 'Manage faculty',
      },
      {
        id: '5',
        title: 'Bus Schedule',
        icon: 'bus',
        color: '#D10069',
        route: '/BusSchedule',
        role: 'admin',
        desc: 'Update bus timing',
      },
      {
        id: '6',
        title: 'Admin Control',
        icon: 'shield-checkmark',
        color: '#059669',
        route: '/AdminManagement',
        role: 'superadmin',
        desc: 'Manage admins',
      },
      {
        id: '7',
        title: 'About Campus',
        icon: 'school',
        color: '#2563EB',
        route: '/AboutUniversity',
        role: 'admin',
        desc: 'University details',
      },
    ],
    []
  );

  // ================= LOGIN SCREEN =================
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />

        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="shield-checkmark" size={70} color="#fff" />
          </View>

          <Text style={styles.mainTitle}>Admin Portal</Text>
          <Text style={styles.subTitle}>JKKNIU Dashboard</Text>
        </View>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="shield-checkmark" size={40} color="#D10069" />

          <View>
            <Text style={styles.roleTitle}>Secure Login</Text>
            <Text style={styles.roleDesc}>Login with your admin account</Text>
          </View>
        </TouchableOpacity>

        {/* MODAL */}
        <Modal visible={modalVisible} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalTop}>
                <Ionicons name="shield-checkmark" size={45} color="#D10069" />
                <Text style={styles.modalHeading}>Admin Login</Text>
              </View>

              <TextInput
                placeholder="Enter Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />

              <TextInput
                placeholder="Enter Password"
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <View style={styles.btnRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.loginText}>Login</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // ================= DASHBOARD =================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      <ScrollView>
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.welcomeText}>Welcome Back 👋</Text>

            <Text style={styles.adminText}>
              {userRole === 'superadmin' ? 'Super Admin' : 'Admin'}
            </Text>
          </View>

          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="power" size={24} color="red" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Management Panel</Text>

        <FlatList
          data={MENU_ITEMS}
          numColumns={2}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isDisabled =
              item.role === 'superadmin' && userRole !== 'superadmin';

            return (
              <TouchableOpacity
                style={[styles.menuCard, isDisabled && { opacity: 0.4 }]}
                onPress={() => {
                  if (!isDisabled) {
                    router.push(item.route);
                  }
                }}
              >
                <Ionicons name={item.icon} size={30} color={item.color} />

                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ================= STYLES =================
const styles = StyleSheet.create({
  loginContainer: { flex: 1, justifyContent: 'center', padding: 20 },

  logoContainer: { alignItems: 'center', marginBottom: 40 },

  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#D10069',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainTitle: { fontSize: 28, fontWeight: '900' },
  subTitle: { color: 'gray' },

  roleCard: {
    flexDirection: 'row',
    padding: 20,
    borderWidth: 2,
    borderColor: '#D10069',
    borderRadius: 20,
    alignItems: 'center',
    gap: 15,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    padding: 20,
  },

  modalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
  },

  input: {
    backgroundColor: '#eee',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
  },

  btnRow: { flexDirection: 'row', gap: 10 },

  cancelBtn: { flex: 1, backgroundColor: '#ccc', padding: 12 },
  loginBtn: { flex: 1, backgroundColor: '#D10069', padding: 12 },

  container: { flex: 1, backgroundColor: '#F8FAFC' },

  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    paddingHorizontal: 20,
  },

  menuCard: {
    flex: 1,
    margin: 10,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
  },

  cardTitle: { fontWeight: 'bold', marginTop: 10 },
  cardDesc: { color: 'gray', fontSize: 12 },
});