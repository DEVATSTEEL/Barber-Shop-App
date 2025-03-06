import React, { useEffect, useState } from "react";
import { 
  View, Text, ActivityIndicator, Alert, 
  TouchableOpacity, StyleSheet 
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore"; // ✅ Firestore functions only
import { signOut } from "firebase/auth"; // ✅ Corrected import for signOut
import { Timestamp } from "firebase/firestore"; 
import { useRouter } from "expo-router"; 
import { FontAwesome } from "@expo/vector-icons"; 

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not logged in");
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const createdAt = data.createdAt instanceof Timestamp
            ? data.createdAt.toDate().toLocaleDateString()
            : "Unknown Date"; 

          setUserData({ ...data, createdAt });
        } else {
          Alert.alert("Error", "User not found in Firestore!");
        }
      } catch (error) {
        console.error("❌ Error fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth); // ✅ Use signOut from firebase/auth
      router.replace("/login"); 
    } catch (error) {
      Alert.alert("Error", "Failed to logout. Try again.");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#FFD509" />;

  return (
    <View style={styles.container}>
      <FontAwesome name="user-circle" size={100} color="#FFD509" style={styles.profileIcon} />
      <Text style={styles.title}>Profile</Text>

      {userData ? (
        <>
          <Text style={styles.info}>📧 Email: {userData.email}</Text>
          <Text style={styles.info}>🆔 UID: {userData.uid}</Text>
          <Text style={styles.info}>📅 Joined On: {userData.createdAt}</Text>

          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>LOGOUT</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>User not found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 20 
  },
  profileIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD509",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    color: "#FFD509",
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#FFD509",
    padding: 12,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FFD509",
    fontSize: 18,
    marginTop: 10,
  },
});
