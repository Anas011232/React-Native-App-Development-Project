import {
  Entypo,
  Feather, FontAwesome5, Ionicons
} from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// আপনার প্রোজেক্টের পাথ অনুযায়ী JSON ফাইলটি ইম্পোর্ট করুন
import universityData from '../universityData.json';

const { width } = Dimensions.get('window');

export default function TeacherProfile() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('About');

  // আইডি খুঁজে বের করার লজিক (params.id বা params.teacherId যাই আসুক)
  const teacherId = params.teacherId || params.id;

  const data = useMemo(() => {
    if (!teacherId) return null;
    for (const faculty of universityData.faculties) {
      for (const dept of faculty.departments) {
        const found = dept.teachers.find(t => String(t.id) === String(teacherId));
        if (found) return { teacher: found, color: faculty.color, deptName: dept.deptName };
      }
    }
    return null;
  }, [teacherId]);

  if (!data) {
    return (
      <View style={styles.errorCenter}>
        <Ionicons name="search-outline" size={80} color="#CBD5E1" />
        <Text style={styles.errorText}>Teacher Not Found!</Text>
        <Text style={{ color: '#94A3B8' }}>ID: {teacherId || "N/A"}</Text>
        <TouchableOpacity style={styles.errorBtn} onPress={() => router.back()}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { teacher, color, deptName } = data;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Curved Header Background */}
      <View style={[styles.headerBg, { backgroundColor: color }]} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Navigation Row */}
        {/* Navigation Row */}
        <View style={styles.navRow}>
          {/* Left: Back Button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.glassBtn}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Center: Title */}
          <Text style={styles.navTitle}>Faculty Profile</Text>

          {/* Right: Empty View (To Balance the Center) */}
          <View style={styles.emptySpace} />
        </View>

        {/* Profile Card Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: teacher.image}}
              style={styles.avatar}
            />
            <View style={[styles.onlineIndicator, { backgroundColor: '#10B981' }]} />
          </View>

          <Text style={styles.teacherName}>{teacher.name}</Text>
          <Text style={styles.teacherTitle}>{teacher.designation}</Text>
          <View style={[styles.deptBadge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.deptText, { color: color }]}>{deptName}</Text>
          </View>

          {/* Contact Actions */}
          <View style={styles.actionRow}>
            <ContactIcon icon="phone" color="#10B981" label="Call" onPress={() => Linking.openURL(`tel:${teacher.phone}`)} />
            <ContactIcon icon="mail" color="#F43F5E" label="Email" onPress={() => Linking.openURL(`mailto:${teacher.email}`)} />
            <ContactIcon icon="message-square" color="#6366F1" label="Chat" />
          </View>
        </View>

        {/* Animated Tabs */}
        <View style={styles.tabBar}>
          {['About', 'Research', 'Experience'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tabItem, activeTab === tab && { borderBottomColor: color }]}
            >
              <Text style={[styles.tabLabel, activeTab === tab && { color: color }]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content View */}
        <View style={styles.contentPadding}>
          {activeTab === 'About' && (
            <View>
              <SectionCard title="Education" icon="graduation-cap" color={color}>
                {teacher.education.map((edu, i) => (
                  <View key={i} style={styles.listItem}>
                    <Text style={styles.itemTitle}>{edu.degree} - {edu.subject}</Text>
                    <Text style={styles.itemSub}>{edu.institute} ({edu.year})</Text>
                  </View>
                ))}
              </SectionCard>

              <SectionCard title="Teaching Courses" icon="book-reader" color={color}>
                <View style={styles.chipRow}>
                  {teacher.teaching.map((course, i) => (
                    <View key={i} style={[styles.chip, { backgroundColor: color + '10' }]}>
                      <Text style={[styles.chipText, { color: color }]}>{course}</Text>
                    </View>
                  ))}
                </View>
              </SectionCard>
            </View>
          )}

          {activeTab === 'Research' && (
            <View>
              <SectionCard title="Research Interests" icon="flask" color={color}>
                {teacher.research.map((res, i) => (
                  <View key={i} style={styles.researchItem}>
                    <Entypo name="dot-single" size={24} color={color} />
                    <Text style={styles.researchText}>{res.title}</Text>
                  </View>
                ))}
              </SectionCard>

              <SectionCard title="Publications" icon="newspaper" color={color}>
                {teacher.publications.map((pub, i) => (
                  <View key={i} style={styles.pubBox}>
                    <Text style={styles.pubTitle}>{pub.title}</Text>
                    <Text style={[styles.pubMeta, { color: color }]}>{pub.journal} • {pub.year}</Text>
                  </View>
                ))}
              </SectionCard>
            </View>
          )}

          {activeTab === 'Experience' && (
            <View style={styles.timelineContainer}>
              {teacher.experience.map((exp, i) => (
                <View key={i} style={styles.timelineItem}>
                  <View style={[styles.timelineDot, { backgroundColor: color }]} />
                  <View style={styles.timelineContent}>
                    <Text style={styles.expTitle}>{exp.title}</Text>
                    <Text style={styles.expSub}>{exp.institution}</Text>
                    <Text style={styles.expYear}>{exp.years}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// Helper Components
const ContactIcon = ({ icon, color, label, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.cIconWrapper}>
    <View style={[styles.cIconBox, { backgroundColor: color + '15' }]}>
      <Feather name={icon} size={20} color={color} />
    </View>
    <Text style={styles.cLabel}>{label}</Text>
  </TouchableOpacity>
);

const SectionCard = ({ title, icon, color, children }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <FontAwesome5 name={icon} size={15} color={color} />
      <Text style={[styles.cardTitle, { color: color }]}>{title}</Text>
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  headerBg: { position: 'absolute', top: 0, width: '100%', height: 260, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
 navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // এটি তিনটি এলিমেন্টকে দুই মাথায় এবং মাঝখানে রাখবে
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    width: '100%',
  },
  navTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center', // টেক্সট সেন্টারে রাখবে
    flex: 1, // মাঝখানের সবটুকু জায়গা দখল করবে
  },
  glassBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySpace: {
    width: 42, // এটি ব্যাক বাটনের উইডথ এর সমান হতে হবে
  },
  profileSection: { alignItems: 'center', marginTop: 15 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 40, borderWidth: 4, borderColor: '#fff' },
  onlineIndicator: { position: 'absolute', bottom: 5, right: 5, width: 22, height: 22, borderRadius: 11, borderWidth: 3, borderColor: '#fff' },

  teacherName: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginTop: 15 },
  teacherTitle: { fontSize: 15, color: '#64748B', fontWeight: '500' },
  deptBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginTop: 8 },
  deptText: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },

  actionRow: { flexDirection: 'row', marginTop: 25 },
  cIconWrapper: { alignItems: 'center', marginHorizontal: 15 },
  cIconBox: { width: 50, height: 50, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  cLabel: { fontSize: 12, color: '#94A3B8', marginTop: 6, fontWeight: '600' },

  tabBar: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, marginHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tabItem: { paddingBottom: 10, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabLabel: { fontSize: 14, fontWeight: '700', color: '#94A3B8' },

  contentPadding: { padding: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 25, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 15, fontWeight: '800', marginLeft: 10, textTransform: 'uppercase', letterSpacing: 0.5 },

  listItem: { marginBottom: 12 },
  itemTitle: { fontSize: 14, fontWeight: '700', color: '#334155' },
  itemSub: { fontSize: 12, color: '#64748B', marginTop: 2 },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginRight: 8, marginBottom: 8 },
  chipText: { fontSize: 12, fontWeight: '700' },

  researchItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  researchText: { fontSize: 14, color: '#475569', flex: 1 },

  pubBox: { marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10 },
  pubTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  pubMeta: { fontSize: 12, fontWeight: '600', marginTop: 4 },

  timelineContainer: { paddingLeft: 10 },
  timelineItem: { flexDirection: 'row', marginBottom: 25 },
  timelineDot: { width: 12, height: 12, borderRadius: 6, marginTop: 5, marginRight: 20 },
  timelineContent: { flex: 1 },
  expTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  expSub: { fontSize: 13, color: '#64748B' },
  expYear: { fontSize: 12, fontWeight: '700', color: '#94A3B8', marginTop: 4 },

  errorCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  errorText: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginTop: 10 },
  errorBtn: { marginTop: 20, backgroundColor: '#1E293B', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 15 }
});