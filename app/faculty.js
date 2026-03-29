import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UNIVERSITY_DATA from '../universityData.json';

export default function FacultyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Faculties</Text>
        <Text style={styles.headerSub}>Select a faculty to see its departments</Text>
      </View>

      <FlatList
        data={UNIVERSITY_DATA.faculties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push({ pathname: '/deptList', params: { facultyId: item.id } })}
          >
            <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={30} color={item.color} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>{item.facultyName}</Text>
              <Text style={styles.cardCount}>{item.departments.length} Departments</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 25, paddingTop: 60, backgroundColor: '#fff' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1E293B' },
  headerSub: { fontSize: 14, color: '#64748B', marginTop: 4 },
  card: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    padding: 18, borderRadius: 24, marginBottom: 15, elevation: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10
  },
  iconBox: { width: 55, height: 55, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1, marginLeft: 15 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#1E293B' },
  cardCount: { fontSize: 12, color: '#94A3B8', marginTop: 3 }
});