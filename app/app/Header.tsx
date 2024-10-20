import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useSupabaseClient } from '../utils/supabase';
import { useUser } from './UserContext';

const Header: React.FC = () => {
  const { userName, userCountry } = useUser();
  const supabase = useSupabaseClient();

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
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userCountry: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
});

export default Header;
