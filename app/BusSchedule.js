import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ১. নোটিফিকেশন হ্যান্ডলার কনফিগারেশন
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const BUS_DATA = [
    { id: '1', route: 'Campus ⇄ Mymensingh', time: '07:30 AM', busName: 'Ananda', type: 'Student', status: 'On Time' },
    { id: '2', route: 'Campus ⇄ Mymensingh', time: '08:30 AM', busName: 'Kallol', type: 'Student', status: 'On Time' },
    { id: '3', route: 'Campus ⇄ Trishal', time: '09:00 AM', busName: 'Town Service', type: 'Staff', status: 'Delayed' },
    { id: '4', route: 'Campus ⇄ Mymensingh', time: '02:30 PM', busName: 'Dhrubotara', type: 'Student', status: 'On Time' },
    { id: '5', route: 'Campus ⇄ Mymensingh', time: '05:00 PM', busName: 'Sanchita', type: 'Student', status: 'On Time' },
];

export default function BusSchedule() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        async function setupNotifications() {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') return;

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#D10069',
                });
            }
        }
        setupNotifications();
    }, []);

    const handleRemindMe = async (bus) => {
        try {
            // ১. টাইম পার্সিং (04:00 PM -> Date Object)
            const [timeStr, modifier] = bus.time.split(' ');
            let [hours, minutes] = timeStr.split(':');
            hours = parseInt(hours, 10);
            minutes = parseInt(minutes, 10);

            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;

            const now = new Date();
            const busTime = new Date();
            busTime.setHours(hours, minutes, 0, 0);

            // ২. রিমাইন্ডার টাইম (বাসের ৫ মিনিট আগে)
            const reminderTime = new Date(busTime.getTime() - 5 * 60000);

            // ৩. সেকেন্ড ক্যালকুলেশন
            let secondsUntilReminder = Math.round((reminderTime.getTime() - now.getTime()) / 1000);

            let finalTriggerSeconds = 0;

            if (secondsUntilReminder > 2) {
                // আসল সিনারিও: ৫ মিনিটের বেশি সময় বাকি আছে
                finalTriggerSeconds = secondsUntilReminder;
                Alert.alert("সফল!", `${bus.busName} বাস ছাড়ার ৫ মিনিট আগে রিমাইন্ডার পাবেন।`);
            } 
            else {
                // টেস্ট সিনারিও: ৫ মিনিটের কম সময় বাকি (যেমন ৩:৪০ এ ৩:৪৫ এর বাসের জন্য ক্লিক করেছেন)
                const secondsToBusLeft = Math.round((busTime.getTime() - now.getTime()) / 1000);
                
                if (secondsToBusLeft > 0) {
                    finalTriggerSeconds = 5; // ৫ সেকেন্ড পর আসবে চেক করার জন্য
                    Alert.alert("তাড়াতাড়ি করুন!", "বাস ছাড়তে ৫ মিনিটের কম সময় আছে। পরীক্ষার জন্য ৫ সেকেন্ড পর নোটিফিকেশন আসবে।");
                } else {
                    Alert.alert("দুঃখিত", "এই বাসটি ইতিমধ্যে ছেড়ে গেছে!");
                    return;
                }
            }

            // ৪. নোটিফিকেশন শিডিউল
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: `Bus Alert: ${bus.busName} 🚌`,
                    body: `${bus.route} রুটের বাসটি কিছুক্ষণ পর ছাড়বে। প্রস্তুত হোন!`,
                    sound: true,
                    priority: Notifications.AndroidImportance.MAX,
                },
                trigger: { 
                    seconds: finalTriggerSeconds, 
                    channelId: 'default', 
                },
            });

        } catch (error) {
            Alert.alert("Error", "নোটিফিকেশন সেট করা যায়নি।");
        }
    };

    const categories = ['All', 'Student', 'Staff', 'Friday'];
    const filteredData = activeTab === 'All' 
        ? BUS_DATA 
        : BUS_DATA.filter(item => item.type === activeTab);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>Bus Schedule</Text>
                    <Text style={styles.headerSubtitle}>JKKNIU Transport Service</Text>
                </View>
                <View style={{ width: 40 }} /> 
            </View>

            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map((tab) => (
                        <TouchableOpacity 
                            key={tab} 
                            onPress={() => setActiveTab(tab)}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={styles.busCard}>
                        <View style={styles.cardHeader}>
                            <View style={styles.busIconCircle}>
                                <Ionicons name="bus" size={24} color="#D10069" />
                            </View>
                            <View style={styles.routeInfo}>
                                <Text style={styles.routeName}>{item.route}</Text>
                                <Text style={styles.busDetail}>{item.busName} • {item.type} Bus</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: item.status === 'On Time' ? '#DCFCE7' : '#FEE2E2' }]}>
                                <Text style={[styles.statusText, { color: item.status === 'On Time' ? '#166534' : '#991B1B' }]}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.cardFooter}>
                            <View style={styles.timeBox}>
                                <Ionicons name="time-outline" size={16} color="#64748B" />
                                <Text style={styles.timeText}>{item.time}</Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.remindButton}
                                onPress={() => handleRemindMe(item)}
                            >
                                <Ionicons name="notifications-outline" size={14} color="#D10069" />
                                <Text style={styles.remindText}>Remind Me</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        backgroundColor: '#D10069',
        paddingHorizontal: 20,
        paddingVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 5,
    },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
    headerSubtitle: { fontSize: 13, color: '#FFD1E8' },
    backButton: { width: 40, height: 40, justifyContent: 'center' },
    tabContainer: { paddingVertical: 15, paddingLeft: 20 },
    tab: { 
        paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, 
        backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderColor: '#E2E8F0' 
    },
    activeTab: { backgroundColor: '#D10069', borderColor: '#D10069' },
    tabText: { color: '#64748B', fontWeight: '600' },
    activeTabText: { color: '#fff' },
    listContent: { paddingHorizontal: 20, paddingBottom: 30 },
    busCard: {
        backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 15,
        elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
        borderLeftWidth: 4, borderLeftColor: '#D10069'
    },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    busIconCircle: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#FFF0F6', justifyContent: 'center', alignItems: 'center' },
    routeInfo: { flex: 1, marginLeft: 12 },
    routeName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
    busDetail: { fontSize: 12, color: '#64748B' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '700' },
    cardFooter: { 
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
        marginTop: 15, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' 
    },
    timeBox: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    timeText: { fontSize: 14, fontWeight: '700', color: '#334155' },
    remindButton: { 
        flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0F6', 
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, gap: 5,
        borderWidth: 1, borderColor: '#D10069'
    },
    remindText: { fontSize: 12, fontWeight: '700', color: '#D10069' }
});