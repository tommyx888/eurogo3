import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Image, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSupabaseClient } from '../utils/supabase';

type RootStackParamList = {
  UserJobPosts: undefined;
  Profile: undefined;
  EditJobPost: { jobId: number };
};

type UserJobPostsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserJobPosts'>;

type UserJobPostsScreenProps = {
  navigation: UserJobPostsScreenNavigationProp;
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

const UserJobPostsScreen: React.FC<UserJobPostsScreenProps> = ({ navigation }) => {
  const [jobPosts, setJobPosts] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useSupabaseClient();

  useEffect(() => {
    fetchUserJobPosts();
  }, []);

  const fetchUserJobPosts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching job listings:', error);
        alert('Error fetching job listings: ' + error.message);
      } else {
        setJobPosts(data || []);
      }
      setLoading(false);
    }
  };

  const handleEdit = (jobId: number) => {
    navigation.navigate('EditJobPost', { jobId });
  };

  const handleDelete = async (jobId: number) => {
    Alert.alert(
      "Delete Job Post",
      "Are you sure you want to delete this job post?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            const { error } = await supabase
              .from('job_listings')
              .delete()
              .eq('id', jobId);

            if (error) {
              console.error('Error deleting job post:', error);
              alert('Error deleting job post: ' + error.message);
            } else {
              setJobPosts(jobPosts.filter(post => post.id !== jobId));
              alert('Job post deleted successfully');
            }
          }
        }
      ]
    );
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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item.id)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading your job listings...</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to Profile</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Your Job Listings</Text>
        {jobPosts.length > 0 ? (
          <FlatList
            data={jobPosts}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.jobList}
          />
        ) : (
          <Text style={styles.noJobsText}>You haven't posted any jobs yet.</Text>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default UserJobPostsScreen;
