import React, { useState } from "react";
import { 
  View, TextInput, TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator 
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "expo-router"; // ✅ Expo Router navigation

export default function LoginScreen() {
  const router = useRouter(); // ✅ Navigation with Expo Router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Function to handle login process
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Email and password cannot be empty!");
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      Alert.alert("Success", "Logged in successfully!");
      router.replace("/"); // ✅ Navigate to the home page (index.tsx)
    } catch (error: any) {
      Alert.alert("Login Failed", getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Function to map Firebase auth error codes to messages
  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid email format!";
      case "auth/user-not-found":
        return "No account found with this email!";
      case "auth/wrong-password":
        return "Incorrect password!";
      case "auth/too-many-requests":
        return "Too many failed attempts. Try again later.";
      default:
        return "Login failed. Please try again.";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
        style={styles.input} 
        placeholderTextColor="#FFD509"
        autoCapitalize="none"
        keyboardType="email-address"
        accessible={true}
        accessibilityLabel="Email Input"
      />

      <TextInput 
        placeholder="Password" 
        value={password} 
        onChangeText={setPassword} 
        secureTextEntry 
        style={styles.input} 
        placeholderTextColor="#FFD509"
        accessible={true}
        accessibilityLabel="Password Input"
      />

      <TouchableOpacity 
        style={[styles.button, loading && styles.disabledButton]} 
        onPress={handleLogin} 
        disabled={loading}
        accessible={true}
        accessibilityLabel="Login Button"
      >
        {loading ? <ActivityIndicator size="small" color="#000" /> : <Text style={styles.buttonText}>LOGIN</Text>}
      </TouchableOpacity>

      <Text onPress={() => router.push("/")} style={styles.link}>
        Don't have an account? <Text style={styles.highlight}>Sign Up</Text>
      </Text>
    </View>
  );
}

// 🔹 Styles (Improved readability)
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
  link: {
    color: "#FFD509",
    marginTop: 15,
    fontSize: 16,
  },
  highlight: {
    fontWeight: "bold",
    textDecorationLine: "underline"
  }
});

