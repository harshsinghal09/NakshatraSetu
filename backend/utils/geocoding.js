// Geocoding Service
// Place name ko latitude/longitude mein convert karta hai
// Uses OpenStreetMap Nominatim (free, no API key needed)

const axios = require('axios');

// Hardcoded major Indian cities for offline fallback
const CITY_COORDINATES = {
  'mumbai': { lat: 19.0760, lng: 72.8777, timezone: 5.5 },
  'delhi': { lat: 28.6139, lng: 77.2090, timezone: 5.5 },
  'new delhi': { lat: 28.6139, lng: 77.2090, timezone: 5.5 },
  'bangalore': { lat: 12.9716, lng: 77.5946, timezone: 5.5 },
  'bengaluru': { lat: 12.9716, lng: 77.5946, timezone: 5.5 },
  'hyderabad': { lat: 17.3850, lng: 78.4867, timezone: 5.5 },
  'chennai': { lat: 13.0827, lng: 80.2707, timezone: 5.5 },
  'kolkata': { lat: 22.5726, lng: 88.3639, timezone: 5.5 },
  'pune': { lat: 18.5204, lng: 73.8567, timezone: 5.5 },
  'ahmedabad': { lat: 23.0225, lng: 72.5714, timezone: 5.5 },
  'jaipur': { lat: 26.9124, lng: 75.7873, timezone: 5.5 },
  'surat': { lat: 21.1702, lng: 72.8311, timezone: 5.5 },
  'lucknow': { lat: 26.8467, lng: 80.9462, timezone: 5.5 },
  'kanpur': { lat: 26.4499, lng: 80.3319, timezone: 5.5 },
  'nagpur': { lat: 21.1458, lng: 79.0882, timezone: 5.5 },
  'patna': { lat: 25.5941, lng: 85.1376, timezone: 5.5 },
  'indore': { lat: 22.7196, lng: 75.8577, timezone: 5.5 },
  'bhopal': { lat: 23.2599, lng: 77.4126, timezone: 5.5 },
  'visakhapatnam': { lat: 17.6868, lng: 83.2185, timezone: 5.5 },
  'vadodara': { lat: 22.3072, lng: 73.1812, timezone: 5.5 },
  'agra': { lat: 27.1767, lng: 78.0081, timezone: 5.5 },
  'varanasi': { lat: 25.3176, lng: 82.9739, timezone: 5.5 },
  'mathura': { lat: 27.4924, lng: 77.6737, timezone: 5.5 },
  'amritsar': { lat: 31.6340, lng: 74.8723, timezone: 5.5 },
  'chandigarh': { lat: 30.7333, lng: 76.7794, timezone: 5.5 },
  'coimbatore': { lat: 11.0168, lng: 76.9558, timezone: 5.5 },
  'kochi': { lat: 9.9312, lng: 76.2673, timezone: 5.5 },
  'thiruvananthapuram': { lat: 8.5241, lng: 76.9366, timezone: 5.5 },
  'bhubaneswar': { lat: 20.2961, lng: 85.8245, timezone: 5.5 },
  'guwahati': { lat: 26.1445, lng: 91.7362, timezone: 5.5 },
  'dehradun': { lat: 30.3165, lng: 78.0322, timezone: 5.5 },
  'ranchi': { lat: 23.3441, lng: 85.3096, timezone: 5.5 },
  'new york': { lat: 40.7128, lng: -74.0060, timezone: -5 },
  'london': { lat: 51.5074, lng: -0.1278, timezone: 0 },
  'dubai': { lat: 25.2048, lng: 55.2708, timezone: 4 },
  'singapore': { lat: 1.3521, lng: 103.8198, timezone: 8 },
  'toronto': { lat: 43.6532, lng: -79.3832, timezone: -5 },
  'sydney': { lat: -33.8688, lng: 151.2093, timezone: 10 }
};

async function geocodePlace(placeName) {
  const normalized = placeName.toLowerCase().trim();

  // Check hardcoded list first (fastest)
  for (const [city, coords] of Object.entries(CITY_COORDINATES)) {
    if (normalized.includes(city) || city.includes(normalized)) {
      return {
        latitude: coords.lat,
        longitude: coords.lng,
        timezone: coords.timezone,
        displayName: placeName
      };
    }
  }

  // Try OpenStreetMap Nominatim (free API)
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: placeName,
        format: 'json',
        limit: 1
      },
      headers: {
        'User-Agent': 'NakshatraSetu-KundaliApp/1.0'
      },
      timeout: 5000
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);

      // Rough timezone calculation based on longitude
      const timezone = Math.round(lng / 15 * 2) / 2;

      return {
        latitude: lat,
        longitude: lng,
        timezone: timezone,
        displayName: result.display_name
      };
    }
  } catch (error) {
    console.log('Nominatim geocoding failed, using default:', error.message);
  }

  // Default to Delhi if geocoding fails
  return {
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5,
    displayName: placeName + ' (approximated to Delhi)'
  };
}

module.exports = { geocodePlace };
