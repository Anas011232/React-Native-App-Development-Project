import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UNIVERSITY_DATA from '../universityData.json';

export default function DeptListScreen() {
  const { facultyId } = useLocalSearchParams();
  const router = useRouter();
  
  const faculty = UNIVERSITY_DATA.faculties.find(f => f.id === facultyId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{faculty?.facultyName}</Text>
      </View>

      <FlatList
        data={faculty?.departments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.deptCard}
            onPress={() => router.push({ pathname: '/teacherList', params: { facultyId, deptId: item.id } })}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.deptName}>{item.deptName}</Text>
              <View style={[styles.badge, { backgroundColor: faculty.color + '15' }]}>
                <Text style={[styles.badgeText, { color: faculty.color }]}>{item.code}</Text>
              </View>
            </View>
            <View style={styles.arrowCircle}>
               <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, paddingTop: 50, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center' },
  backBtn: { padding: 10, backgroundColor: '#F1F5F9', borderRadius: 12, marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', flex: 1 },
  deptCard: { 
    backgroundColor: '#fff', padding: 20, borderRadius: 22, marginBottom: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.03
  },
  deptName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start', marginTop: 8 },
  badgeText: { fontSize: 11, fontWeight: '800' },
  arrowCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#D10069', justifyContent: 'center', alignItems: 'center' }
});