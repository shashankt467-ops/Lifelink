import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { CITY_COORDS } from '../data/mockData';
import { geocodeCity } from '../services/osmDiscovery';

const AppContext = createContext(null);

// Default fallback location (Pune, Maharashtra)
const DEFAULT_LOCATION = {
  lat: 18.5204,
  lng: 73.8567,
  city: 'Pune',
  state: 'Maharashtra',
  source: 'default',
  formattedLocation: 'Pune, Maharashtra',
};

// Weather WMO Code Interpreter
function interpretWmoCode(code) {
  if (code === 0) return { condition: 'Clear Sky', icon: '☀️' };
  if ([1, 2, 3].includes(code)) return { condition: 'Partly Cloudy', icon: '⛅' };
  if ([45, 48].includes(code)) return { condition: 'Foggy', icon: '🌫️' };
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return { condition: 'Rainy', icon: '🌧️' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: 'Snowy', icon: '❄️' };
  if ([95, 96, 99].includes(code)) return { condition: 'Thunderstorm', icon: '🌩️' };
  return { condition: 'Partly Cloudy', icon: '⛅' };
}

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ag_theme') || 'light';
  });

  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Shared Location State
  const [location, setLocationState] = useState(() => {
    try {
      const saved = localStorage.getItem('antigravity_user_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.city && parsed.lat && parsed.lng) {
          return parsed;
        }
      }
    } catch (e) {}
    return DEFAULT_LOCATION;
  });

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Shared Weather State
  const [weather, setWeather] = useState({
    temp: 26,
    condition: 'Partly Cloudy',
    icon: '⛅',
    city: location.city,
    state: location.state,
    loading: false,
    error: null,
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ag_theme', theme);
  }, [theme]);

  // Save location to localStorage whenever it changes
  const updateLocation = useCallback((newLoc) => {
    setLocationState(newLoc);
    try {
      localStorage.setItem('antigravity_user_location', JSON.stringify(newLoc));
    } catch (e) {}
  }, []);

  // Fetch free weather from Open-Meteo API based on current coordinates
  const fetchWeather = useCallback(async (lat, lng, cityName, stateName) => {
    setWeather(prev => ({ ...prev, loading: true, error: null }));
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.current_weather) {
          const cw = data.current_weather;
          const { condition, icon } = interpretWmoCode(cw.weathercode);
          setWeather({
            temp: Math.round(cw.temperature),
            condition: condition,
            icon: icon,
            city: cityName,
            state: stateName,
            loading: false,
            error: null,
          });
          return;
        }
      }
    } catch (err) {
      console.warn('Open-Meteo weather fetch error:', err);
    }
    // Fallback weather calculation based on lat
    const simTemp = Math.round(24 + (30 - Math.abs(lat - 19)));
    setWeather({
      temp: simTemp,
      condition: 'Partly Cloudy',
      icon: '⛅',
      city: cityName,
      state: stateName,
      loading: false,
      error: 'Weather service offline',
    });
  }, []);

  // Update weather whenever location coordinates change
  useEffect(() => {
    if (location && location.lat && location.lng) {
      fetchWeather(location.lat, location.lng, location.city, location.state);
    }
  }, [location.lat, location.lng, location.city, location.state, fetchWeather]);

  // Manually change city & state
  const changeCity = useCallback(async (cityName, stateName = 'Maharashtra') => {
    setLocationLoading(true);
    setLocationError(null);

    let coords = CITY_COORDS[cityName];
    if (!coords) {
      coords = await geocodeCity(cityName, stateName);
    }

    const newLoc = {
      lat: coords.lat,
      lng: coords.lng,
      city: cityName,
      state: stateName,
      source: 'manual',
      formattedLocation: `${cityName}, ${stateName}`,
    };

    updateLocation(newLoc);
    setLocationLoading(false);
    return newLoc;
  }, [updateLocation]);

  // Detect GPS Location via Browser Geolocation + Nominatim Reverse Geocoding
  const detectGpsLocation = useCallback(async (showToast = true) => {
    setLocationLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          let city = 'Nearby City';
          let state = 'India';

          try {
            // Reverse geocode via Nominatim API
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
              {
                headers: {
                  'User-Agent': 'AntiGravityEmergencyHealthcareApp/1.0',
                },
              }
            );
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              city = addr.city || addr.town || addr.village || addr.county || addr.state_district || 'Detected Area';
              state = addr.state || 'India';
            }
          } catch (e) {
            console.warn('Reverse geocoding error:', e);
          }

          const newLoc = {
            lat,
            lng,
            city,
            state,
            source: 'gps',
            formattedLocation: `${city}, ${state}`,
          };

          updateLocation(newLoc);
          setLocationLoading(false);
          resolve(newLoc);
        },
        (err) => {
          setLocationError('Could not get GPS permission');
          setLocationLoading(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, [updateLocation]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const addNotification = (notification) => {
    setNotifications(prev => [{ id: Date.now(), ...notification, read: false }, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      notifications, addNotification,
      sidebarOpen, setSidebarOpen,
      // Shared Location Context
      location,
      userLocation: { lat: location.lat, lng: location.lng }, // Backwards compatibility for pages expecting userLocation
      locationLoading,
      locationError,
      changeCity,
      detectGpsLocation,
      updateLocation,
      // Weather Context
      weather,
      fetchWeather,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
