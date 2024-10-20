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
  PostArrivalInfo: { country: string };
};

type PostArrivalInfoScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PostArrivalInfo'>;
type PostArrivalInfoScreenRouteProp = RouteProp<RootStackParamList, 'PostArrivalInfo'>;

type PostArrivalInfoScreenProps = {
  navigation: PostArrivalInfoScreenNavigationProp;
  route: PostArrivalInfoScreenRouteProp;
};

type PostArrivalInfo = {
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
    const lines = content.split('\n');
    let html = '';
    let listLevel = 0;

    lines.forEach(line => {
      line = line.trim();
      line = line.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');
      if (line.match(/^\d+\./)) {
        html += `<p><strong>${line}</strong></p>`;
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
              p: styles.paragraph,
              ul: styles.unorderedList,
              li: styles.listItem,
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

const PostArrivalInfoScreen: React.FC<PostArrivalInfoScreenProps> = ({ navigation, route }) => {
  const [postArrivalInfo, setPostArrivalInfo] = useState<PostArrivalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<number[]>([]);

  const countryColor = countryColors[route.params.country] || ['#003399', '#FFFFFF', '#FFD700'];

  useEffect(() => {
    fetchPostArrivalInfo();
  }, []);

  const fetchPostArrivalInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('local_registration, social_security_tax, bank_account, accommodation, healthcare_services, public_transportation, grocery_shopping, communication_services, language_courses, workers_rights, local_customs, waste_management, leisure_activities, child_care, mental_health, embassy_registration, local_id, utility_bills, postal_services, libraries_community, sports_facilities, local_media, professional_networks, homesickness_culture_shock, workplace_dynamics, business_etiquette, legal_aid, places_of_worship, local_cuisine, volunteer_opportunities')
        .eq('name', route.params.country)
        .single();

      if (error) throw error;

      if (data) {
        console.log('Fetched data:', JSON.stringify(data, null, 2));
        const postArrivalData: PostArrivalInfo[] = [
          { id: 1, title: "Local registration procedures", content: data.local_registration || "N/A", icon: "document-text" },
          { id: 2, title: "Social security and tax registration", content: data.social_security_tax || "N/A", icon: "card" },
          { id: 3, title: "Opening a bank account", content: data.bank_account || "N/A", icon: "cash" },
          { id: 4, title: "Finding accommodation", content: data.accommodation || "N/A", icon: "home" },
          { id: 5, title: "Accessing healthcare services", content: data.healthcare_services || "N/A", icon: "medkit" },
          { id: 6, title: "Public transportation", content: data.public_transportation || "N/A", icon: "bus" },
          { id: 7, title: "Grocery shopping and local markets", content: data.grocery_shopping || "N/A", icon: "cart" },
          { id: 8, title: "Setting up communication services", content: data.communication_services || "N/A", icon: "call" },
          { id: 9, title: "Language courses and integration programs", content: data.language_courses || "N/A", icon: "language" },
          { id: 10, title: "Workers' rights and labor laws", content: data.workers_rights || "N/A", icon: "briefcase" },
          { id: 11, title: "Local customs and social norms", content: data.local_customs || "N/A", icon: "people" },
          { id: 12, title: "Waste management and recycling", content: data.waste_management || "N/A", icon: "trash" },
          { id: 13, title: "Leisure activities and social groups", content: data.leisure_activities || "N/A", icon: "happy" },
          { id: 14, title: "Child care options and schooling", content: data.child_care || "N/A", icon: "school" },
          { id: 15, title: "Mental health resources", content: data.mental_health || "N/A", icon: "heart" },
          { id: 16, title: "Registering with embassy or consulate", content: data.embassy_registration || "N/A", icon: "flag" },
          { id: 17, title: "Obtaining local ID or residence permit", content: data.local_id || "N/A", icon: "card" },
          { id: 18, title: "Understanding utility bills", content: data.utility_bills || "N/A", icon: "bulb" },
          { id: 19, title: "Using postal and delivery services", content: data.postal_services || "N/A", icon: "mail" },
          { id: 20, title: "Accessing libraries and community centers", content: data.libraries_community || "N/A", icon: "book" },
          { id: 21, title: "Finding sports facilities", content: data.sports_facilities || "N/A", icon: "fitness" },
          { id: 22, title: "Understanding local media", content: data.local_media || "N/A", icon: "newspaper" },
          { id: 23, title: "Joining professional networks", content: data.professional_networks || "N/A", icon: "people-circle" },
          { id: 24, title: "Dealing with homesickness and culture shock", content: data.homesickness_culture_shock || "N/A", icon: "sad" },
          { id: 25, title: "Managing cross-cultural workplace dynamics", content: data.workplace_dynamics || "N/A", icon: "git-network" },
          { id: 26, title: "Understanding local business etiquette", content: data.business_etiquette || "N/A", icon: "business" },
          { id: 27, title: "Accessing legal aid and advice", content: data.legal_aid || "N/A", icon: "shield" },
          { id: 28, title: "Finding places of worship", content: data.places_of_worship || "N/A", icon: "compass" },
          { id: 29, title: "Exploring local cuisine", content: data.local_cuisine || "N/A", icon: "restaurant" },
          { id: 30, title: "Volunteer opportunities", content: data.volunteer_opportunities || "N/A", icon: "hand-left" },
        
      ].map(item => {
        console.log(`Item ${item.id} - ${item.title}: ${typeof item.content}`);
        if (item.content === undefined) {
          console.warn(`Undefined content for item ${item.id} - ${item.title}`);
          return { ...item, content: "N/A" };
        }
        return item;
      });
      
      const filteredData = postArrivalData.filter(item => {
        if (item.content === "N/A") {
          console.log(`Filtering out item ${item.id} - ${item.title}`);
          return false;
        }
        return true;
      });
      
      console.log('Filtered data:', JSON.stringify(filteredData, null, 2));
      setPostArrivalInfo(filteredData);
    }
    setLoading(false);
  } catch (error: any) {
    console.error('Error fetching post-arrival info:', error);
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
        <Text style={styles.loadingText}>Loading post-arrival information...</Text>
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

        <Text style={{...styles.title, color: 'white'}}>Post-Arrival Information for {route.params.country}</Text>

        <View style={styles.card}>
          {postArrivalInfo.map((item) => (
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


export default PostArrivalInfoScreen;