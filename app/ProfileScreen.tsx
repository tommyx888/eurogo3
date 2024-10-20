import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabase';
import { useUser } from './UserContext';

type RootStackParamList = {
  Profile: undefined;
  Auth: undefined;
  CompanyJobPost: undefined;
  EditJobPosts: undefined;
  UserJobPosts: undefined;
  Main: undefined;
};

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { userName, userCountry, setUserName, setUserCountry } = useUser();
  const [name, setName] = useState(userName);
  const [country, setCountry] = useState(userCountry);
  const [hasJobListings, setHasJobListings] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    // ... (keep the existing fetchUserProfile logic)
  }, [supabase, setUserName, setUserCountry]);

  useEffect(() => {
    fetchUserProfile();
    checkJobListings();
  }, [fetchUserProfile]);

  const checkJobListings = async () => {
    // ... (keep the existing checkJobListings logic)
  };

  const handleSave = async () => {
    // ... (keep the existing handleSave logic)
  };

  return (
    <LinearGradient colors={['#003399', '#0066cc', '#0099ff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Profile</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Main')}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Back to Countries</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.card}>
          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name/organization"
            labelStyle={styles.inputLabel}
            inputStyle={styles.input}
          />

          <Input
            label="Home Country"
            value={country}
            onChangeText={setCountry}
            placeholder="Enter your home country"
            labelStyle={styles.inputLabel}
            inputStyle={styles.input}
          />

          <Button
            title="Save Profile"
            onPress={handleSave}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
          />

          <Button
            title="Post a Job"
            onPress={() => navigation.navigate('CompanyJobPost')}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.outlineButton}
            titleStyle={styles.outlineButtonText}
          />

          <Button
            title="View My Job Listings"
            onPress={() => navigation.navigate('UserJobPosts')}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.outlineButton}
            titleStyle={styles.outlineButtonText}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    marginLeft: 5,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 20,
  },
  inputLabel: {
    color: '#003399',
    fontWeight: 'bold',
  },
  input: {
    color: '#000000',
  },
  buttonContainer: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#003399',
    borderRadius: 25,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderColor: '#003399',
    borderWidth: 1,
    borderRadius: 25,
  },
  outlineButtonText: {
    color: '#003399',
  },
});

export default ProfileScreen;
