import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSupabaseClient } from '../utils/supabase';
import { useUser } from './UserContext';

type RootStackParamList = {
  Profile: undefined;
  Auth: undefined;
  CompanyJobPost: undefined;
  EditJobPosts: undefined;
  UserJobPosts: undefined;
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
  const supabase = useSupabaseClient();

  const fetchUserProfile = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, home_country')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({ id: user.id, email: user.email });

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          Alert.alert('Error', 'Failed to create user profile');
        } else {
          // Fetch the profile again
          const { data: newData, error: newError } = await supabase
            .from('profiles')
            .select('name, home_country')
            .eq('id', user.id)
            .single();

          if (newData) {
            setName(newData.name || '');
            setCountry(newData.home_country || '');
            setUserName(newData.name || '');
            setUserCountry(newData.home_country || '');
          }
        }
      } else if (data) {
        setName(data.name || '');
        setCountry(data.home_country || '');
        setUserName(data.name || '');
        setUserCountry(data.home_country || '');
      }
    }
  }, [supabase, setUserName, setUserCountry]);

  useEffect(() => {
    fetchUserProfile();
    checkJobListings();
  }, [fetchUserProfile]);

  const checkJobListings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('job_listings')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        console.error('Error checking job listings:', error);
        Alert.alert('Error', `Failed to check job listings: ${error.message}`);
      } else {
        setHasJobListings(Boolean(data && data.length > 0));
      }
    }
  };

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ name, home_country: country })
        .eq('id', user.id);

      if (!error) {
        console.log('Profile saved');
        setUserName(name);
        setUserCountry(country);
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        console.error('Error saving profile:', error);
        Alert.alert('Error', 'Failed to save profile');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Profile</Text>
      
      <Input
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter your name/organization"
      />

      <Input
        label="Home Country"
        value={country}
        onChangeText={setCountry}
        placeholder="Enter your home country"
      />

      <Button
        title="Save Profile"
        onPress={handleSave}
        containerStyle={styles.buttonContainer}
      />

      

      <Button
        title="Post a Job"
        onPress={() => navigation.navigate('CompanyJobPost')}
        containerStyle={styles.buttonContainer}
        type="outline"
      />

      <Button
        title="View My Job Listings"
        onPress={() => navigation.navigate('UserJobPosts')}
        containerStyle={styles.buttonContainer}
        type="outline"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
  },
});

export default ProfileScreen;
