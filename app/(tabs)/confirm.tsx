import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function ConfirmScreen() {
  const router = useRouter();
  const { date, time, services, total } = useLocalSearchParams();

  console.log("🚀 Raw Params:", { date, time, services, total }); // Debugging log

  // Convert `date` and `time` from an array if needed
  const safeDate = Array.isArray(date) ? date[0] : date;
  const safeTime = Array.isArray(time) ? time[0] : time;

  // Ensure `services` is properly formatted
  let formattedServices = "No services selected";
  if (services) {
    formattedServices = Array.isArray(services) ? services.join(", ") : services;
  }

  // Debugging logs
  console.log("📅 Safe Date:", safeDate);
  console.log("⏰ Safe Time:", safeTime);
  console.log("💇 Services:", formattedServices);

  // Format date properly
  let formattedDate = "N/A";
  if (safeDate) {
    try {
      formattedDate = new Date(safeDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (error) {
      console.log("❌ Date Formatting Error:", error);
    }
  }

  // Format time correctly
  let formattedTime = "N/A";
  if (safeTime) {
    try {
      formattedTime = new Date(safeDate).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.log("❌ Time Formatting Error:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointment Confirmed! ✅</Text>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>📅 Date: {formattedDate}</Text>
        <Text style={styles.detailText}>⏰ Time: {formattedTime}</Text>
        <Text style={styles.detailText}>💇 Services: {formattedServices}</Text>
        <Text style={styles.totalText}>💰 Total: ₹{total || "N/A"}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
        <Text style={styles.buttonText}>Go to Home</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD509",
    marginBottom: 20,
  },
  detailsContainer: {
    backgroundColor: "#FFD509",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  detailText: {
    fontSize: 18,
    color: "#000",
    marginVertical: 5,
    fontWeight: "bold",
  },
  totalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginTop: 10,
  },
  button: {
    backgroundColor: "#FFD509",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
  },
});
