import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Onboarding: undefined;
  Signin: undefined;
  Signup: undefined;
};

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

type OnboardingScreenProps = {
  navigation: OnboardingScreenNavigationProp;
};

const features = [
  { icon: 'map', title: 'Visa Information', description: 'Comprehensive guide on visa requirements for each EU country.' },
  { icon: 'briefcase', title: 'Work Permits', description: 'Step-by-step process for obtaining work permits in the EU.' },
  { icon: 'home', title: 'Housing', description: 'Find the perfect place to live with our housing resources.' },
  { icon: 'people', title: 'Culture', description: 'Immerse yourself in European cultures and traditions.' },
];

const flagUrls = {
  fr: require('../assets/flags/fr.png'),
  de: require('../assets/flags/de.png'),
  es: require('../assets/flags/es.png'),
  it: require('../assets/flags/it.png'),
  
  sk: require('../assets/flags/sk.png'),
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  return (
    <LinearGradient colors={['#E6F3FF', '#FFFFFF']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
             source={require('../assets/eurogo1_processed.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.headerButtons}>
            <Button
              title="Sign In"
              type="clear"
              titleStyle={styles.loginButtonText}
              onPress={() => navigation.navigate('Signin')}
            />
            <Button
              title="Sign Up"
              buttonStyle={styles.signUpButton}
              titleStyle={styles.signUpButtonText}
              onPress={() => navigation.navigate('Signup')}
            />
          </View>
        </View>

        <View style={styles.mainContent}>
          <Text style={styles.title}>Your Gateway to Working in Europe</Text>
          <Text style={styles.subtitle}>Discover opportunities, navigate regulations, and start your European career journey with ease.</Text>
          
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name={feature.icon as any} size={24} color="#003399" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>

          <View style={styles.exploreSection}>
            <View style={styles.exploreSectionText}>
              <Text style={styles.exploreSectionTitle}>Explore European Countries</Text>
              <Text style={styles.exploreSectionDescription}>
                Discover the unique opportunities each EU country has to offer. From vibrant cities to picturesque countryside, find your perfect work destination.
              </Text>
               
              
              
              </View>
          <View style={styles.flagsContainer}>
            {Object.entries(flagUrls).map(([code, source]) => (
              <Image
                key={code}
                source={source}
                style={styles.flagImage}
              />
              ))}
            </View>
          </View>

          <View style={styles.ctaSection}>
            <Text style={styles.ctaTitle}>Ready to Start Your European Journey?</Text>
            <Text style={styles.ctaDescription}>
              Join thousands of professionals who have successfully navigated their way to rewarding careers in Europe.
            </Text>
            <Button
              title="Get Started Now"
              buttonStyle={styles.getStartedButton}
              titleStyle={styles.getStartedButtonText}
              onPress={() => navigation.navigate('Signin')}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>&copy; 2024 EuroGO. All rights reserved.</Text>
        <View style={styles.footerLinks}>
          <Text style={styles.footerLink}>Privacy Policy</Text>
          <Text style={styles.footerLink}>Terms of Service</Text>
          <Text style={styles.footerLink}>Contact Us</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
 flagsContainer: {
    flex: 1,
    
    flexWrap: 'wrap',
    
  },
  flagImage: {
    width: '40%',
    height: undefined,
    aspectRatio: 1.5,
    marginLeft: 14,
    marginBottom: 8,
    borderRadius: 4,
  },

  logoContainer: {
        
        borderRadius: 5,
        padding: 5,
        
       
      },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  loginButtonText: {
    color: '#003399',
  },
  signUpButton: {
    backgroundColor: '#003399',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  signUpButtonText: {
    color: '#FFFFFF',
  },
  mainContent: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003399',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconContainer: {
    backgroundColor: '#E6F3FF',
    borderRadius: 20,
    padding: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003399',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#333333',
  },
  exploreSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  exploreSectionText: {
    flex: 3,
    marginRight:10,
  },
  exploreSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003399',
    marginBottom: 12,
  },
  exploreSectionDescription: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 16,
  },
  viewCountriesButton: {
    backgroundColor: '#003399',
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  viewCountriesButtonText: {
    color: '#FFFFFF',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  
  ctaSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003399',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#333333',
    textAlign: 'center',
    marginBottom: 24,
  },
  getStartedButton: {
    backgroundColor: '#003399',
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  getStartedButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#003399',
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
  footerLink: {
    color: '#FFFFFF',
    marginHorizontal: 8,
  },
});

export default OnboardingScreen;
