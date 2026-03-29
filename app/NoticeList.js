import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy'; // লেটেস্ট এক্সপোতে legacy ব্যবহার করা নিরাপদ
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NOTICES = [
  { id: '1', title: 'Eid-ul-Fitr Vacation 2026', date: '25 March, 2026', type: 'Academic', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: '2', title: 'Final Exam Schedule for CSE 4th Year', date: '22 March, 2026', type: 'Exam', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: '3', title: 'Bus Route Modification for Friday', date: '20 March, 2026', type: 'Transport', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: '4', title: 'Registration Deadline Extended', date: '18 March, 2026', type: 'Admin', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
];

export default function NoticeList() {
  const router = useRouter();
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const getIcon = (type) => {
    switch (type) {
      case 'Academic': return { name: 'book', color: '#4F46E5' };
      case 'Exam': return { name: 'document-text', color: '#EF4444' };
      case 'Transport': return { name: 'bus', color: '#F59E0B' };
      default: return { name: 'notifications', color: '#D10069' };
    }
  };

  const downloadNotice = async (url, fileName) => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      const fileUri = FileSystem.documentDirectory + fileName;
      
      const downloadResumable = FileSystem.createDownloadResumable(url, fileUri);
      const { uri } = await downloadResumable.downloadAsync();
      
      setIsDownloading(false);

      if (Platform.OS === 'android') {
        Alert.alert("Success", "Notice Downloaded Successfully!");
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      }
    } catch (e) {
      setIsDownloading(false);
      console.error(e);
      Alert.alert("Error", "Download failed! Please check your internet.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>University Notices</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <FlatList
        data={NOTICES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.noticeCard} 
            onPress={() => setSelectedNotice(item)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${getIcon(item.type).color}15` }]}>
              <Ionicons name={getIcon(item.type).name} size={24} color={getIcon(item.type).color} />
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.noticeType}>{item.type}</Text>
              <Text style={styles.noticeTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={12} color="#64748B" />
                <Text style={styles.noticeDate}>{item.date}</Text>
              </View>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        )}
      />

      {/* Notice Detail Modal */}
      <Modal 
        visible={!!selectedNotice} 
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setSelectedNotice(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notice Detail</Text>
              <TouchableOpacity onPress={() => setSelectedNotice(null)}>
                <Ionicons name="close" size={24} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {selectedNotice && (
              <View style={styles.modalBody}>
                <View style={styles.pdfPreview}>
                   <Ionicons name="file-tray-full" size={60} color="#EF4444" />
                   <Text style={{marginTop: 10, color: '#64748B'}}>PDF Document Available</Text>
                </View>

                <Text style={styles.detailTitle}>{selectedNotice.title}</Text>
                <Text style={styles.detailDate}>Published on: {selectedNotice.date}</Text>
                
                <View style={styles.buttonGroup}>
                  <TouchableOpacity 
                    style={styles.viewButton} 
                    onPress={() => Alert.alert('Notice', 'Opening built-in PDF viewer...')}
                  >
                    <Ionicons name="eye-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>View PDF</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.downloadButton, isDownloading && { opacity: 0.6 }]}
                    onPress={() => downloadNotice(selectedNotice.pdfUrl, `Notice_${selectedNotice.id}.pdf`)}
                    disabled={isDownloading}
                  >
                    <Ionicons name="download-outline" size={20} color="#D10069" />
                    <Text style={[styles.buttonText, { color: '#D10069' }]}>
                        {isDownloading ? "Wait..." : "Download"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  listContent: { padding: 20 },
  noticeCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 15, borderRadius: 16, marginBottom: 15,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10,
  },
  iconContainer: { width: 50, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  textContainer: { flex: 1, marginLeft: 15 },
  noticeType: { fontSize: 10, fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: 2 },
  noticeTitle: { fontSize: 15, fontWeight: '700', color: '#334155', marginBottom: 6 },
  dateContainer: { flexDirection: 'row', alignItems: 'center' },
  noticeDate: { fontSize: 12, color: '#64748B', marginLeft: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, minHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  modalBody: { alignItems: 'center' },
  pdfPreview: { 
    width: '100%', height: 150, backgroundColor: '#F1F5F9', borderRadius: 20, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#CBD5E1' 
  },
  detailTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', textAlign: 'center' },
  detailDate: { fontSize: 14, color: '#64748B', marginTop: 8, marginBottom: 25 },
  buttonGroup: { flexDirection: 'row', gap: 15 },
  viewButton: { 
    flexDirection: 'row', backgroundColor: '#D10069', paddingVertical: 12, 
    paddingHorizontal: 25, borderRadius: 12, alignItems: 'center', gap: 8 
  },
  downloadButton: { 
    flexDirection: 'row', backgroundColor: '#FFF0F6', paddingVertical: 12, 
    paddingHorizontal: 25, borderRadius: 12, alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: '#D10069'
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 }
});