import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image, Alert, RefreshControl, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { createClient } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabase';
import * as MailComposer from 'expo-mail-composer';

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
  created_at: string; // Added this field
};

const ListedJobsScreen: React.FC<ListedJobsScreenProps> = ({ navigation, route }) => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // New state variables for filters
  const [positionFilter, setPositionFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [minSalaryFilter, setMinSalaryFilter] = useState('');

  const fetchJobs = useCallback(async () => {
    try {
      let query = supabase
        .from('job_listings')
        .select('*') // This will include the 'created_at' field
        .eq('country', route.params.country);

      // Apply filters
      if (positionFilter) query = query.ilike('job_title', `%${positionFilter}%`);
      if (companyFilter) query = query.ilike('company_name', `%${companyFilter}%`);
      if (cityFilter) query = query.ilike('city', `%${cityFilter}%`);
      if (jobTypeFilter) query = query.eq('job_type', jobTypeFilter);
      if (minSalaryFilter) query = query.gte('salary_min', minSalaryFilter);

      const { data, error } = await query;

      if (error) throw error;

      setJobs(data || []);
    } catch (error: any) {
      Alert.alert('Error', 'Error fetching jobs: ' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [route.params.country, positionFilter, companyFilter, cityFilter, jobTypeFilter, minSalaryFilter]);

  const fetchUserEmail = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    } catch (error) {
      console.error('Error fetching user email:', error);
      setUserEmail(null);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchJobs();
    await fetchUserEmail();
  }, [fetchJobs, fetchUserEmail]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      onRefresh();
    }, [onRefresh])
  );

  const handleApply = async (job: JobListing) => {
    if (!userEmail) {
      Alert.alert('Error', 'You must be logged in to apply for jobs.');
      return;
    }

    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'Mail composer is not available on this device.');
      return;
    }

    const mailOptions = {
      recipients: [job.contact_email],
      subject: `Application for ${job.job_title} position`,
      body: `Dear Hiring Manager,

I am writing to express my interest in the ${job.job_title} position at ${job.company_name}. I found this job listing on the EuroGo app and I am excited about the opportunity to join your team.

Please find my resume and other relevant documents attached to this email.

Thank you for your consideration. I look forward to hearing from you.

Best regards,
[Your Name]`,
    };

    try {
      await MailComposer.composeAsync(mailOptions);
    } catch (error) {
      console.error('Error opening mail composer:', error);
      Alert.alert('Error', 'Failed to open mail composer. Please try again.');
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
        <View style={styles.detailItem}>
          <Ionicons name="time" size={16} color="white" />
          <Text style={styles.detailText}>{`Posted: ${new Date(item.created_at).toLocaleString()}`}</Text>
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
      <TouchableOpacity style={styles.applyButton} onPress={() => handleApply(item)}>
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
        
        {/* Filter inputs */}
        <View style={styles.filterContainer}>
          <TextInput
            style={styles.filterInput}
            placeholder="Position"
            value={positionFilter}
            onChangeText={setPositionFilter}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Company"
            value={companyFilter}
            onChangeText={setCompanyFilter}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="City"
            value={cityFilter}
            onChangeText={setCityFilter}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Job Type"
            value={jobTypeFilter}
            onChangeText={setJobTypeFilter}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Min Salary"
            value={minSalaryFilter}
            onChangeText={setMinSalaryFilter}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.searchButton} onPress={fetchJobs}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {jobs.length > 0 ? (
          <FlatList
            data={jobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.jobList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#003399']}
                tintColor={'#003399'}
              />
            }
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
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 16,
  },
  filterInput: {
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    width: '48%',
  },
  searchButton: {
    backgroundColor: '#FFD700',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
    width: '100%',
  },
  searchButtonText: {
    color: '#003399',
    fontSize: 16,
    fontWeight: 'bold',
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
