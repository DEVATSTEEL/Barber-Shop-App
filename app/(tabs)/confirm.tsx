import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";

type RootStackParamList = {
  confirm: {
    date: string;
    time: string;
    services: string[];
    totalPrice: number;
  };
};

type ConfirmScreenRouteProp = RouteProp<RootStackParamList, "confirm">;

export default function ConfirmScreen() {
  const route = useRoute<ConfirmScreenRouteProp>();
  const { date, time, services, totalPrice } = route.params;

  console.log("Route Params:", route.params); // Debugging

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Confirmed! ✅</Text>
      <Text style={styles.info}>📅 Date: {new Date(date).toDateString()}</Text>
      <Text style={styles.info}>⏰ Time: {time}</Text>
      <Text style={styles.info}>💇 Services:</Text>
      {services.map((service, index) => (
        <Text key={index} style={styles.service}>{service}</Text>
      ))}
      <Text style={styles.total}>💰 Total Price: ₹{totalPrice || 0}</Text> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#FFD509"  // Yellow Background
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#000000"  // Black Text
  },
  info: { 
    fontSize: 18, 
    marginVertical: 5, 
    color: "#000000"  // Black Text
  },
  service: { 
    fontSize: 16, 
    color: "#000000"  // Black Text
  },
  total: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginTop: 10, 
    color: "#000000"  // Black Text
  },
});
