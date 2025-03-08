import React, { useEffect, useState } from "react";
import { 
  View, Text, ActivityIndicator, Alert, 
  TouchableOpacity, StyleSheet, FlatList 
} from "react-native";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import { signOut, onAuthStateChanged } from "firebase/auth"; 
import { useRouter } from "expo-router"; 
import { FontAwesome } from "@expo/vector-icons"; 

// 🔥 Define TypeScript Type for Bookings
type Booking = {
  id: string;
  service: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM AM/PM"
  status: string;
};

export default function ProfileScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]); // Typed array for safety
  let isMounted = true; // Prevent memory leaks

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user.uid);
        fetchUserBookings(user.uid); // Fetch filtered bookings
      } else {
        if (isMounted) {
          setLoading(false);
          setAlertMessage("User not logged in");

          // Redirect to login
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

  // 🔥 Fetch User Name from Firestore
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

  // 🔥 Fetch and Filter Upcoming Bookings from Firestore
  const fetchUserBookings = async (uid: string) => {
    try {
      const bookingsRef = collection(db, "bookings");
      const q = query(bookingsRef, where("userId", "==", uid));
      const querySnapshot = await getDocs(q);

      if (isMounted) {
        const currentTime = new Date(); // Get current time at login
        console.log("Current Time:", currentTime.toISOString()); // Debugging

        const userBookings: Booking[] = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            
            // 🔥 Ensure date and time are correctly formatted
            const dateStr = data.date || ""; // Expected format: "YYYY-MM-DD"
            const timeStr = data.time || ""; // Expected format: "HH:MM AM/PM"

            // 🔥 Convert Firestore Timestamp to Date object if needed
            let bookingDateTime: Date;
            if (data.timestamp) {
              // If Firestore stores timestamps
              bookingDateTime = data.timestamp.toDate();
            } else {
              bookingDateTime = new Date(`${dateStr} ${timeStr}`);
            }

            return {
              id: doc.id,
              service: data.service || "Unknown Service",
              date: dateStr,
              time: timeStr,
              status: data.status || "Pending",
              bookingDateTime, // Store actual Date object for comparison
            };
          })
          .filter(booking => booking.bookingDateTime > currentTime); // Show only future bookings

        setBookings(userBookings);
      }
    } catch (error) {
      if (isMounted) setAlertMessage("Failed to fetch bookings");
    }
  };

  // 🔥 Handle Logout
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

      {/* 🔥 Display Upcoming Bookings */}
      <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
      {bookings.length === 0 ? (
        <Text style={styles.noBookings}>No upcoming bookings.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookingItem}>
              <Text style={styles.bookingText}>Service: {item.service}</Text>
              <Text style={styles.bookingText}>Date: {item.date}</Text>
              <Text style={styles.bookingText}>Time: {item.time}</Text>
              <Text style={styles.bookingText}>Status: {item.status}</Text>
            </View>
          )}
        />
      )}

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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD509",
    marginBottom: 10,
  },
  noBookings: {
    color: "#FFD509",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  bookingItem: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  bookingText: {
    color: "#FFD509",
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
