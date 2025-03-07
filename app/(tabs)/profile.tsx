import React, { useEffect, useState } from "react";
import { 
  View, Text, ActivityIndicator, Alert, 
  TouchableOpacity, StyleSheet 
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, Timestamp } from "firebase/firestore"; 
import { signOut, onAuthStateChanged } from "firebase/auth"; 
import { useRouter } from "expo-router"; 
import { FontAwesome } from "@expo/vector-icons"; 

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
      } else {
        setLoading(false);
        setAlertMessage("User not logged in");
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  useEffect(() => {
    if (alertMessage) {
      Alert.alert("Error", alertMessage);
      setAlertMessage(null);
    }
  }, [alertMessage]);

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      console.log("📄 Fetching Firestore Document for UID:", uid);

      const userDoc = await getDoc(userDocRef);
      console.log("📄 Firestore Document Exists:", userDoc.exists());

      if (userDoc.exists()) {
        const data = userDoc.data();
        console.log("✅ User Data from Firestore:", data);

        const createdAt = data.createdAt instanceof Timestamp
          ? data.createdAt.toDate().toLocaleDateString()
          : "Unknown Date";

        setUserData({ ...data, uid, createdAt });
      } else {
        console.error("❌ No user document found in Firestore!");
        setUserData(null);
        setAlertMessage("User not found in Firestore!");
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      setAlertMessage("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); 
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
