import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, GestureResponderEvent } from 'react-native';
import { Button } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../utils/supabase';
import HTML, { HTMLSource } from 'react-native-render-html';

type RootStackParamList = {
  PreArrivalInfo: { country: string };
};

type PreArrivalInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PreArrivalInfo'>;
type PreArrivalInfoScreenRouteProp = RouteProp<RootStackParamList, 'PreArrivalInfo'>;

type PreArrivalInfoScreenProps = {
  navigation: PreArrivalInfoScreenNavigationProp;
  route: PreArrivalInfoScreenRouteProp;
};

type PreArrivalInfo = {
  id: number;
  title: string;
  content: string;
  icon: string;
};

type CountryColors = {
  [key: string]: string[];
};



class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Something went wrong.</Text>;
    }
    return this.props.children;
  }
}

class ItemErrorBoundary extends React.Component<{children: React.ReactNode, itemTitle: string}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode, itemTitle: string}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log(`Error in item "${this.props.itemTitle}":`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Text>Error loading this item. Please try again later.</Text>;
    }
    return this.props.children;
  }
}

const countryColors: CountryColors = {
  'Austria': ['#ED2939', '#FFFFFF', '#ED2939'],
  'Belgium': ['#000000', '#FFFF00', '#FF0000'],
  'Bulgaria': ['#FFFFFF', '#00966E', '#D62612'],
  'Croatia': ['#FF0000', '#FFFFFF', '#0093DD'],
  'Cyprus': ['#FFFFFF', '#D47600', '#006847'],
  'Czech Republic': ['#FFFFFF', '#D7141A', '#11457E'],
  'Denmark': ['#C60C30', '#FFFFFF', '#C60C30'],
  'Estonia': ['#0072CE', '#000000', '#FFFFFF'],
  'Finland': ['#FFFFFF', '#002F6C', '#FFFFFF'],
  'France': ['#002395', '#FFFFFF', '#ED2939'],
  'Germany': ['#000000', '#DD0000', '#FFCE00'],
  'Greece': ['#0D5EAF', '#FFFFFF', '#0D5EAF'],
  'Hungary': ['#CE2939', '#FFFFFF', '#477050'],
  'Ireland': ['#169B62', '#FFFFFF', '#FF883E'],
  'Italy': ['#008C45', '#F4F9FF', '#CD212A'],
  'Latvia': ['#9E3039', '#FFFFFF', '#9E3039'],
  'Lithuania': ['#FDB913', '#006A44', '#C1272D'],
  'Luxembourg': ['#ED2939', '#FFFFFF', '#00A1DE'],
  'Malta': ['#FFFFFF', '#CF142B', '#FFFFFF'],
  'Netherlands': ['#AE1C28', '#FFFFFF', '#21468B'],
  'Poland': ['#FFFFFF', '#DC143C', '#FFFFFF'],
  'Portugal': ['#006600', '#FF0000', '#FFC400'],
  'Romania': ['#002B7F', '#FCD116', '#CE1126'],
  'Slovakia': ['#FFFFFF', '#0B4EA2', '#EE1C25'],
  'Slovenia': ['#FFFFFF', '#005CE6', '#ED1C24'],
  'Spain': ['#AA151B', '#F1BF00', '#AA151B'],
  'Sweden': ['#006AA7', '#FECC00', '#006AA7'],
};


type AccordionItemProps = {
  item: {
    id: number;
    title: string;
    content: any;
    icon: string;
  };
  isOpen: boolean;
  onToggle: () => void;
  styles: any;
};

const AccordionItem: React.FC<AccordionItemProps> = ({ item, isOpen, onToggle, styles }) => {
  const processContent = (content: any): string => {
    if (typeof content === 'string') {
      return content;
    }
    if (Array.isArray(content)) {
      return content.map((item, index) => `<li>${processContent(item)}</li>`).join('');
    }
    if (typeof content === 'object') {
      let html = '<ul>';
      for (const [key, value] of Object.entries(content)) {
        html += `<li><strong>${key}:</strong> ${processContent(value)}</li>`;
      }
      html += '</ul>';
      return html;
    }
    return String(content);
  };

  const preprocessContent = (content: string): string => {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');
    
    let html = '';
    let listLevel = 0;

    lines.forEach(line => {
      line = line.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
      if (line.match(/^\d+\./)) {
        html += `<p><strong>${line}</strong></p>`;
      } else if (line.endsWith(':')) {
        html += `<p style="text-decoration: underline; fontSize: 26;">${line}</p>`;
      } else if (line.startsWith('- ')) {
        if (listLevel === 0) {
          html += '<ul>';
          listLevel++;
        }
        html += `<li>${line.slice(2)}</li>`;
      } else if (line.startsWith('  - ')) {
        if (listLevel === 1) {
          html += '<ul>';
          listLevel++;
        }
        html += `<li>${line.slice(4)}</li>`;
        
            
      } else {
        while (listLevel > 0) {
          html += '</ul>';
          listLevel--;
        }
        html += `<p>${line}</p>`;
      }
    });

    while (listLevel > 0) {
      html += '</ul>';
      listLevel--;
    }

    return html;
  };

  const processedContent = preprocessContent(processContent(item.content));

  const handleLinkPress = (event: GestureResponderEvent, href: string) => {
    Linking.openURL(href);
  };

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity onPress={onToggle} style={styles.accordionHeader}>
        <Ionicons name={item.icon as any} size={24} color="#000000" />
        <Text style={styles.accordionTitle}>{item.title}</Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#000000"
        />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.accordionContent}>
          <HTML
            source={{ html: processedContent }}
            contentWidth={300}
            tagsStyles={{
              p: {...styles.paragraph, marginBottom: 5},
              ul: {...styles.unorderedList, marginBottom: 5},
              li: {...styles.listItem, marginBottom: 2},
              strong: styles.strong,
              a: styles.link,
            }}
            renderersProps={{
              a: {
                onPress: handleLinkPress,
              },
            }}
          />
        </View>
      )}
    </View>
  );
};

const PreArrivalInfoScreen: React.FC<PreArrivalInfoScreenProps> = ({ navigation, route }) => {
  const [preArrivalInfo, setPreArrivalInfo] = useState<PreArrivalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<number[]>([]);

  const countryColor = countryColors[route.params.country] || ['#003399', '#FFFFFF', '#FFD700'];

  useEffect(() => {
    fetchPreArrivalInfo();
  }, []);

  const fetchPreArrivalInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('name', route.params.country)
        .single();

      if (error) throw error;

      if (data) {
        console.log('Fetched data:', JSON.stringify(data, null, 2));
        const preArrivalData: PreArrivalInfo[] = [
          { id: 1, title: "Visa Requirements", content: data.visa_requirements || "N/A", icon: "document-text" },
          { id: 2, title: "Work Permit", content: data.work_permit || "N/A", icon: "briefcase" },
          { id: 3, title: "Language Requirements", content: data.language_requirements || "N/A", icon: "language" },
          { id: 4, title: "Job Market Overview", content: data.job_market_overview || "N/A", icon: "bar-chart" },
          { id: 5, title: "Average Salaries", content: data.average_salaries || "N/A", icon: "cash" },
          { id: 6, title: "Cost of Living", content: data.cost_of_living || "N/A", icon: "pricetag" },
          { id: 7, title: "Healthcare System", content: data.healthcare_system || "N/A", icon: "medkit" },
          { id: 8, title: "Housing Options", content: data.housing_options || "N/A", icon: "home" },
          { id: 9, title: "Climate", content: data.climatedata || "N/A", icon: "thermometer" },
          { id: 10, title: "Cultural Norms", content: data.cultural_norms || "N/A", icon: "people" },
          { id: 11, title: "Laws and Regulations", content: data.laws_and_regulations || "N/A", icon: "book" },
          { id: 12, title: "Transportation", content: data.transportation || "N/A", icon: "bus" },
          { id: 13, title: "Banking and Currency", content: data.banking_and_currency || "N/A", icon: "card" },
          { id: 14, title: "Education System", content: data.education_system || "N/A", icon: "school" },
          { id: 15, title: "Emergency Services", content: data.emergency_services || "N/A", icon: "alert" },
          { id: 16, title: "Common Scams", content: data.common_scams || "N/A", icon: "warning" },
          { id: 17, title: "Political System", content: data.political_system || "N/A", icon: "flag" },
          { id: 18, title: "Religious Landscape", content: data.religious_landscape || "N/A", icon: "planet" },
          { id: 19, title: "Taxation for Expatriates", content: data.taxation_for_expatriates || "N/A", icon: "calculator" },
          { id: 20, title: "Social Security", content: data.social_security || "N/A", icon: "shield" },
          { id: 21, title: "Qualifications Recognition", content: data.qualifications_recognition || "N/A", icon: "ribbon" },
          { id: 22, title: "Driving Regulations", content: data.driving_regulations || "N/A", icon: "car" },
          { id: 23, title: "Mobile and Internet", content: data.mobile_and_internet || "N/A", icon: "wifi" },
          { id: 24, title: "Electrical Information", content: data.electrical_information || "N/A", icon: "flash" },
          { id: 25, title: "Time Zone", content: data.time_zone || "N/A", icon: "time" },
          { id: 26, title: "Public Holidays", content: data.public_holidays || "N/A", icon: "calendar" },
          { id: 27, title: "LGBT+ Rights", content: data.lgbt_rights || "N/A", icon: "color-palette" },
          { id: 28, title: "Gender Equality", content: data.gender_equality || "N/A", icon: "male-female" },
          { id: 29, title: "Customs Regulations", content: data.customs_regulations || "N/A", icon: "cube" },
          { id: 30, title: "Pet Relocation", content: data.pet_relocation || "N/A", icon: "paw" },
        
         ].map(item => {
          console.log(`Item ${item.id} - ${item.title}: ${typeof item.content}`);
          if (item.content === undefined) {
            console.warn(`Undefined content for item ${item.id} - ${item.title}`);
            return { ...item, content: "N/A" };
          }
          return item;
        });
        
        const filteredData = preArrivalData.filter(item => {
          if (item.content === "N/A") {
            console.log(`Filtering out item ${item.id} - ${item.title}`);
            return false;
          }
          return true;
        });
        
        console.log('Filtered data:', JSON.stringify(filteredData, null, 2));
        setPreArrivalInfo(filteredData);
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching pre-arrival info:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const toggleAccordionItem = (id: number) => {
    setOpenItems((prevOpenItems) =>
      prevOpenItems.includes(id)
        ? prevOpenItems.filter((itemId) => itemId !== id)
        : [...prevOpenItems, id]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading pre-arrival information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <LinearGradient colors={countryColor} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Image
              source={require('../assets/eurogo1_processed.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Button
              title="Back to Country"
              type="clear"
              titleStyle={{...styles.backButtonText, color: 'white'}}
              onPress={() => navigation.goBack()}
            />
          </View>

          <Text style={{...styles.title, color: 'white'}}>Pre-Arrival Information for {route.params.country}</Text>

          <View style={styles.card}>
            {preArrivalInfo.map((item) => (
              <AccordionItem
                key={item.id}
                item={item}
                isOpen={openItems.includes(item.id)}
                onToggle={() => toggleAccordionItem(item.id)}
                styles={styles}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>&copy; 2024 EuroGO. All rights reserved.</Text>
          <View style={styles.footerLinks}>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Contact Us</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ErrorBoundary>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  paragraph: {
    marginBottom: 10,
    fontSize: 16,
    lineHeight: 24,
  },
  unorderedList: {
    marginLeft: 20,
    marginBottom: 10,
  },
  listItem: {
    marginBottom: 5,
    fontSize: 16,
    lineHeight: 24,
  },
  strong: {
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 40,
  },
  backButtonText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  accordionItem: {
    marginBottom: 10,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
  },
  accordionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 10,
  },
  accordionContent: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  accordionContentText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    marginBottom: 10,
  
  },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
  },
  footerLink: {
    color: '#FFFFFF',
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    color: '#000000',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default PreArrivalInfoScreen;
