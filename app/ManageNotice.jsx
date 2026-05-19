import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../app/_services/api";
import { Ionicons } from "@expo/vector-icons";

export default function ManageNotice() {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadToken = async () => {
      const t = await AsyncStorage.getItem("token");
      setToken(t);
    };
    loadToken();
  }, []);

  const fetchNotices = async (tkn) => {
    try {
      setLoading(true);

      const res = await API.get("/notices", {
        headers: {
          Authorization: `Bearer ${tkn}`,
        },
      });

      setNotices(res.data);
    } catch (err) {
      Alert.alert("Error", "Failed to load notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchNotices(token);
  }, [token]);

  const createNotice = async () => {
    if (!title || !details) {
      return Alert.alert("Error", "Fill all fields");
    }

    try {
      await API.post(
        "/notices",
        { title, details },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Notice Created");

      setTitle("");
      setDetails("");
      fetchNotices(token);
    } catch (err) {
      console.log(err?.response?.data || err);
      Alert.alert("Error", "Create failed (check role/token)");
    }
  };

  const deleteNotice = async (id) => {
    try {
      await API.delete(`/notices/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNotices(token);
    } catch (err) {
      Alert.alert("Error", "Delete failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📢 Manage Notices</Text>

      <View style={styles.card}>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          placeholder="Details"
          value={details}
          onChangeText={setDetails}
          style={[styles.input, { height: 90 }]}
          multiline
        />

        <TouchableOpacity style={styles.btn} onPress={createNotice}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.btnText}> Create Notice</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#D10069" />}

      <FlatList
        data={notices}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.noticeCard}>
            <Text style={styles.noticeTitle}>{item.title}</Text>
            <Text style={styles.noticeDesc}>{item.details}</Text>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => deleteNotice(item._id)}
            >
              <Text style={{ color: "#fff" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#F8FAFC" },
  header: { fontSize: 24, fontWeight: "900", marginBottom: 15 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 15 },
  input: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  btn: {
    flexDirection: "row",
    backgroundColor: "#D10069",
    padding: 12,
    borderRadius: 10,
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontWeight: "800" },
  noticeCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 10,
    borderRadius: 12,
  },
  noticeTitle: { fontWeight: "900" },
  noticeDesc: { color: "#555" },
  deleteBtn: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});