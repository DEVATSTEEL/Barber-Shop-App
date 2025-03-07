import React, { useEffect, useState } from "react";
import { 
  View, Text, ActivityIndicator, Alert, 
  TouchableOpacity, StyleSheet, FlatList 
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore"; 
import { signOut, onAuthStateChanged } from "firebase/auth"; 
import { useRouter } from "expo-router"; 
import { FontAwesome } from "@expo/vector-icons"; 

export default function ProfileScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user.uid);
        fetchUserBookings(user.uid);
      } else {
        router.replace("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserName(userDoc.data().name || "User");
      } else {
        Alert.alert("Error", "User not found in Firestore!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch user details");
    }
  };

  const fetchUserBookings = async (uid: string) => {
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("userId", "==", uid));

      const snapshot = await getDocs(q);
      const userBookings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(userBookings);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserName(null); // Clear user state
      setBookings([]);   // Clear bookings
      router.replace("/login");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      Alert.alert("Logout Failed", errorMessage);
    }
  };
  

  if (loading) return <ActivityIndicator size="large" color="#FFD509" />;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.userName}>{userName}</Text>
        <FontAwesome name="user-circle" size={40} color="#FFD509" />
      </View>

      {/* Bookings Section */}
      <View style={styles.bookingsBox}>
        <Text style={styles.boxTitle}>Your Bookings</Text>

        {bookings.length > 0 ? (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.bookingItem}>
                <Text style={styles.bookingText}>
                  📅 {item.date} 🕒 {item.time} 📍 {item.location}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noBookings}>No bookings found</Text>
        )}
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
  bookingsBox: {
    backgroundColor: "#FFD509",
    padding: 15,
    borderRadius: 10,
    width: "100%",
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
  },
  bookingItem: {
    backgroundColor: "#000",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
  },
  bookingText: {
    color: "#FFD509",
    textAlign: "center",
    fontWeight: "bold",
  },
  noBookings: {
    textAlign: "center",
    color: "#000",
    fontSize: 16,
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
