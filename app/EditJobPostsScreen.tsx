import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { supabase } from '../utils/supabase';

type RootStackParamList = {
  EditJobPost: { jobId: number };
  UserJobPosts: undefined;
};

type EditJobPostsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditJobPost'>;
type EditJobPostsScreenRouteProp = RouteProp<RootStackParamList, 'EditJobPost'>;

type EditJobPostsScreenProps = {
  navigation: EditJobPostsScreenNavigationProp;
  route: EditJobPostsScreenRouteProp;
};

type JobPost = {
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

const EditJobPostsScreen: React.FC<EditJobPostsScreenProps> = ({ navigation, route }) => {
  const [jobPost, setJobPost] = useState<JobPost | null>(null);
  

  useEffect(() => {
    fetchJobPost();
  }, []);

  const fetchJobPost = async () => {
    const { jobId } = route.params;
    const { data, error } = await supabase
      .from('job_listings')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      console.error('Error fetching job listing:', error);
      Alert.alert('Error', `Failed to fetch job listing: ${error.message}`);
    } else {
      setJobPost(data);
    }
  };

  const handleSave = async () => {
    if (jobPost) {
      const { data, error } = await supabase
        .from('job_listings')
        .update(jobPost)
        .eq('id', jobPost.id);

      if (error) {
        console.error('Error updating job listing:', error);
        Alert.alert('Error', `Failed to update job listing: ${error.message}`);
      } else {
        Alert.alert('Success', 'Job listing updated successfully');
        navigation.navigate('UserJobPosts');
      }
    }
  };

  const handleDelete = async () => {
    if (jobPost) {
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
                .eq('id', jobPost.id);

              if (error) {
                console.error('Error deleting job listing:', error);
                Alert.alert('Error', `Failed to delete job listing: ${error.message}`);
              } else {
                Alert.alert('Success', 'Job listing deleted successfully');
                navigation.navigate('UserJobPosts');
              }
            }
          }
        ]
      );
    }
  };

  if (!jobPost) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Job Listing</Text>
      
      <Input
        label="Job Title"
        value={jobPost.job_title}
        onChangeText={(text) => setJobPost({...jobPost, job_title: text})}
      />
      <Input
        label="Company Name"
        value={jobPost.company_name}
        onChangeText={(text) => setJobPost({...jobPost, company_name: text})}
      />
      <Input
        label="City"
        value={jobPost.city}
        onChangeText={(text) => setJobPost({...jobPost, city: text})}
      />
      <Input
        label="Country"
        value={jobPost.country}
        onChangeText={(text) => setJobPost({...jobPost, country: text})}
      />
      <Input
        label="Job Type"
        value={jobPost.job_type}
        onChangeText={(text) => setJobPost({...jobPost, job_type: text})}
      />
      <Input
        label="Salary Min"
        value={jobPost.salary_min}
        onChangeText={(text) => setJobPost({...jobPost, salary_min: text})}
        keyboardType="numeric"
      />
      <Input
        label="Salary Max"
        value={jobPost.salary_max}
        onChangeText={(text) => setJobPost({...jobPost, salary_max: text})}
        keyboardType="numeric"
      />
      <Input
        label="Salary Currency"
        value={jobPost.salary_currency}
        onChangeText={(text) => setJobPost({...jobPost, salary_currency: text})}
      />
      <Input
        label="Job Description"
        value={jobPost.job_description}
        onChangeText={(text) => setJobPost({...jobPost, job_description: text})}
        multiline
      />
      <Input
        label="Requirements"
        value={jobPost.requirements}
        onChangeText={(text) => setJobPost({...jobPost, requirements: text})}
        multiline
      />
      <Input
        label="Benefits"
        value={jobPost.benefits}
        onChangeText={(text) => setJobPost({...jobPost, benefits: text})}
        multiline
      />
      <Input
        label="Application Deadline"
        value={jobPost.application_deadline}
        onChangeText={(text) => setJobPost({...jobPost, application_deadline: text})}
      />
      <Input
        label="Contact Email"
        value={jobPost.contact_email}
        onChangeText={(text) => setJobPost({...jobPost, contact_email: text})}
        keyboardType="email-address"
      />
      <Input
        label="Contact Phone"
        value={jobPost.contact_phone}
        onChangeText={(text) => setJobPost({...jobPost, contact_phone: text})}
        keyboardType="phone-pad"
      />

      <Button
        title="Save Changes"
        onPress={handleSave}
        containerStyle={styles.buttonContainer}
      />
      <Button
        title="Delete Job Listing"
        onPress={handleDelete}
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.deleteButton}
      />
      <Button
        title="Cancel"
        onPress={() => navigation.goBack()}
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
  deleteButton: {
    backgroundColor: '#e74c3c',
  },
});

export default EditJobPostsScreen;
