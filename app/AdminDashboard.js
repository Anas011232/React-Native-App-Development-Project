import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AdminGate() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null); // 'admin' or 'superadmin'
    const [password, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    // ডামি পাসওয়ার্ড (পরবর্তীতে ডাটাবেজ থেকে চেক করবেন)
    const ADMIN_PASS = '1234';
    const SUPER_ADMIN_PASS = '0000';

    const handleLogin = () => {
        if (userRole === 'admin' && password === ADMIN_PASS) {
            setIsLoggedIn(true);
            setModalVisible(false);
        } else if (userRole === 'superadmin' && password === SUPER_ADMIN_PASS) {
            setIsLoggedIn(true);
            setModalVisible(false);
        } else {
            Alert.alert('ভুল পাসওয়ার্ড', 'সঠিক পাসওয়ার্ড দিয়ে আবার চেষ্টা করুন।');
        }
        setPassword('');
    };

    // ড্যাশবোর্ড মেনু আইটেম
    const MENU_ITEMS = [
        { id: '1', title: 'Manage Notices', icon: 'document-text', color: '#4F46E5', role: 'admin', route: '/NoticeList' },
        { id: '2', title: 'Faculty Update', icon: 'people', color: '#7C3AED', role: 'admin', route: '/faculty' },
        { id: '3', title: 'Bus Schedule', icon: 'bus', color: '#D10069', role: 'admin', route: '/BusSchedule' },
        { id: '4', title: 'Push Notification', icon: 'megaphone', color: '#EA580C', role: 'superadmin', route: '/Notifications' },
        { id: '5', title: 'Admin Control', icon: 'key', color: '#059669', role: 'superadmin', route: '/AdminManagement' }, // Super Admin Option
        { id: '6', title: 'About Campus', icon: 'school', color: '#2563EB', role: 'admin', route: '/AboutUniversity' },
    ];

    // লগইন চয়েস স্ক্রিন
    if (!isLoggedIn) {
        return (
            <SafeAreaView style={styles.gateContainer}>
                <View style={styles.gateHeader}>
                    <Ionicons name="shield-lock" size={80} color="#D10069" />
                    <Text style={styles.gateTitle}>Identity Verification</Text>
                    <Text style={styles.gateSubtitle}>আপনার প্যানেলটি নির্বাচন করুন</Text>
                </View>

                <View style={styles.choiceContainer}>
                    <TouchableOpacity 
                        style={[styles.choiceCard, {borderColor: '#4F46E5'}]}
                        onPress={() => { setUserRole('admin'); setModalVisible(true); }}
                    >
                        <Ionicons name="person" size={40} color="#4F46E5" />
                        <Text style={styles.choiceText}>Admin Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.choiceCard, {borderColor: '#D10069'}]}
                        onPress={() => { setUserRole('superadmin'); setModalVisible(true); }}
                    >
                        <Ionicons name="ribbon" size={40} color="#D10069" />
                        <Text style={styles.choiceText}>Super Admin</Text>
                    </TouchableOpacity>
                </View>

                {/* Password Modal */}
                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{userRole?.toUpperCase()} Access</Text>
                            <TextInput 
                                style={styles.input}
                                placeholder="Enter Password"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                keyboardType="numeric"
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.cancelBtnText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                                    <Text style={styles.loginBtnText}>Enter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }

    // মূল ড্যাশবোর্ড স্ক্রিন
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Logged in as:</Text>
                    <Text style={styles.adminName}>{userRole === 'superadmin' ? 'Super Admin 👑' : 'University Admin'}</Text>
                </View>
                <TouchableOpacity onPress={() => setIsLoggedIn(false)}>
                    <Ionicons name="power" size={30} color="#EF4444" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={MENU_ITEMS}
                numColumns={2}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const isDisabled = item.role === 'superadmin' && userRole !== 'superadmin';
                    return (
                        <TouchableOpacity 
                            style={[styles.card, isDisabled && styles.disabledCard]}
                            onPress={() => !isDisabled && router.push(item.route)}
                        >
                            <Ionicons name={item.icon} size={30} color={isDisabled ? '#94A3B8' : item.color} />
                            <Text style={[styles.cardTitle, isDisabled && styles.disabledText]}>{item.title}</Text>
                            {item.id === '5' && <Text style={styles.superAction}>Remove/Add Admin</Text>}
                        </TouchableOpacity>
                    );
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Gate Styles
    gateContainer: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    gateHeader: { alignItems: 'center', marginBottom: 50 },
    gateTitle: { fontSize: 26, fontWeight: '800', color: '#1E293B', marginTop: 15 },
    gateSubtitle: { fontSize: 16, color: '#64748B' },
    choiceContainer: { width: '100%', paddingHorizontal: 30, gap: 20 },
    choiceCard: { 
        flexDirection: 'row', alignItems: 'center', padding: 25, 
        borderRadius: 20, borderWidth: 2, gap: 20, backgroundColor: '#F8FAFC' 
    },
    choiceText: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
    
    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { backgroundColor: '#fff', width: '80%', padding: 25, borderRadius: 25 },
    modalTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center', marginBottom: 20 },
    input: { backgroundColor: '#F1F5F9', padding: 15, borderRadius: 12, fontSize: 18, textAlign: 'center', marginBottom: 20 },
    modalButtons: { flexDirection: 'row', gap: 10 },
    loginBtn: { flex: 1, backgroundColor: '#D10069', padding: 15, borderRadius: 12, alignItems: 'center' },
    loginBtnText: { color: '#fff', fontWeight: '700' },
    cancelBtn: { flex: 1, backgroundColor: '#E2E8F0', padding: 15, borderRadius: 12, alignItems: 'center' },
    cancelBtnText: { color: '#64748B', fontWeight: '700' },

    // Dashboard Styles
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 25, alignItems: 'center' },
    welcomeText: { color: '#64748B' },
    adminName: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
    listContent: { padding: 15 },
    card: { 
        backgroundColor: '#fff', width: (width / 2) - 25, margin: 10, padding: 20, 
        borderRadius: 25, elevation: 5, alignItems: 'center' 
    },
    disabledCard: { backgroundColor: '#F1F5F9', elevation: 0 },
    cardTitle: { marginTop: 10, fontWeight: '700', color: '#1E293B' },
    disabledText: { color: '#94A3B8' },
    superAction: { fontSize: 9, color: '#D10069', marginTop: 5, fontWeight: 'bold' }
});