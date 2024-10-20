import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  CompanyJobPost: undefined;
};

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

type Props = {
  navigation: AuthScreenNavigationProp;
};

const AuthScreen: React.FC<Props> = ({ navigation }) => {
  const handleUserTypeSelection = (userType: 'jobseeker' | 'company') => {
    if (userType === 'jobseeker') {
      navigation.navigate('Main');
    } else {
      navigation.navigate('CompanyJobPost');
    }
  };

  return (
    <LinearGradient colors={['#003399', '#FFD700']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/eurogo1_processed.png')}
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Welcome to EuroGO</Text>
        
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleUserTypeSelection('jobseeker')}
          >
            <Text style={styles.optionButtonText}>I'm a Job Seeker</Text>
            <Text style={styles.optionDescription}>Looking for job opportunities in the EU</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => handleUserTypeSelection('company')}
          >
            <Text style={styles.optionButtonText}>I'm a Company</Text>
            <Text style={styles.optionDescription}>Hiring talent for my business in the EU</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logo: {
    width: 150,
    height: 75,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  optionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  optionDescription: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default AuthScreen;
