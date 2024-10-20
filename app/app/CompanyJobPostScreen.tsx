import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { createClient } from '@supabase/supabase-js';
import { LinearGradient } from 'expo-linear-gradient';
import { useSupabaseClient } from '../utils/supabase';

// Initialize Supabase client
const supabaseUrl = 'https://rdxwgpksdklwndybmgvc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkeHdncGtzZGtsd25keWJtZ3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjgwNjg1MTAsImV4cCI6MjA0MzY0NDUxMH0.Orb_zAtH7p92OfCRY4czb6GPwfQ1reUvU1KauX-2RtU';
const supabase = createClient(supabaseUrl, supabaseKey);

type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  CountryInfo: { country: string };
  Profile: undefined;
  ListedJobs: { country: string };
  PreArrivalInfo: { country: string };
  PostArrivalInfo: { country: string };
  CompanyJobPost: undefined;
};



type CompanyJobPostScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CompanyJobPost'>;
type CompanyJobPostScreenRouteProp = RouteProp<RootStackParamList, 'CompanyJobPost'>;

type CompanyJobPostScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'CompanyJobPost'>;
  route: CompanyJobPostScreenRouteProp;
};

const CompanyJobPostScreen: React.FC<CompanyJobPostScreenProps> = ({ navigation }) => {
  const supabase = useSupabaseClient();
  const [country, setCountry] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [city, setCity] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const countries = [
    "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
    "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg",
    "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
    "Slovenia", "Spain", "Sweden"
  ];

  const parseSalary = (salary: string): number => {
       const parsed = parseFloat(salary);
        return isNaN(parsed) ? 0 : parsed;
     };
  
     const validateSalaryRange = (min: string, max: string): boolean => {
       const minSalary = parseSalary(min);
       const maxSalary = parseSalary(max);
       return maxSalary >= minSalary;
     };


  const handlePostJob = async () => {
    if (!country || !jobTitle || !city || !companyName || !jobType || !jobDescription || !email) {
      alert('Please fill in all required fields, including email');
      return;
    }
  
    if (salaryMin && salaryMax && !validateSalaryRange(salaryMin, salaryMax)) {
      alert('Maximum salary should not be less than minimum salary');
      return;
    }
  
    try {
      // Fetch the current user's ID
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!user) {
        alert('You must be logged in to post a job');
        return;
      }

      const { data, error } = await supabase
        .from('job_listings')
        .insert([
          {
            user_id: user.id, // Include the user_id in the job listing data
            country: country.charAt(0).toUpperCase() + country.slice(1),
            job_title: jobTitle,
            city,
            company_name: companyName,
            job_type: jobType,
            salary_min: salaryMin,
            salary_max: salaryMax,
            salary_currency: currency,
            job_description: jobDescription,
            requirements,
            benefits,
            application_deadline: applicationDeadline.toISOString(),
            contact_email: email,
            contact_phone: phoneNumber,
          },
        ]);
  
      if (error) throw error;
  
      alert('Job posted successfully!');
      navigation.navigate('Main');
    } catch (error: any) {
      alert('Error posting job: ' + error.message);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || applicationDeadline;
    setShowDatePicker(Platform.OS === 'ios');
    setApplicationDeadline(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  return (
    <LinearGradient colors={['#003399', '#FFD700']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate('Main')} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back to Main Screen</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title}>Post a Job Offer</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Job Details</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Job Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Senior Software Engineer"
                placeholderTextColor="#A0A0A0"
                value={jobTitle}
                onChangeText={setJobTitle}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Country</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={country}
                  onValueChange={(itemValue: string) => setCountry(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="Select a country" value="" />
                  {countries.map((c) => (
                    <Picker.Item key={c} label={c} value={c.toLowerCase()} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Paris"
                placeholderTextColor="#A0A0A0"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Company Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your company name"
                placeholderTextColor="#A0A0A0"
                value={companyName}
                onChangeText={setCompanyName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Job Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={jobType}
                  onValueChange={(itemValue: string) => setJobType(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  <Picker.Item label="Select job type" value="" />
                  <Picker.Item label="Full-time" value="full-time" />
                  <Picker.Item label="Part-time" value="part-time" />
                  <Picker.Item label="Contract" value="contract" />
                  <Picker.Item label="Internship" value="internship" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Salary Range</Text>
              <View style={styles.salaryContainer}>
                <TextInput
                  style={[styles.input, styles.salaryInput]}
                  placeholder="Min"
                  placeholderTextColor="#A0A0A0"
                  value={salaryMin}
                  onChangeText={setSalaryMin}
                  keyboardType="numeric"
                />
                <TextInput
                  style={[styles.input, styles.salaryInput]}
                  placeholder="Max"
                  placeholderTextColor="#A0A0A0"
                  value={salaryMax}
                  onChangeText={setSalaryMax}
                  keyboardType="numeric"
                />
                <View style={[styles.pickerContainer, styles.currencyPicker]}>
                  <Picker
                    selectedValue={currency}
                    onValueChange={(itemValue: string) => setCurrency(itemValue)}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="EUR" value="EUR" />
                    <Picker.Item label="USD" value="USD" />
                    <Picker.Item label="GBP" value="GBP" />
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Job Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe the job role, responsibilities, and requirements"
                placeholderTextColor="#A0A0A0"
                value={jobDescription}
                onChangeText={setJobDescription}
                multiline
                numberOfLines={6}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Requirements</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="List the key requirements for this position"
                placeholderTextColor="#A0A0A0"
                value={requirements}
                onChangeText={setRequirements}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Benefits</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="List the benefits offered with this position"
                placeholderTextColor="#A0A0A0"
                value={benefits}
                onChangeText={setBenefits}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Application Deadline</Text>
              <TouchableOpacity onPress={showDatepicker} style={styles.datePickerButton}>
                <Text style={styles.datePickerButtonText}>
                  {applicationDeadline.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={applicationDeadline}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contact Email (Required)</Text>
              <TextInput
                style={styles.input}
                placeholder="contact@company.com"
                placeholderTextColor="#A0A0A0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Contact Phone Number (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="+1234567890"
                placeholderTextColor="#A0A0A0"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handlePostJob}>
              <Text style={styles.submitButtonText}>Post Job Offer</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: 'white',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    padding: 10,
    color: 'white',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  picker: {
    color: 'white',
  },
  pickerItem: {
    color: 'black',
    backgroundColor: 'white',
  },
  salaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  salaryInput: {
    flex: 1,
    marginRight: 10,
  },
  currencyPicker: {
    width: 100,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    padding: 10,
  },
  datePickerButtonText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#FFD700',
    borderRadius: 4,
    padding: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#003399',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CompanyJobPostScreen;
