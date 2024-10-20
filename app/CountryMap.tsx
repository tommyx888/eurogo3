import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import euCountryCoordinates from './euCountryCoordinates';

interface CountryMapProps {
  country: string;
}

const CountryMap: React.FC<CountryMapProps> = ({ country }) => {
  const coordinates = euCountryCoordinates[country];

  if (!coordinates) {
    return <View style={styles.container}><Text>Map not available</Text></View>;
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
          latitudeDelta: coordinates.latitudeDelta,
          longitudeDelta: coordinates.longitudeDelta,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default CountryMap;