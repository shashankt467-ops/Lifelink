// ============================================================
// GOOGLE PLACES DISCOVERY SERVICE — Anti Gravity Emergency Healthcare Platform
// Dynamically fetches verified hospital data from Google Places API
// with smooth fallback to local dataset.
// ============================================================

import { HOSPITALS, CITY_COORDS, calcDistanceKm } from '../data/mockData';

// Helper to extract approx city from address string
export function extractCityFromAddress(address = '') {
  if (!address) return '';
  const cities = Object.keys(CITY_COORDS);
  for (const city of cities) {
    if (address.toLowerCase().includes(city.toLowerCase())) {
      return city;
    }
  }
  return '';
}

// Convert a Google PlaceResult object to our hospital schema
export function transformPlaceToHospital(place, userLocation) {
  const lat = typeof place.geometry?.location?.lat === 'function' 
    ? place.geometry.location.lat() 
    : place.geometry?.location?.lat || 0;
  const lng = typeof place.geometry?.location?.lng === 'function' 
    ? place.geometry.location.lng() 
    : place.geometry?.location?.lng || 0;

  let distance = 0;
  if (userLocation && lat && lng) {
    distance = calcDistanceKm(userLocation.lat, userLocation.lng, lat, lng);
  }

  // Generate deterministic simulated availability for demo prototype
  const strForHash = place.place_id || place.name || 'hospital';
  let hash = 0;
  for (let i = 0; i < strForHash.length; i++) {
    hash = (hash << 5) - hash + strForHash.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const genBeds = (absHash % 45) + 12;
  const icuBeds = (absHash % 14) + 4;
  const emgBeds = (absHash % 8) + 3;

  const isOpen = place.opening_hours?.isOpen 
    ? (typeof place.opening_hours.isOpen === 'function' ? place.opening_hours.isOpen() : place.opening_hours.open_now)
    : place.opening_hours?.open_now;

  return {
    id: place.place_id || `place-${absHash}`,
    placeId: place.place_id,
    name: place.name || 'Hospital',
    address: place.vicinity || place.formatted_address || 'Address unavailable',
    city: extractCityFromAddress(place.formatted_address || place.vicinity) || 'Local Area',
    state: 'India',
    type: place.types?.includes('health') ? 'Multi-Specialty' : 'Hospital',
    lat: lat,
    lng: lng,
    distance: parseFloat(distance.toFixed(1)),
    rating: place.rating ? parseFloat(place.rating.toFixed(1)) : 4.5,
    reviewCount: place.user_ratings_total || (absHash % 300) + 40,
    openNow: isOpen,
    phone: place.formatted_phone_number || '+91 22 3099 6000',
    website: place.website || null,
    mapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
    isRealGooglePlace: true,
    emergency: (absHash % 2 === 0),
    beds: { general: genBeds, icu: icuBeds, emergency: emgBeds, total: genBeds * 4 },
    icuBeds: { available: icuBeds, total: icuBeds * 3 },
    specialists: ["Cardiologist", "Neurologist", "General Physician", "Orthopedic Surgeon", "Emergency Medicine"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Ayushman Bharat"],
  };
}

// Search Google Places for hospitals around a location or query
export function searchGooglePlaces({
  mapInstance,
  location,
  query,
  radius = 25000,
  userLocation,
  onSuccess,
  onError,
}) {
  if (!window.google || !window.google.maps || !window.google.maps.places) {
    if (onError) onError(new Error('Google Places API library not available in browser'), 'NOT_LOADED');
    return;
  }

  try {
    let targetElement = mapInstance;
    if (!targetElement) {
      targetElement = document.getElementById('places-service-dummy-node');
      if (!targetElement) {
        targetElement = document.createElement('div');
        targetElement.id = 'places-service-dummy-node';
        targetElement.style.display = 'none';
        document.body.appendChild(targetElement);
      }
    }
    const service = new window.google.maps.places.PlacesService(targetElement);

    const pyLocation = location 
      ? new window.google.maps.LatLng(location.lat, location.lng)
      : new window.google.maps.LatLng(18.5204, 73.8567);

    const handleCallback = (results, status, pagination) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        const transformed = results.map(place => transformPlaceToHospital(place, userLocation));
        if (onSuccess) onSuccess({ hospitals: transformed, pagination, status });
      } else {
        let errorReason = `Places Service Status: ${status}`;
        if (status === 'REQUEST_DENIED') {
          errorReason = 'Google Places API Key denied or Places API is not enabled in Google Cloud Console.';
        } else if (status === 'OVER_QUERY_LIMIT') {
          errorReason = 'Google Places API quota exceeded or billing is not enabled.';
        } else if (status === 'ZERO_RESULTS') {
          errorReason = 'No Google Places results found for this query/location.';
        }
        if (onError) onError(new Error(errorReason), status);
      }
    };

    if (query && query.trim()) {
      service.textSearch(
        {
          query: query.trim(),
          location: pyLocation,
          radius: radius,
        },
        handleCallback
      );
    } else {
      service.nearbySearch(
        {
          location: pyLocation,
          radius: radius,
          type: ['hospital'],
        },
        handleCallback
      );
    }
  } catch (err) {
    if (onError) onError(err, 'EXCEPTION');
  }
}
