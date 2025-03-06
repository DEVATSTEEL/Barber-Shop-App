import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

type Service = {
  id: string;
  name: string;
  icon: JSX.Element;
};

const services: Service[] = [
  { id: '1', name: 'Haircuts', icon: <FontAwesome5 name="cut" size={28} color="#FFD509" /> },
  { id: '2', name: 'Beard Trims', icon: <MaterialCommunityIcons name="mustache" size={28} color="#FFD509" /> }, // Fixed icon
  { id: '3', name: 'Styling', icon: <MaterialCommunityIcons name="hair-dryer" size={28} color="#FFD509" /> },
  { id: '4', name: 'Hair Coloring', icon: <FontAwesome5 name="palette" size={28} color="#FFD509" /> },
  { id: '5', name: 'Scalp Treatment', icon: <MaterialCommunityIcons name="spa" size={28} color="#FFD509" /> },
  { id: '6', name: 'Facial & Skin Care', icon: <MaterialCommunityIcons name="face-woman" size={28} color="#FFD509" /> },
  { id: '7', name: 'Hot Towel Shaves', icon: <MaterialCommunityIcons name="shower" size={28} color="#FFD509" /> },
  { id: '8', name: 'Massage Therapy', icon: <MaterialCommunityIcons name="hands-pray" size={28} color="#FFD509" /> },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#000000', dark: '#000000' }}
      headerImage={<Image source={require('@/assets/images/barber-shop-logo.png')} style={styles.logo} resizeMode="contain" />} // Fixed deprecated prop
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.welcomeText}>Welcome to BarberX! ✂️</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Your Hair, Your Style 💇‍♂️</ThemedText>
        <TouchableOpacity style={styles.bookNowButton} onPress={() => router.push('/booking')}>
          <ThemedText style={styles.bookNowText}>Book Now</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Services Section */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle" style={styles.cardTitle}>Our Services</ThemedText>
        <View style={styles.serviceGrid}>
          {services.map((item) => (
            <View key={item.id} style={styles.serviceTile}>
              {item.icon}
              <ThemedText style={styles.serviceText}>{item.name}</ThemedText>
            </View>
          ))}
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  logo: {
    height: 150,
    width: 250,
    alignSelf: 'center',
    marginTop: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    padding: 20,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFD509',
  },
  card: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFD509',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFD509',
  },
  bookNowButton: {
    marginTop: 12,
    backgroundColor: '#FFD509',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookNowText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10, // Added gap for better spacing
  },
  serviceTile: {
    backgroundColor: '#222222',
    width: '47%', // Slightly reduced to prevent layout issues
    aspectRatio: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD509',
  },
  serviceText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#FFD509',
    marginTop: 5,
  },
});
