import React, { useState, useEffect, useCallback } from 'react';
import { ListItem } from 'react-native-elements';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Button } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from './UserContext';
import { supabase } from '../utils/supabase';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import euCountryCoordinates from './euCountryCoordinates';
import CountryMap from './CountryMap';




type RootStackParamList = {
  CountryInfo: { country: string };
  PreArrivalInfo: { country: string };
  PostArrivalInfo: { country: string };
  ListedJobsInfo: { country: string };
};

type CountryInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CountryInfo'>;
type CountryInfoScreenRouteProp = RouteProp<RootStackParamList, 'CountryInfo'>;

type CountryInfoScreenProps = {
  navigation: CountryInfoScreenNavigationProp;
  route: CountryInfoScreenRouteProp;
};

type CountryColors = {
  [key: string]: string[];
};


 

const countryColors: CountryColors = {
  'Austria': ['#ED2939', '#FFFFFF', '#ED2939'],
  'Belgium': ['#000000', '#FFFF00', '#FF0000'],
  'Bulgaria': ['#FFFFFF', '#00966E', '#D62612'],
  'Croatia': ['#FF0000', '#FFFFFF', '#0093DD'],
  'Cyprus': ['#FFFFFF', '#D47600', '#006847'],
  'Czech Republic': ['#FFFFFF', '#D7141A', '#11457E'],
  'Denmark': ['#C60C30', '#FFFFFF', '#C60C30'],
  'Estonia': ['#0072CE', '#000000', '#FFFFFF'],
  'Finland': ['#FFFFFF', '#002F6C', '#FFFFFF'],
  'France': ['#002395', '#FFFFFF', '#ED2939'],
  'Germany': ['#000000', '#DD0000', '#FFCE00'],
  'Greece': ['#0D5EAF', '#FFFFFF', '#0D5EAF'],
  'Hungary': ['#CE2939', '#FFFFFF', '#477050'],
  'Ireland': ['#169B62', '#FFFFFF', '#FF883E'],
  'Italy': ['#008C45', '#F4F9FF', '#CD212A'],
  'Latvia': ['#9E3039', '#FFFFFF', '#9E3039'],
  'Lithuania': ['#FDB913', '#006A44', '#C1272D'],
  'Luxembourg': ['#ED2939', '#FFFFFF', '#00A1DE'],
  'Malta': ['#FFFFFF', '#CF142B', '#FFFFFF'],
  'Netherlands': ['#AE1C28', '#FFFFFF', '#21468B'],
  'Poland': ['#FFFFFF', '#DC143C', '#FFFFFF'],
  'Portugal': ['#006600', '#FF0000', '#FFC400'],
  'Romania': ['#002B7F', '#FCD116', '#CE1126'],
  'Slovakia': ['#FFFFFF', '#0B4EA2', '#EE1C25'],
  'Slovenia': ['#FFFFFF', '#005CE6', '#ED1C24'],
  'Spain': ['#AA151B', '#F1BF00', '#AA151B'],
  'Sweden': ['#006AA7', '#FECC00', '#006AA7'],
 
  // Add more countries and their colors here
};

type CountryData = {
  name: string;
  capital: string;
  population: string;
  language: string;
  currency: string;
  flag_code: string;
  geography: {
    area: string;
    terrain: string;
    coastline: string;
  };
  economy: {
    gdp: string;
    sectors: {
      industry: string;
      services: string;
      agriculture: string;
    };
    major_industries: string;
  };
  climate: {
    type: string;
    average_temp: string;
    rainfall: string;
  };
  notable_facts: string[];
};

const CountryInfoScreen: React.FC<CountryInfoScreenProps> = ({ navigation, route }) => {
  const [country, setCountry] = useState<CountryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [flagLoaded, setFlagLoaded] = useState(false);
  const [flagLoadError, setFlagLoadError] = useState(false);
  const [mapError, setMapError] = useState(false);

  const { isAuthenticated, userId, userName } = useUser();

  const handleFlagLoad = () => {
    setFlagLoaded(true);
    setFlagLoadError(false);
    console.log('Flag loaded successfully');
  };

  const handleFlagLoadError = (error: any) => {
    setFlagLoaded(false);
    setFlagLoadError(true);
    console.error('Error loading flag:', error);
  };

  const getFlagUrl = (countryCode: string) => {
    return `https://flagcdn.com/w80/${countryCode.toLowerCase()}.png`;
  };

  const getFlagEmoji = (countryCode: string) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  const checkIfFavorite = useCallback(async () => {
    if (!country || !userId) return;

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', userId)
        .eq('country', country.name);

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking favorite status:', error);
      } else {
        setIsFavorite(data && data.length > 0);
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [country, userId]);

  useEffect(() => {
    fetchCountryData();
    console.log('Authentication state:', { isAuthenticated, userId, userName });
  }, [isAuthenticated, userId, userName]);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && userId && country) {
        checkIfFavorite();
      }
    }, [isAuthenticated, userId, checkIfFavorite, country])
  );

  const toggleFavorite = async () => {
    if (!isAuthenticated || !userId) {
      Alert.alert('Error', 'You must be logged in to manage favorites');
      return;
    }

    if (!country) {
      Alert.alert('Error', 'Country information is not available');
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('country', country.name);

        if (error) throw error;

        setIsFavorite(false);
        Alert.alert('Success', `${country.name} removed from favorites`);
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({ user_id: userId, country: country.name });

        if (error) throw error;

        setIsFavorite(true);
        Alert.alert('Success', `${country.name} added to favorites`);
      }

      if (navigation.getParent()) {
        navigation.getParent()?.setParams({ favoritesUpdated: Date.now() });
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', error.message || 'Failed to update favorites');
    }
  };

  const fetchCountryData = async (retryCount = 0) => {
    try {
      const response = await fetch('https://www.google.com', { method: 'HEAD' });
      if (!response.ok) {
        throw new Error('No internet connection');
      }

      const { data, error: supabaseError } = await supabase
        .from('countries')
        .select('*')
        .eq('name', route.params.country)
        .single();

      if (supabaseError) throw supabaseError;

      if (!data) {
        throw new Error('No data returned from Supabase');
      }

      setCountry(data);
      setLoading(false);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching country data:', error);
      setError(error.message || 'An error occurred while fetching data');
      setLoading(false);

      if (retryCount < 3) {
        setTimeout(() => fetchCountryData(retryCount + 1), 1000 * (retryCount + 1));
      } else {
        Alert.alert(
          'Error',
          'Failed to fetch country data. Please check your internet connection and try again.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading country data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Retry" onPress={() => fetchCountryData()} />
      </View>
    );
  }

  if (!country) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No data available for this country.</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const countryColor = countryColors[country.name] || ['#003399', '#FFFFFF', '#FFD700'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.tabContent}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Capital</Text>
                <Text style={styles.infoValue}>{country.capital}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Population</Text>
                <Text style={styles.infoValue}>{country.population}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Language</Text>
                <Text style={styles.infoValue}>{country.language}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Currency</Text>
                <Text style={styles.infoValue}>{country.currency}</Text>
              </View>
            </View>
          </View>
        );
      case 'geography':
        return (
          <View style={styles.tabContent}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Area</Text>
                <Text style={styles.infoValue}>{country.geography.area}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Coastline</Text>
                <Text style={styles.infoValue}>{country.geography.coastline}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Terrain</Text>
                <Text style={styles.infoValue}>{country.geography.terrain}</Text>
              </View>
            </View>
          </View>
        );
      case 'economy':
        return (
          <View style={styles.tabContent}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>GDP</Text>
                <Text style={styles.infoValue}>{country.economy.gdp}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Key Sectors</Text>
                <Text style={styles.infoValue}>Industry: {country.economy.sectors.industry}</Text>
                <Text style={styles.infoValue}>Services: {country.economy.sectors.services}</Text>
                <Text style={styles.infoValue}>Agriculture: {country.economy.sectors.agriculture}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Major Industries</Text>
                <Text style={styles.infoValue}>{country.economy.major_industries}</Text>
              </View>
            </View>
          </View>
        );
      case 'climate':
        return (
          <View style={styles.tabContent}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Climate Type</Text>
                <Text style={styles.infoValue}>{country.climate.type}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Average Temperature</Text>
                <Text style={styles.infoValue}>{country.climate.average_temp}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Annual Rainfall</Text>
                <Text style={styles.infoValue}>{country.climate.rainfall}</Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const handleMapError = () => {
    setMapError(true);
  };

  return (
    <LinearGradient colors={countryColor} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Button
            icon={<Ionicons name="arrow-back" size={24} color={countryColor[1]} />}
            title="Back to Countries"
            type="clear"
            titleStyle={{...styles.backButtonText, color: countryColor[1]}}
            onPress={() => navigation.goBack()}
          />
        </View>
  
        <View style={styles.mainContent}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.flagContainer}>
                {!flagLoaded && !flagLoadError && (
                  <ActivityIndicator size="small" color="#0000ff" />
                )}
                {flagLoadError ? (
                  <Text style={styles.flagFallback}>{getFlagEmoji(country.flag_code)}</Text>
                ) : (
                  <Image
                    source={{ uri: getFlagUrl(country.flag_code) }}
                    style={styles.flagImage}
                    onLoad={handleFlagLoad}
                    onError={(error) => handleFlagLoadError(error)}
                  />
                )}
              </View>
              <Text style={styles.countryName}>{country.name}</Text>
            </View>
            <View style={styles.tabsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['overview', 'geography', 'economy', 'climate'].map((tab) => (
                  <TouchableOpacity
                    key={tab}
                    style={[styles.tab, activeTab === tab && styles.activeTab]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            {renderTabContent()}
          </View>
  
          <View style={styles.mapCard}>
            <Text style={styles.cardTitle}>Map</Text>
            <CountryMap country={country.name} />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Notable Facts</Text>
            {country.notable_facts.map((fact: string, index: number) => (
              <Text key={index} style={styles.factText}>• {fact}</Text>
            ))}
          </View>
  
          <View style={styles.buttonContainer}>
            <Button
              icon={<Ionicons name="airplane" size={24} color={countryColor[0]} />}
              title="Pre-Arrival Information"
              buttonStyle={[styles.infoButton, { backgroundColor: countryColor[1] }]}
              titleStyle={[styles.infoButtonText, { color: countryColor[0] }]}
              onPress={() => navigation.navigate('PreArrivalInfo', { country: country.name })}
            />
            <Button
              icon={<Ionicons name="information-circle" size={24} color={countryColor[0]} />}
              title="Post-Arrival Information"
              buttonStyle={[styles.infoButton, { backgroundColor: countryColor[1] }]}
              titleStyle={[styles.infoButtonText, { color: countryColor[0] }]}
              onPress={() => navigation.navigate('PostArrivalInfo', { country: country.name })}
            />
            <Button
              icon={<Ionicons name="briefcase" size={24} color={countryColor[0]} />}
              title="Listed Jobs"
              buttonStyle={[styles.infoButton, { backgroundColor: countryColor[1] }]}
              titleStyle={[styles.infoButtonText, { color: countryColor[0] }]}
              onPress={() => navigation.navigate('ListedJobsInfo', { country: country.name })}
            />
            <Button
              icon={<Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={countryColor[0]} />}
              title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              buttonStyle={[styles.favoriteButton, { backgroundColor: countryColor[1] }]}
              titleStyle={[styles.favoriteButtonText, { color: countryColor[0] }]}
              onPress={toggleFavorite}
            />
          </View>
          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Start Your Journey to {country.name}?</Text>
            <Text style={styles.ctaDescription}>
              Explore our comprehensive guides and resources to make your transition smooth and successful.
            </Text>
          </View>
        </View>

        
      </ScrollView>
  
      <View style={styles.footer}>
        <Text style={styles.footerText}>&copy; 2024 EuroGO. All rights reserved.</Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.footerLink}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  debugInfo: {    
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    margin: 10,
        borderRadius: 5,
  },
  scrollContent: {
    padding: 16,
  },
  listItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 20,
    marginVertical: 5,
    borderRadius: 10,
  },

  flagContainer: {
    width: 80,
    height: 60,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    overflow: 'hidden',
  },
  flagImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  flagFallback: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  mapErrorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  mapErrorText: {
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  logo: {
    width: 120,
    height: 40,
  },
  backButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  mainContent: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  countryName: {
    fontSize: 24,
    alignItems: 'center',
    fontWeight: 'bold',
    color: '#000000',
  },
  tabsContainer: {
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#000000',
  },
  tabContent: {
    marginTop: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#000000',
    opacity: 0.8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
  },
  mapCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  mapImage: {
    width: '100%',
    height: 200,
borderRadius: 8,
  },
  factText: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 8,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  infoButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  infoButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  favoriteButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  ctaSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
  },
  footerLinkText: {
    color: '#FFFFFF',
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },

  footerLink: {
    color: '#FFFFFF',
    marginHorizontal: 8,
  },
});

export default CountryInfoScreen;
