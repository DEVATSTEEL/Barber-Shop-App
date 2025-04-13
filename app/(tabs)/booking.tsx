import React, { useState, useCallback, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { auth, db } from "../firebaseConfig";  
import { collection, addDoc } from "firebase/firestore"; 
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  confirm: { date: string; time: string; services: string[]; totalPrice: number };
};

type NavigationProps = StackNavigationProp<RootStackParamList, "confirm">;

export default function BookingScreen() {
  const navigation = useNavigation<NavigationProps>();

  const services = [
    { id: "1", name: "Haircut ✂️", price: 500 },
    { id: "2", name: "Beard Trim 🧔", price: 300 },
    { id: "3", name: "Hair Coloring 🎨", price: 800 },
    { id: "4", name: "Scalp Treatment 💆", price: 700 },
    { id: "5", name: "Hot Towel Shave 🔥", price: 400 },
  ];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((total, id) => {
      const service = services.find((s) => s.id === id);
      return total + (service ? service.price : 0);
    }, 0);
  }, [selectedServices]);

  const onChangeDate = useCallback((event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setSelectedDate((prev) => new Date(date.setHours(prev.getHours(), prev.getMinutes())));
    }
    setShowDatePicker(false);
  }, []);

  const onChangeTime = useCallback((event: DateTimePickerEvent, time?: Date) => {
    if (time) {
      setSelectedDate((prev) => new Date(prev.setHours(time.getHours(), time.getMinutes())));
    }
    setShowTimePicker(false);
  }, []);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(serviceId)
        ? prevSelected.filter((id) => id !== serviceId)
        : [...prevSelected, serviceId]
    );
  };

  const confirmBooking = async () => {
    if (selectedServices.length === 0) {
      Alert.alert("Selection Error", "Please select at least one service.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Login Required", "You must be logged in to book an appointment.");
      return;
    }

    try {
      const formattedDate = selectedDate.toDateString();
      const formattedTime = selectedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const selectedServiceNames = services
        .filter((service) => selectedServices.includes(service.id))
        .map((service) => service.name);

      await addDoc(collection(db, "bookings"), {
        userId: user.uid,
        userEmail: user.email,
        date: formattedDate,
        time: formattedTime,
        services: selectedServiceNames,
        totalPrice: totalPrice,
        status: "pending",
        createdAt: new Date(),
      });

      navigation.navigate("confirm", {
        date: formattedDate,
        time: formattedTime,
        services: selectedServiceNames,
        totalPrice: totalPrice,
      });

    } catch (error) {
      console.error("Error booking:", error);
      Alert.alert("Booking Failed", "Failed to book appointment. Please try again.");
    }
  };
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handlePress = (option: string) => {
    setSelectedOption(option);
  };
  
  <TouchableOpacity 
    style={[styles.option, selectedOption === "option1" && styles.optionSelected]} 
    onPress={() => handlePress("option1")}
  >
    <Text style={[styles.optionText, selectedOption === "option1" && styles.optionTextSelected]}>
      Option 1
    </Text>
  </TouchableOpacity>  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Book Your Appointment</Text>

        <TouchableOpacity style={styles.option} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.optionText}>📅 {selectedDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && <DateTimePicker value={selectedDate} mode="date" display="default" onChange={onChangeDate} />}

        <TouchableOpacity style={styles.option} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.optionText}>⏰ {selectedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
        </TouchableOpacity>
        {showTimePicker && <DateTimePicker value={selectedDate} mode="time" display="default" onChange={onChangeTime} />}

        <Text style={styles.serviceTitle}>Choose Services:</Text>
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = selectedServices.includes(item.id);
            return (
              <TouchableOpacity
                style={[styles.serviceItem, isSelected && styles.serviceSelected]}
                onPress={() => toggleService(item.id)}
              >
                <Text style={[styles.serviceText, isSelected && styles.serviceTextSelected]}>
                  {item.name} - ₹{item.price}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, selectedServices.length === 0 && styles.disabledButton]}
          onPress={confirmBooking}
          disabled={selectedServices.length === 0}
        >
          <Text style={styles.buttonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#000" 
  },
  card: { 
    width: "90%", 
    padding: 24, 
    backgroundColor: "#000",  // Black background
    borderRadius: 12, 
    alignItems: "center", 
    borderWidth: 2, 
    borderColor: "#FFD509",  // Yellow accent
    shadowColor: "#FFD509", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.4, 
    shadowRadius: 6, 
    elevation: 8, 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#FFD509",  // Yellow text
    textAlign: "center", 
    marginBottom: 10 
  },
  option: { 
    padding: 15, 
    backgroundColor: "#FFD509",  // Default black background
    borderWidth: 2, 
    borderColor: "#FFD509",  // Yellow accent
    marginVertical: 5, 
    borderRadius: 8, 
    width: "100%", 
    alignItems: "center" 
  },
  optionText: { 
    fontSize: 18, 
    textAlign: "center", 
    color: "#000",  // Yellow text
    fontWeight: "bold" 
  },
  optionSelected: { 
    backgroundColor: "#FFD509",  // When clicked, fill with yellow
  },
  optionTextSelected: { 
    color: "#000",  // Change text to black when clicked
    fontWeight: "bold" 
  },
  serviceTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginTop: 10, 
    color: "#FFD509" 
  },
  serviceItem: { 
    padding: 12, 
    marginVertical: 5, 
    backgroundColor: "#000",  // Default black
    borderWidth: 2, 
    borderColor: "#FFD509", 
    borderRadius: 8, 
    width: "100%", 
    alignItems: "center" 
  },
  serviceSelected: { 
    backgroundColor: "#FFD509",  // Fill with yellow on click
  },
  serviceText: { 
    fontSize: 16, 
    textAlign: "center", 
    color: "#FFD509",  // Default yellow text
    fontWeight: "bold" 
  },
  serviceTextSelected: { 
    color: "#000"  // Change text to black when clicked
  },
  totalContainer: { 
    marginTop: 15, 
    padding: 12, 
    backgroundColor: "#FFD509",  // Black background
    borderWidth: 2, 
    borderColor: "#FFD509", 
    borderRadius: 8, 
    width: "100%", 
    alignItems: "center" 
  },
  totalText: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#000" 
  },
  button: { 
    backgroundColor: "#FFD509",  // Default black
    paddingVertical: 14, 
    borderRadius: 8, 
    marginTop: 16, 
    width: "100%", 
    alignItems: "center", 
    borderWidth: 2, 
    borderColor: "#FFD509", 
    shadowColor: "#FFD509", 
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.4, 
    shadowRadius: 4, 
    elevation: 5 
  },
  buttonText: { 
    textAlign: "center", 
    color: "#000",  // Yellow text
    fontSize: 18, 
    fontWeight: "bold" 
  },
  buttonSelected: { 
    backgroundColor: "#FFD509",  // When clicked, fill with yellow
  },
  buttonTextSelected: { 
    color: "#000"  // Change text to black when clicked
  },
  disabledButton: { 
    backgroundColor: "#555"  // Grey color for disabled state
  },  
});
