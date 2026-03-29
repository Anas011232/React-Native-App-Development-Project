import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://192.168.0.172:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Success", data.message);
        setName('');
        setEmail('');
        setPassword('');
      } else {
        Alert.alert("Error", data.message || "Something went wrong");
      }
    } catch (err) {
      Alert.alert("Error", "Cannot connect to server");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#0f172a",
    justifyContent:"center",
    alignItems:"center",
    padding:20
  },
  card:{
    width:"100%",
    backgroundColor:"#1e293b",
    padding:30,
    borderRadius:20,
    shadowColor:"#000",
    shadowOpacity:0.4,
    shadowRadius:20,
    elevation:10
  },
  title:{
    fontSize:28,
    fontWeight:"bold",
    color:"#fff",
    marginBottom:20,
    textAlign:"center"
  },
  input:{
    backgroundColor:"#0f172a",
    color:"#fff",
    paddingVertical:12,
    paddingHorizontal:15,
    borderRadius:10,
    marginBottom:15
  },
  button:{
    backgroundColor:"#6366f1",
    paddingVertical:14,
    borderRadius:12,
    marginTop:10,
    alignItems:"center"
  },
  buttonText:{
    color:"#fff",
    fontSize:16,
    fontWeight:"600"
  }
});