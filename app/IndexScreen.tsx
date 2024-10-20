import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Import the RootStackParamList from App.tsx or create a separate types file
type RootStackParamList = {
  Onboarding: undefined;
  ClerkAuth: undefined;
  Auth: undefined;
  Main: undefined;
  CountryInfo: { country: string };
  Profile: undefined;
  PreArrivalInfo: { country: string };
  PostArrivalInfo: { country: string };
  ListedJobsInfo: { country: string };
  CompanyJobPost: undefined;
};

type IndexScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const IndexScreen: React.FC = () => {
  const navigation = useNavigation<IndexScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is the index page</Text>
      <View>
        <TouchableOpacity onPress={() => navigation.navigate('ClerkAuth')}>
          <Text style={styles.link}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ClerkAuth')}>
          <Text style={styles.link}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Text style={styles.link}>Contact</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Text style={styles.link}>Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    fontSize: 18,
    color: 'blue',
    marginVertical: 10,
  },
});

export default IndexScreen;
