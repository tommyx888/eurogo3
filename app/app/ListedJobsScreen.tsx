import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Button } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { createClient } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Initialize Supabase client
const supabaseUrl = 'https://rdxwgpksdklwndybmgvc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkeHdncGtzZGtsd25keWJtZ3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwNjg1MTAsImV4cCI6MjA0MzY0NDUxMH0.Orb_zAtH7p92OfCRY4czb6GPwfQ1reUvU1KauX-2RtU';
const supabase = createClient(supabaseUrl, supabaseKey);

type RootStackParamList = {
  ListedJobs: { country: string };
  Main: undefined;
};

type ListedJobsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ListedJobs'>;
type ListedJobsScreenRouteProp = RouteProp<RootStackParamList, 'ListedJobs'>;

type ListedJobsScreenProps = {
  navigation: ListedJobsScreenNavigationProp;
  route: ListedJobsScreenRouteProp;
};

type JobListing = {
  id: number;
  job_title: string;
  company_name: string;
  city: string;
  country: string;
  job_type: string;
  salary_min: string;
  salary_max: string;
  salary_currency: string;
  job_description: string;
  requirements: string;
  benefits: string;
  application_deadline: string;
  contact_email: string;
  contact_phone: string;
};

const ListedJobsScreen: React.FC<ListedJobsScreenProps> = ({ navigation, route }) => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('country', route.params.country);

      if (error) throw error;

      setJobs(data || []);
      setLoading(false);
    } catch (error: any) {
      alert('Error fetching jobs: ' + error.message);
      setLoading(false);
    }
  };

  const renderJobItem = ({ item }: { item: JobListing }) => (
    <View style={styles.jobCard}>
      <View style={styles.jobHeader}>
        <View>
          <Text style={styles.jobTitle}>{item.job_title}</Text>
          <View style={styles.companyInfo}>
            <Ionicons name="business" size={16} color="white" />
            <Text style={styles.companyName}>{item.company_name}</Text>
          </View>
        </View>
        <View style={styles.jobTypeBadge}>
          <Text style={styles.jobTypeText}>{item.job_type}</Text>
        </View>
      </View>
      <View style={styles.jobDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="location" size={16} color="white" />
          <Text style={styles.detailText}>{`${item.city}, ${item.country}`}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash" size={16} color="white" />
          <Text style={styles.detailText}>{`${item.salary_currency} ${item.salary_min} - ${item.salary_max}`}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="calendar" size={16} color="white" />
          <Text style={styles.detailText}>{`Deadline: ${new Date(item.application_deadline).toLocaleDateString()}`}</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Job Description</Text>
      <Text style={styles.description}>{item.job_description}</Text>
      <Text style={styles.sectionTitle}>Requirements</Text>
      <Text style={styles.description}>{item.requirements}</Text>
      <Text style={styles.sectionTitle}>Benefits</Text>
      <Text style={styles.description}>{item.benefits}</Text>
      <Text style={styles.sectionTitle}>Contact Information</Text>
      <Text style={styles.description}>Email: {item.contact_email}</Text>
      {item.contact_phone && <Text style={styles.description}>Phone: {item.contact_phone}</Text>}
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Apply for this Job</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#003399', '#FFD700']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Image
            source={require('../assets/eurogo1_processed.png')}
            style={styles.logo}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Main</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Jobs in {route.params.country}</Text>
        {jobs.length > 0 ? (
          <FlatList
            data={jobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.jobList}
          />
        ) : (
          <Text style={styles.noJobsText}>No jobs found for this country.</Text>
        )}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginVertical: 16,
  },
  jobList: {
    padding: 16,
  },
  jobCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 16,
    color: 'white',
    marginLeft: 4,
  },
  jobTypeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  jobTypeText: {
    color: 'white',
    fontSize: 14,
  },
  jobDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    color: 'white',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 8,
  },
  description: {
    color: 'white',
    marginBottom: 8,
  },
  applyButton: {
    backgroundColor: '#FFD700',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  applyButtonText: {
    color: '#003399',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },
  noJobsText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ListedJobsScreen;