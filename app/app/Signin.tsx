import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from '../utils/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

type RootStackParamList = {
  Signin: undefined;
  Signup: undefined;
  // Add other screen names and their param types here
};

type SigninScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Signin'>;

export default function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<SigninScreenNavigationProp>();

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: '509385600676-484m3h8ojb008595i1o84amterpgc2n1.apps.googleusercontent.com', // Replace with your actual client ID
    });
  }, []);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) alert(error.message);
    setLoading(false);
  }

  async function signInWithGoogle() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      // Type assertion to help TypeScript understand the structure
      const idToken = (userInfo as any).idToken;
      
      if (idToken) {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: idToken,
        });
        if (error) {
          console.error('Error signing in with Google:', error);
        } else {
          console.log('Successfully signed in with Google:', data);
        }
      } else {
        throw new Error('No ID token present!');
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Sign in cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.error('Some other error happened:', error);
      }
    }
  }

  return (
    <LinearGradient colors={['#E6F3FF', '#FFFFFF']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Image
          source={require('../assets/eurogo1_processed.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.header}>Sign In</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="Email"
            placeholderTextColor="#A0A0A0"
            autoCapitalize={'none'}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor="#A0A0A0"
            autoCapitalize={'none'}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => signInWithEmail()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Loading...' : 'Sign in'}
          </Text>
        </TouchableOpacity>
        <GoogleSigninButton
          style={styles.googleButton}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signInWithGoogle}
        />
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  header: {
    fontWeight: 'bold',
    color: '#003399',
    fontSize: 24,
    marginBottom: 20,
  },
  inputContainer: {
    width: 300,
    backgroundColor: '#003399',
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 65,
    padding: 10,
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#003399',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  googleButton: {
    width: 300,
    height: 65,
    marginTop: 10,
  },
  linkButton: {
    marginTop: 15,
  },
  linkText: {
    color: '#003399',
    textDecorationLine: 'underline',
  },
});
