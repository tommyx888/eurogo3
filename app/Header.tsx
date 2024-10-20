import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from './UserContext';
import { supabase } from '../utils/supabase';

const Header: React.FC = () => {
  const { userName, userCountry } = useUser();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    
    
    <View style={styles.header}>
      
      
    
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{userName || 'Guest'}</Text>
        <Text style={styles.userCountry}>{userCountry || 'Unknown'}</Text>
      </View>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
      
    </View>
    
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white', // Light gray background
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  container: {
    flex: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  userCountry: {
    fontSize: 14,
    color: '#666',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 170,
    height: 70,
  },
  signOutButton: {
    flex: 1,
    alignItems: 'flex-end',
  },
  signOutText: {
    fontSize: 16,
    color: '#007AFF',
  },
});

export default Header;
