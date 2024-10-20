import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../utils/supabase';
import { useUser } from './UserContext';
import { useFocusEffect } from '@react-navigation/native';

type RootStackParamList = {
  Main: undefined;
  CountryInfo: { country: string };
  Profile: undefined;
};

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

type MainScreenProps = {
  navigation: MainScreenNavigationProp;
};

const countries = [
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Belgium', flag: '🇧🇪' },
  { name: 'Bulgaria', flag: '🇧🇬' },
  { name: 'Croatia', flag: '🇭🇷' },
  { name: 'Cyprus', flag: '🇨🇾' },
  { name: 'Czech Republic', flag: '🇨🇿' },
  { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Estonia', flag: '🇪🇪' },
  { name: 'Finland', flag: '🇫🇮' },
  { name: 'France', flag: '🇫🇷' },
  { name: 'Germany', flag: '🇩🇪' },
  { name: 'Greece', flag: '🇬🇷' },
  { name: 'Hungary', flag: '🇭🇺' },
  { name: 'Ireland', flag: '🇮🇪' },
  { name: 'Italy', flag: '🇮🇹' },
  { name: 'Latvia', flag: '🇱🇻' },
  { name: 'Lithuania', flag: '🇱🇹' },
  { name: 'Luxembourg', flag: '🇱🇺' },
  { name: 'Malta', flag: '🇲🇹' },
  { name: 'Netherlands', flag: '🇳🇱' },
  { name: 'Poland', flag: '🇵🇱' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'Romania', flag: '🇷🇴' },
  { name: 'Slovakia', flag: '🇸🇰' },
  { name: 'Slovenia', flag: '🇸🇮' },
  { name: 'Spain', flag: '🇪🇸' },
  { name: 'Sweden', flag: '🇸🇪' },
];

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoriteCountries, setFavoriteCountries] = useState<string[]>([]);
  const { isAuthenticated, userId } = useUser();

  const fetchFavoriteCountries = useCallback(async () => {
    if (!isAuthenticated || !userId) {
      setFavoriteCountries([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('country')
        .eq('user_id', userId);

      if (error) throw error;

      const favorites = data.map(item => item.country);
      console.log('Fetched favorite countries:', favorites);
      setFavoriteCountries(favorites);
    } catch (error) {
      console.error('Error fetching favorite countries:', error);
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    fetchFavoriteCountries();
  }, [fetchFavoriteCountries]);

  useFocusEffect(
    useCallback(() => {
      console.log('Screen focused, fetching favorite countries');
      fetchFavoriteCountries();
    }, [fetchFavoriteCountries])
  );

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!showFavorites || favoriteCountries.includes(country.name))
  );

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const toggleFavorites = () => {
    console.log('Toggling favorites. Current state:', !showFavorites);
    setShowFavorites(!showFavorites);
  };

  return (
    <LinearGradient
      colors={['#4e54c8', '#8f94fb']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>EuroGo Country list</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search countries..."
            placeholderTextColor="#fff"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <FlatList
          data={filteredCountries}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('CountryInfo', { country: item.name })}
            >
              <ListItem containerStyle={styles.listItem}>
                <Text style={styles.flag}>{item.flag}</Text>
                <ListItem.Content>
                  <ListItem.Title style={styles.countryName}>{item.name}</ListItem.Title>
                </ListItem.Content>
              </ListItem>
            </TouchableOpacity>
          )}
        />
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton} onPress={() => setShowFavorites(false)}>
            <Text style={showFavorites ? styles.footerButtonText : styles.footerButtonTextActive}>Countries</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={toggleFavorites}>
            <Text style={showFavorites ? styles.footerButtonTextActive : styles.footerButtonText}>Favorites</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.footerButtonText}>Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
    color: '#fff',
  },
  searchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  searchInput: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    fontSize: 16,
    color: '#fff',
  },
  listItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
  },
  flag: {
    fontSize: 30,
    marginRight: 10,
  },
  countryName: {
    color: '#fff',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
  },
  footerButton: {
    padding: 10,
  },
  footerButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
  footerButtonTextActive: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MainScreen;
