import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { supabase } from '../utils/supabase';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';



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

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    
    androidClientId: '509385600676-484m3h8ojb008595i1o84amterpgc2n1.apps.googleusercontent.com',
    responseType: 'id_token',
    scopes: ['profile', 'email']
   
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleSignInWithGoogle(id_token);
    }
  }, [response]);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) alert(error.message);
    setLoading(false);
  }

  
  async function handleSignInWithGoogle(idToken: string) {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) throw error;

      if (data?.user) {
        Alert.alert('Success', 'Signed in successfully!');
        // Navigate to your app's main screen or perform any other action
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', `Supabase sign-in failed: ${error.message}`);
      } else {
        Alert.alert('Error', 'An unknown error occurred during sign-in');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await promptAsync();
      if (result.type !== 'success') {
        throw new Error(`Google sign-in failed: ${result.type}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred during Google sign-in');
      }
    } finally {
      setLoading(false);
    }
  };

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

        <TouchableOpacity
          style={styles.googleButton}
          onPress={() => promptAsync()}
          disabled={loading}
        >
          <Image
            source={require('../assets/google-signin-button.png')}
            style={styles.googleButtonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
       
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
  googleButton: {
    width: 300,
    height: 65,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleButtonImage: {
    width: '100%',
    height: '100%',
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
  
  linkButton: {
    marginTop: 15,
  },
  linkText: {
    color: '#003399',
    textDecorationLine: 'underline',
  },
});
