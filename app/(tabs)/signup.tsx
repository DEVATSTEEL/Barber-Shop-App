import React, { useState } from "react";
import { 
  View, TextInput, TouchableOpacity, Text, 
  Alert, ActivityIndicator, StyleSheet 
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; 
import { serverTimestamp } from "firebase/firestore";
import { useRouter } from "expo-router"; // ✅ Use Expo Router

export default function SignUpScreen() {
  const router = useRouter(); // ✅ Use Expo Router for navigation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters!");
      return;
    }

    setLoading(true);

    try {
      console.log("🚀 Creating user in Firebase Authentication...");

      // ✅ Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = userCredential.user;

      console.log("✅ User created:", user.uid);

      // ✅ Store user details in Firestore
      console.log("📂 Storing user details in Firestore...");
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name.trim(),
        email: email.trim(),
        createdAt: serverTimestamp(),
      });

      Alert.alert("Success", "Account created successfully!");
      router.replace("/login"); 

    } catch (error: any) {
      console.error("❌ Firebase Error:", error);

      let errorMessage = "Sign-up failed. Please try again.";
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "This email is already in use!";
          break;
        case "auth/invalid-email":
          errorMessage = "Invalid email format!";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters!";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your internet connection!";
          break;
      }

      Alert.alert("Sign Up Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput 
        placeholder="Name" 
        value={name} 
        onChangeText={setName} 
        style={styles.input} 
        placeholderTextColor="#FFD509"
      />

      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        placeholderTextColor="#FFD509"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input} 
        placeholderTextColor="#FFD509"
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]} 
        onPress={handleSignUp} 
        disabled={loading}
      >
        {loading ? <ActivityIndicator size="small" color="#000" /> : <Text style={styles.buttonText}>SIGN UP</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#000", 
    padding: 20 
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD509",
    marginBottom: 20,
  },
  input: { 
    width: "100%", 
    borderWidth: 2, 
    borderColor: "#FFD509", 
    backgroundColor: "#000",
    padding: 12, 
    marginBottom: 12, 
    borderRadius: 5, 
    fontSize: 16,
    color: "#FFD509"
  },
  button: {
    width: "100%",
    backgroundColor: "#FFD509",
    padding: 14,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    color: "#FFD509",
    marginTop: 10,
    fontSize: 16,
  },
});

