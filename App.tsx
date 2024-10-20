import React, { useState, useEffect } from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Session } from '@supabase/supabase-js';


import { UserProvider, useUser } from './app/UserContext';
import Header from './app/Header';
import IndexScreen from './app/IndexScreen';
import OnboardingScreen from './app/OnboardingScreen';
import MainScreen from './app/MainScreen';
import CountryInfoScreen from './app/CountryInfoScreen';
import ProfileScreen from './app/ProfileScreen';
import PreArrivalInfoScreen from './app/PreArrivalInfoScreen';
import PostArrivalInfoScreen from './app/PostArrivalInfoScreen';
import ListedJobsScreen from './app/ListedJobsScreen';
import CompanyJobPostScreen from './app/CompanyJobPostScreen';
import EditJobPostsScreen from './app/EditJobPostsScreen';
import UserJobPostsScreen from './app/UserJobPostsScreen';
import Signin from './app/Signin';
import Signup from './app/Signup';
import AuthScreen from './app/AuthScreen';
import { supabase,  } from './utils/supabase';

type RootStackParamList = {
  Index: undefined;
  Onboarding: undefined;
  AuthScreen: undefined;
  Signin: undefined;
  Signup: undefined;
  Main: undefined;
  CountryInfo: { country: string };
  Profile: undefined;
  PreArrivalInfo: { country: string };
  PostArrivalInfo: { country: string };
  ListedJobsInfo: { country: string };
  CompanyJobPost: undefined;
  EditJobPost: { jobId: number };
  UserJobPosts: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function AuthenticatedNavigation() {
  return (
    <>
      <Header />
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthScreen" component={AuthScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="CountryInfo" component={CountryInfoScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PreArrivalInfo" component={PreArrivalInfoScreen} />
        <Stack.Screen name="PostArrivalInfo" component={PostArrivalInfoScreen} />
        <Stack.Screen 
          name="ListedJobsInfo" 
          component={ListedJobsScreen as React.ComponentType<any>} 
        />
        <Stack.Screen name="CompanyJobPost" component={CompanyJobPostScreen} />
        <Stack.Screen name="EditJobPost" component={EditJobPostsScreen} />
        <Stack.Screen name="UserJobPosts" component={UserJobPostsScreen} />
      </Stack.Navigator>
    </>
  );
}

function UnauthenticatedNavigation() {
  return (
    <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      
      <Stack.Screen name="Index" component={IndexScreen} />
      <Stack.Screen name="Signin" component={Signin} />
      
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}

function AppContent() {
  const [session, setSession] = useState<Session | null>(null);
  const { setIsAuthenticated, setUserId, setUserName, setUserCountry } = useUser();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        fetchUserProfile(session.user.id);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
        setUserName('');
        setUserCountry('');
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
        fetchUserProfile(session.user.id);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
        setUserName('');
        setUserCountry('');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('name, home_country')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
    } else if (data) {
      setUserName(data.name || '');
      setUserCountry(data.home_country || '');
    }
  };

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        {session ? <AuthenticatedNavigation /> : <UnauthenticatedNavigation />}
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
