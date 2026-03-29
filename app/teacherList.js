import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UNIVERSITY_DATA from '../universityData.json';

export default function TeacherListScreen() {
  const { facultyId, deptId } = useLocalSearchParams();
  const router = useRouter();

  const faculty = UNIVERSITY_DATA.faculties.find(f => f.id === facultyId);
  const dept = faculty?.departments.find(d => d.id === deptId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{dept?.code} Teachers</Text>
      </View>

      <FlatList
        data={dept?.teachers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Ionicons name="cloud-offline-outline" size={50} color="#CBD5E1" />
            <Text style={styles.emptyText}>No teacher data available yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.teacherCard}
            onPress={() => router.push({ pathname: '/teacher', params: item })}
          >
            <Image source={require('../assets/images/logo.jpg')} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.tName}>{item.name}</Text>
              <Text style={styles.tDes}>{item.designation}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  teacherCard: { 
    flexDirection: 'row', backgroundColor: '#fff', padding: 15, 
    borderRadius: 20, marginBottom: 12, alignItems: 'center', elevation: 2
  },
  avatar: { width: 55, height: 55, borderRadius: 27.5, backgroundColor: '#F1F5F9' },
  info: { marginLeft: 15, flex: 1 },
  tName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  tDes: { fontSize: 12, color: '#64748B', marginTop: 2 },
  emptyView: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#94A3B8', marginTop: 10, fontSize: 14 }
});