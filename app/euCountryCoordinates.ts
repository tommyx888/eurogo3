interface CountryCoordinate {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }
  
  interface EUCountryCoordinates {
    [key: string]: CountryCoordinate;
  }
  
  const euCountryCoordinates: EUCountryCoordinates = {
    'Austria': { latitude: 47.5162, longitude: 14.5501, latitudeDelta: 7, longitudeDelta: 12 },
    'Belgium': { latitude: 50.5039, longitude: 4.4699, latitudeDelta: 3, longitudeDelta: 5 },
    'Bulgaria': { latitude: 42.7339, longitude: 25.4858, latitudeDelta: 5, longitudeDelta: 9 },
    'Croatia': { latitude: 45.1000, longitude: 15.2000, latitudeDelta: 5, longitudeDelta: 9 },
    'Cyprus': { latitude: 35.1264, longitude: 33.4299, latitudeDelta: 2, longitudeDelta: 3 },
    'Czech Republic': { latitude: 49.8175, longitude: 15.4730, latitudeDelta: 4, longitudeDelta: 7 },
    'Denmark': { latitude: 56.2639, longitude: 9.5018, latitudeDelta: 5, longitudeDelta: 9 },
    'Estonia': { latitude: 58.5953, longitude: 25.0136, latitudeDelta: 3, longitudeDelta: 7 },
    'Finland': { latitude: 61.9241, longitude: 25.7482, latitudeDelta: 10, longitudeDelta: 15 },
    'France': { latitude: 46.2276, longitude: 2.2137, latitudeDelta: 10, longitudeDelta: 10 },
    'Germany': { latitude: 51.1657, longitude: 10.4515, latitudeDelta: 8, longitudeDelta: 10 },
    'Greece': { latitude: 39.0742, longitude: 21.8243, latitudeDelta: 8, longitudeDelta: 10 },
    'Hungary': { latitude: 47.1625, longitude: 19.5033, latitudeDelta: 4, longitudeDelta: 7 },
    'Ireland': { latitude: 53.1424, longitude: -7.6921, latitudeDelta: 5, longitudeDelta: 7 },
    'Italy': { latitude: 41.8719, longitude: 12.5674, latitudeDelta: 10, longitudeDelta: 12 },
    'Latvia': { latitude: 56.8796, longitude: 24.6032, latitudeDelta: 3, longitudeDelta: 7 },
    'Lithuania': { latitude: 55.1694, longitude: 23.8813, latitudeDelta: 3, longitudeDelta: 7 },
    'Luxembourg': { latitude: 49.8153, longitude: 6.1296, latitudeDelta: 1, longitudeDelta: 1 },
    'Malta': { latitude: 35.9375, longitude: 14.3754, latitudeDelta: 0.3, longitudeDelta: 0.5 },
    'Netherlands': { latitude: 52.1326, longitude: 5.2913, latitudeDelta: 3, longitudeDelta: 5 },
    'Poland': { latitude: 51.9194, longitude: 19.1451, latitudeDelta: 7, longitudeDelta: 14 },
    'Portugal': { latitude: 39.3999, longitude: -8.2245, latitudeDelta: 6, longitudeDelta: 6 },
    'Romania': { latitude: 45.9432, longitude: 24.9668, latitudeDelta: 6, longitudeDelta: 10 },
    'Slovakia': { latitude: 48.6690, longitude: 19.6990, latitudeDelta: 3, longitudeDelta: 6 },
    'Slovenia': { latitude: 46.1512, longitude: 14.9955, latitudeDelta: 2, longitudeDelta: 4 },
    'Spain': { latitude: 40.4637, longitude: -3.7492, latitudeDelta: 10, longitudeDelta: 10 },
    'Sweden': { latitude: 60.1282, longitude: 18.6435, latitudeDelta: 12, longitudeDelta: 10 }
  };
  
  export default euCountryCoordinates;