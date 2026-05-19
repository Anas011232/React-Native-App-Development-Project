import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
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
  ActivityIndicator
} from 'react-native';

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



  // 🔥 REAL LOGIN
  const handleLogin = async () => {

    if (!email || !password) {

      return Alert.alert(
        'Error',
        'সব তথ্য দিন'
      );
    }

    setLoading(true);

    try {

      const res = await fetch(
        'http://192.168.0.172:5000/api/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await res.json();

      console.log(data);

      if (res.ok) {

        setIsLoggedIn(true);

        setUserRole(data.role);

        setModalVisible(false);

        Alert.alert(
          'Success',
          'Login Success ✅'
        );

      } else {

        Alert.alert(
          'Error',
          data.error || 'Login Failed'
        );
      }

    } catch (error) {

      console.log(error);

      Alert.alert(
        'Error',
        'Server Connection Failed'
      );

    } finally {

      setLoading(false);
    }
  };



  // 🔥 MENU
  const MENU_ITEMS = useMemo(() => [

    {
      id: '1',
      title: 'Manage Notices',
      icon: 'document-text',
      color: '#4F46E5',
      route: '/ManageNotice',
      role: 'admin',
      desc: 'Manage all notices'
    },

    {
      id: '2',
      title: 'Create Notice',
      icon: 'add-circle',
      color: '#DC2626',
      route: '/CreateNotice',
      role: 'superadmin',
      desc: 'Publish new notice'
    },

    {
      id: '3',
      title: 'Push Alerts',
      icon: 'notifications',
      color: '#EA580C',
      route: '/Notifications',
      role: 'superadmin',
      desc: 'Send notification'
    },

    {
      id: '4',
      title: 'Faculty Update',
      icon: 'people',
      color: '#7C3AED',
      route: '/faculty',
      role: 'admin',
      desc: 'Manage faculty'
    },

    {
      id: '5',
      title: 'Bus Schedule',
      icon: 'bus',
      color: '#D10069',
      route: '/BusSchedule',
      role: 'admin',
      desc: 'Update bus timing'
    },

    {
      id: '6',
      title: 'Admin Control',
      icon: 'shield-checkmark',
      color: '#059669',
      route: '/AdminManagement',
      role: 'superadmin',
      desc: 'Manage admins'
    },

    {
      id: '7',
      title: 'About Campus',
      icon: 'school',
      color: '#2563EB',
      route: '/AboutUniversity',
      role: 'admin',
      desc: 'University details'
    },

  ], []);



  // 🔥 LOGIN SCREEN
  if (!isLoggedIn) {

    return (

      <SafeAreaView style={styles.loginContainer}>

        <StatusBar
          backgroundColor="#fff"
          barStyle="dark-content"
        />

        <View style={styles.logoContainer}>

          <View style={styles.logoCircle}>

            <Ionicons
              name="shield-checkmark"
              size={70}
              color="#fff"
            />

          </View>

          <Text style={styles.mainTitle}>
            Admin Portal
          </Text>

          <Text style={styles.subTitle}>
            JKKNIU Dashboard
          </Text>

        </View>



        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => {

            setModalVisible(true);
          }}
        >

          <Ionicons
            name="shield-checkmark"
            size={40}
            color="#D10069"
          />

          <View>

            <Text style={styles.roleTitle}>
              Secure Login
            </Text>

            <Text style={styles.roleDesc}>
              Login with your admin account
            </Text>

          </View>

        </TouchableOpacity>



        {/* 🔥 MODAL */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
        >

          <View style={styles.modalOverlay}>

            <View style={styles.modalCard}>

              <View style={styles.modalTop}>

                <Ionicons
                  name="shield-checkmark"
                  size={45}
                  color="#D10069"
                />

                <Text style={styles.modalHeading}>
                  Admin Login
                </Text>

              </View>



              <TextInput
                placeholder="Enter Email"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />

              <TextInput
                placeholder="Enter Password"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />



              <View style={styles.btnRow}>

                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() =>
                    setModalVisible(false)
                  }
                >

                  <Text style={styles.cancelText}>
                    Cancel
                  </Text>

                </TouchableOpacity>



                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleLogin}
                  disabled={loading}
                >

                  {
                    loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.loginText}>
                        Login
                      </Text>
                    )
                  }

                </TouchableOpacity>

              </View>

            </View>

          </View>

        </Modal>

      </SafeAreaView>
    );
  }



  // 🔥 DASHBOARD
  return (

    <SafeAreaView style={styles.container}>

      <StatusBar
        backgroundColor="#F8FAFC"
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
      >

        {/* 🔥 HEADER */}
        <View style={styles.topHeader}>

          <View>

            <Text style={styles.welcomeText}>
              Welcome Back 👋
            </Text>

            <Text style={styles.adminText}>

              {
                userRole === 'superadmin'
                  ? 'Super Admin'
                  : 'Admin'
              }

            </Text>

          </View>



          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => {

              setIsLoggedIn(false);

              setEmail('');

              setPassword('');
            }}
          >

            <Ionicons
              name="power"
              size={24}
              color="#EF4444"
            />

          </TouchableOpacity>

        </View>



        {/* 🔥 INFO CARD */}
        <View style={styles.infoCard}>

          <View style={styles.infoLeft}>

            <Text style={styles.infoTitle}>
              University Dashboard
            </Text>

            <Text style={styles.infoDesc}>
              Manage notices, admins,
              schedules & notifications.
            </Text>

          </View>

          <Ionicons
            name="analytics"
            size={70}
            color="#fff"
          />

        </View>



        {/* 🔥 STATS */}
        <View style={styles.statsRow}>

          <View style={styles.statCard}>

            <Ionicons
              name="notifications"
              size={28}
              color="#4F46E5"
            />

            <Text style={styles.statNumber}>
              120+
            </Text>

            <Text style={styles.statLabel}>
              Notices
            </Text>

          </View>



          <View style={styles.statCard}>

            <Ionicons
              name="people"
              size={28}
              color="#059669"
            />

            <Text style={styles.statNumber}>
              2.5k
            </Text>

            <Text style={styles.statLabel}>
              Users
            </Text>

          </View>

        </View>



        {/* 🔥 MENU */}
        <Text style={styles.sectionTitle}>
          Management Panel
        </Text>

        <FlatList
          data={MENU_ITEMS}
          numColumns={2}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{
            paddingBottom: 40
          }}
          renderItem={({ item }) => {

            const isDisabled =
              item.role ===
                'superadmin' &&
              userRole !==
                'superadmin';

            return (

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.menuCard,
                  isDisabled &&
                    styles.disabledCard
                ]}
                onPress={() => {

                  if (!isDisabled) {

                    router.push(
                      item.route
                    );
                  }
                }}
              >

                <View
                  style={[
                    styles.iconBox,
                    {
                      backgroundColor:
                        isDisabled
                          ? '#CBD5E1'
                          : item.color
                    }
                  ]}
                >

                  <Ionicons
                    name={item.icon}
                    size={28}
                    color="#fff"
                  />

                </View>

                <Text
                  style={[
                    styles.cardTitle,
                    isDisabled &&
                      styles.disabledText
                  ]}
                >

                  {item.title}

                </Text>

                <Text
                  style={[
                    styles.cardDesc,
                    isDisabled &&
                      styles.disabledText
                  ]}
                >

                  {item.desc}

                </Text>

              </TouchableOpacity>
            );
          }}
        />

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center'
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 50
  },

  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: '#D10069',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },

  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A'
  },

  subTitle: {
    marginTop: 5,
    fontSize: 15,
    color: '#64748B'
  },

  roleCard: {
    backgroundColor: '#F8FAFC',
    padding: 24,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#D10069',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20
  },

  roleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A'
  },

  roleDesc: {
    color: '#64748B',
    marginTop: 4
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20
  },

  modalCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 25
  },

  modalTop: {
    alignItems: 'center',
    marginBottom: 20
  },

  modalHeading: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A'
  },

  input: {
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    fontSize: 16,
    color: '#0F172A'
  },

  btnRow: {
    flexDirection: 'row',
    gap: 10
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center'
  },

  loginBtn: {
    flex: 1,
    backgroundColor: '#D10069',
    padding: 15,
    borderRadius: 16,
    alignItems: 'center'
  },

  cancelText: {
    color: '#475569',
    fontWeight: '700'
  },

  loginText: {
    color: '#fff',
    fontWeight: '800'
  },

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC'
  },

  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24
  },

  welcomeText: {
    fontSize: 14,
    color: '#64748B'
  },

  adminText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 5
  },

  logoutBtn: {
    backgroundColor: '#fff',
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },

  infoCard: {
    marginHorizontal: 20,
    backgroundColor: '#D10069',
    borderRadius: 28,
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  infoLeft: {
    width: '65%'
  },

  infoTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900'
  },

  infoDesc: {
    color: '#FCE7F3',
    marginTop: 8,
    lineHeight: 22
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 15
  },

  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 24,
    elevation: 3
  },

  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 10
  },

  statLabel: {
    color: '#64748B',
    marginTop: 5
  },

  sectionTitle: {
    marginTop: 28,
    marginBottom: 10,
    paddingHorizontal: 20,
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A'
  },

  menuCard: {
    backgroundColor: '#fff',
    width: (width / 2) - 30,
    margin: 10,
    padding: 20,
    borderRadius: 28,
    elevation: 4
  },

  disabledCard: {
    opacity: 0.45
  },

  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center'
  },

  cardTitle: {
    marginTop: 18,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A'
  },

  cardDesc: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18
  },

  disabledText: {
    color: '#94A3B8'
  }

});