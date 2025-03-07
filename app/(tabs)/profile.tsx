import React, { useEffect, useState } from "react";
import { 
  View, Text, ActivityIndicator, Alert, 
  TouchableOpacity, StyleSheet 
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore"; 
import { signOut, onAuthStateChanged } from "firebase/auth"; 
import { useRouter } from "expo-router"; 
import { FontAwesome } from "@expo/vector-icons"; 

export default function ProfileScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  let isMounted = true; // Track component state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid);
      } else {
        if (isMounted) {
          setLoading(false);
          setAlertMessage("User not logged in");

          // Prevent navigation issues
          setTimeout(() => {
            router.replace("/login"); 
          }, 500);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (alertMessage) {
      Alert.alert("Error", alertMessage);
      setAlertMessage(null);
    }
  }, [alertMessage]);

  const fetchUserName = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && isMounted) {
        setUserName(userDoc.data().name || "User");
      } else if (isMounted) {
        setUserName(null);
        setAlertMessage("User not found in Firestore!");
      }
    } catch (error) {
      if (isMounted) setAlertMessage("Failed to fetch user name");
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setTimeout(() => {
        router.replace("/login");
      }, 500);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      Alert.alert("Logout Failed", errorMessage);
    }
  };
  

  if (loading) return <ActivityIndicator size="large" color="#FFD509" />;

  return (
    <View style={styles.container}>
      {/* Header: Name on Left, Profile Icon on Right */}
      <View style={styles.header}>
        <Text style={styles.userName}>{userName}</Text>
        <FontAwesome name="user-circle" size={40} color="#FFD509" />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>LOGOUT</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000000",
    padding: 20 
  },
  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    marginBottom: 20
  },
  userName: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#FFD509" 
  },
  button: {
    marginTop: 20,
    backgroundColor: "#FFD509",
    padding: 12,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    alignSelf: "center"
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  }
});
