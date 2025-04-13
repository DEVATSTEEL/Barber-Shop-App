import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native"; // ✅ Correct Navigation
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { memo } from "react"; // ✅ Optimize service rendering

type Service = {
  id: string;
  name: string;
  icon: JSX.Element; // ✅ Store JSX directly instead of function call
};

const services: Service[] = [
  { id: "1", name: "Haircuts", icon: <FontAwesome5 name="cut" size={28} color="#FFD509" /> },
  { id: "2", name: "Beard Trims", icon: <MaterialCommunityIcons name="mustache" size={28} color="#FFD509" /> },
  { id: "3", name: "Styling", icon: <MaterialCommunityIcons name="hair-dryer" size={28} color="#FFD509" /> },
  { id: "4", name: "Hair Coloring", icon: <FontAwesome5 name="palette" size={28} color="#FFD509" /> },
  { id: "5", name: "Scalp Treatment", icon: <MaterialCommunityIcons name="spa" size={28} color="#FFD509" /> },
  { id: "6", name: "Facial & Skin Care", icon: <MaterialCommunityIcons name="face-woman" size={28} color="#FFD509" /> },
  { id: "7", name: "Hot Towel Shaves", icon: <MaterialCommunityIcons name="shower" size={28} color="#FFD509" /> },
  { id: "8", name: "Massage Therapy", icon: <MaterialCommunityIcons name="hands-pray" size={28} color="#FFD509" /> },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#000000", dark: "#000000" }}
      headerImage={<Image source={require("@/assets/images/barber-shop-logo.png")} style={styles.logo} resizeMode="contain" />}
    >
      <View style={styles.fullContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          {/* Title Section */}
          <ThemedView style={styles.titleContainer}>
            <ThemedText type="title" style={styles.welcomeText}>Welcome to Groom & Glow✂️</ThemedText>
            <HelloWave />
          </ThemedView>

          {/* Booking Section */}
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle" style={styles.cardTitle}>Your Hair, Your Style 💇‍♂️</ThemedText>
            <TouchableOpacity
              style={styles.bookNowButton}
              onPress={() => navigation.navigate("booking" as never)} // ✅ Fixed navigation type
            >
              <ThemedText style={styles.bookNowText}>Book Now</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Services Section */}
          <ThemedView style={styles.card}>
            <ThemedText type="subtitle" style={styles.cardTitle}>Our Services</ThemedText>
            <View style={styles.serviceGrid}>
              {services.map((item) => (
                <ServiceTile key={item.id} name={item.name} icon={item.icon} />
              ))}
            </View>
          </ThemedView>
        </ScrollView>
      </View>
    </ParallaxScrollView>
  );
};

// ✅ Optimized service tile component
const ServiceTile = memo(({ name, icon }: { name: string; icon: JSX.Element }) => (
  <View style={styles.serviceTile}>
    {icon}
    <ThemedText style={styles.serviceText}>{name}</ThemedText>
  </View>
));

export default HomeScreen;

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  logo: {
    height: 150,
    width: 250,
    alignSelf: "center",
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
    padding: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#FFD509",
  },
  card: {
    backgroundColor: "#000000",
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5, // ✅ Slightly reduced border for better UI
    borderColor: "#FFD509",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#FFD509",
  },
  bookNowButton: {
    marginTop: 12,
    backgroundColor: "#FFD509",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  bookNowText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  serviceGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 30,
    width: "100%",
  },
  serviceTile: {
    backgroundColor: "#222222",
    width: "45%",
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFD509",
    marginBottom: 15,
  },
  serviceText: {
    fontSize: 12,
    textAlign: "center",
    color: "#FFD509",
    marginTop: 5,
  },
});
