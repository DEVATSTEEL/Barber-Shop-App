import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#000000',
    padding: 24,
    borderRadius: 12,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#FFD509',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD509',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFD509',
    textAlign: 'center',
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#FFD509',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
  serviceTitle: {
    fontSize: 18,
    color: '#FFD509',
    fontWeight: 'bold',
    marginTop: 20,
  },
  serviceItem: {
    backgroundColor: '#FFD509',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  serviceText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  serviceSelected: {
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: '#FFD509',
  },
  serviceTextSelected: {
    color: '#FFD509',
  },
  totalContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFD509',
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  button: {
    backgroundColor: '#FFD509',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
  },
});

export default function BookingScreen() {
  const router = useRouter();

  // Services List with Prices
  const services = [
    { id: '1', name: 'Haircut ✂️', price: 500 },
    { id: '2', name: 'Beard Trim 🧔', price: 300 },
    { id: '3', name: 'Hair Coloring 🎨', price: 800 },
    { id: '4', name: 'Scalp Treatment 💆', price: 700 },
    { id: '5', name: 'Hot Towel Shave 🔥', price: 400 },
  ];

  // State Management
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Handles Date Selection
  const onChangeDate = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setSelectedDate((prev) => new Date(date.setHours(prev.getHours(), prev.getMinutes())));
    }
    setShowDatePicker(false);
  };

  // Handles Time Selection
  const onChangeTime = (event: DateTimePickerEvent, time?: Date) => {
    if (time) {
      setSelectedDate((prev) => new Date(prev.setHours(time.getHours(), time.getMinutes())));
    }
    setShowTimePicker(false);
  };

  // Toggle Service Selection
  const toggleService = (serviceId: string, price: number) => {
    setSelectedServices((prevSelected) => {
      if (prevSelected.includes(serviceId)) {
        setTotalPrice((prevTotal) => prevTotal - price);
        return prevSelected.filter(id => id !== serviceId);
      } else {
        setTotalPrice((prevTotal) => prevTotal + price);
        return [...prevSelected, serviceId];
      }
    });
  };

  return (
    <LinearGradient colors={['#FFD509', '#000000']} style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Book Your Appointment</Text>
        <Text style={styles.subtitle}>Choose your preferred date & time.</Text>

        {/* Date Selection */}
        <TouchableOpacity style={styles.option} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.optionText}>📅 {selectedDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker value={selectedDate} mode="date" display="default" onChange={onChangeDate} />
        )}

        {/* Time Selection */}
        <TouchableOpacity style={styles.option} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.optionText}>⏰ {selectedDate.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker value={selectedDate} mode="time" display="default" onChange={onChangeTime} />
        )}

        {/* Service Selection */}
        <Text style={styles.serviceTitle}>Select Services:</Text>
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.serviceItem,
                selectedServices.includes(item.id) && styles.serviceSelected,
              ]}
              onPress={() => toggleService(item.id, item.price)}
            >
              <Text
                style={[
                  styles.serviceText,
                  selectedServices.includes(item.id) && styles.serviceTextSelected,
                ]}
              >
                {item.name} - ₹{item.price}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Total Price */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ₹{totalPrice}</Text>
        </View>

        {/* Confirm Booking Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            const formattedTime = selectedDate.toLocaleTimeString();
            const selectedServicesNames = services
              .filter(service => selectedServices.includes(service.id))
              .map(service => service.name)
              .join(', ');

            router.push(
              `/confirm?date=${encodeURIComponent(selectedDate.toISOString())}&time=${encodeURIComponent(formattedTime)}&total=${totalPrice}&services=${encodeURIComponent(selectedServicesNames)}`
            );
          }}
          disabled={selectedServices.length === 0}
        >
          <Text style={styles.buttonText}>Confirm Booking</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
