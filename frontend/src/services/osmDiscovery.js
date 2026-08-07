// ============================================================
// OPENSTREETMAP DISCOVERY SERVICE — Anti Gravity Emergency Healthcare Platform
// Uses Nominatim Geocoding + Overpass API for 100% free dynamic hospital discovery.
// Zero API keys required. Zero paid services.
// ============================================================

import { HOSPITALS, CITY_COORDS, calcDistanceKm } from '../data/mockData';

// Cache objects in memory & localStorage
const geocodeCache = new Map();
const overpassCache = new Map();

// Helper to sanitize string
const normalize = (s) => (s ? String(s).trim().toLowerCase() : '');

// 1. Nominatim Geocoding with Caching
export async function geocodeCity(city, state = 'Maharashtra') {
  const cacheKey = `geo_${normalize(city)}_${normalize(state)}`;
  
  // Check in-memory cache
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }

  // Check static CITY_COORDS fallback
  if (CITY_COORDS[city]) {
    geocodeCache.set(cacheKey, CITY_COORDS[city]);
    return CITY_COORDS[city];
  }

  // Check localStorage cache
  try {
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      geocodeCache.set(cacheKey, parsed);
      return parsed;
    }
  } catch (e) {
    // Ignore storage error
  }

  // Query Nominatim API with polite rate limiting & custom User-Agent
  try {
    const queryStr = `${city}, ${state}, India`;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryStr)}`,
      {
        headers: {
          'User-Agent': 'AntiGravityEmergencyHealthcareApp/1.0 (prototype@antigravity.health)',
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const coords = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
        geocodeCache.set(cacheKey, coords);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(coords));
        } catch (e) {}
        return coords;
      }
    }
  } catch (err) {
    console.warn('Nominatim geocoding error:', err);
  }

  // Default fallback if geocoding fails
  const fallback = CITY_COORDS['Pune'] || { lat: 18.5204, lng: 73.8567 };
  return fallback;
}

// 2. Transform raw Overpass API node/way into standard hospital schema
export function transformOsmElementToHospital(elem, userLocation) {
  const tags = elem.tags || {};
  const lat = elem.lat || elem.center?.lat || 0;
  const lng = elem.lon || elem.center?.lon || 0;

  let distance = 0;
  if (userLocation && lat && lng) {
    distance = calcDistanceKm(userLocation.lat, userLocation.lng, lat, lng);
  }

  // Generate deterministic simulated availability for prototype demo
  const idStr = `${elem.id || elem.type}_${tags.name || 'hospital'}`;
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = (hash << 5) - hash + idStr.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  const genBeds = (absHash % 42) + 12;
  const icuBeds = (absHash % 12) + 4;
  const emgBeds = (absHash % 8) + 2;

  const addrParts = [];
  if (tags['addr:street']) addrParts.push(tags['addr:street']);
  if (tags['addr:suburb']) addrParts.push(tags['addr:suburb']);
  if (tags['addr:city']) addrParts.push(tags['addr:city']);
  if (tags['addr:postcode']) addrParts.push(tags['addr:postcode']);

  const fullAddr = addrParts.join(', ') || tags['address'] || 'Address not listed in OSM';
  const hospitalName = tags.name || tags['name:en'] || 'Healthcare Facility';

  return {
    id: `osm-${elem.type}-${elem.id}`,
    osmId: elem.id,
    name: hospitalName,
    address: fullAddr,
    city: tags['addr:city'] || 'Local Area',
    state: 'India',
    type: tags.amenity === 'clinic' ? 'Specialty Clinic' : 'Hospital',
    lat: lat,
    lng: lng,
    distance: parseFloat(distance.toFixed(1)),
    rating: parseFloat(((absHash % 10) / 10 + 4.0).toFixed(1)), // 4.0 - 4.9
    reviewCount: (absHash % 200) + 25,
    openNow: tags.opening_hours === '24/7' ? true : undefined,
    phone: tags.phone || tags['contact:phone'] || 'Not available',
    website: tags.website || tags['contact:website'] || null,
    mapsUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`,
    isOsmData: true,
    emergency: tags.emergency === 'yes' || tags.opening_hours === '24/7' || (absHash % 2 === 0),
    beds: { general: genBeds, icu: icuBeds, emergency: emgBeds, total: genBeds * 4 },
    icuBeds: { available: icuBeds, total: icuBeds * 3 },
    specialists: ["General Medicine", "Cardiology", "Emergency Medicine"],
  };
}

// 3. Query Overpass API for real OpenStreetMap hospitals
export async function queryOverpassHospitals({ lat, lng, radiusKm = 20, userLocation }) {
  const radiusMeters = radiusKm * 1000;
  const cacheKey = `op_${lat.toFixed(3)}_${lng.toFixed(3)}_${radiusKm}`;

  if (overpassCache.has(cacheKey)) {
    return overpassCache.get(cacheKey);
  }

  // Overpass QL query searching for hospitals and clinics around coordinates
  const overpassQuery = `
    [out:json][timeout:12];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      node["healthcare"="hospital"](around:${radiusMeters},${lat},${lng});
      node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
    );
    out center 35;
  `;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: 'data=' + encodeURIComponent(overpassQuery),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.elements && data.elements.length > 0) {
        const transformed = data.elements
          .filter(e => e.tags && (e.tags.name || e.tags['name:en'])) // Must have a name
          .map(e => transformOsmElementToHospital(e, userLocation));

        if (transformed.length > 0) {
          overpassCache.set(cacheKey, transformed);
          return transformed;
        }
      }
    }
  } catch (err) {
    console.warn('Overpass API query error or timeout, using local fallback:', err);
  }

  return null;
}
