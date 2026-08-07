import { HOSPITALS, DOCTORS, AMBULANCES, BLOOD_BANKS, APPOINTMENTS } from '../data/mockData';

// Simulated API delay
const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

// Calculate score for AI hospital recommendation
const calculateHospitalScore = (hospital, condition, urgency) => {
  let score = 0;
  const weights = {
    distance: 0.25,
    icu: 0.2,
    beds: 0.15,
    emergency: 0.15,
    rating: 0.15,
    waitTime: 0.1,
  };

  const dist = hospital.distance || 5;

  // Distance score (lower = better, max 10km)
  score += weights.distance * Math.max(0, (10 - dist) / 10) * 100;

  // ICU score
  const icuPercent = (hospital.icuBeds.available / Math.max(hospital.icuBeds.total, 1)) * 100;
  score += weights.icu * icuPercent;

  // Bed score
  const totalAvailable = hospital.beds.general + hospital.beds.icu + hospital.beds.emergency;
  score += weights.beds * Math.min(100, (totalAvailable / 10) * 100);

  // Emergency score
  if (hospital.emergency) score += weights.emergency * 100;

  // Rating score
  score += weights.rating * (hospital.rating / 5) * 100;

  // Wait time (lower = better, max 60 min)
  score += weights.waitTime * Math.max(0, (60 - hospital.waitTime) / 60) * 100;

  // Urgency multiplier
  if (urgency === 'critical') {
    score = score * (dist < 5 ? 1.2 : 0.8);
  }

  return Math.min(100, Math.round(score));
};

// Haversine distance helper
function calcDist(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1));
}

// ─── HOSPITALS ───────────────────────────────────────────────────────────────

export const api = {
  hospitals: {
    getAll: async () => {
      await delay();
      return { data: HOSPITALS, success: true };
    },
    getById: async (id) => {
      await delay(400);
      const hospital = HOSPITALS.find(h => h.id === id);
      return hospital ? { data: hospital, success: true } : { error: 'Not found', success: false };
    },
    getNearby: async (lat, lng, radius = 50) => {
      await delay(800);
      const withDist = HOSPITALS.map(h => ({
        ...h,
        distance: calcDist(lat, lng, h.lat, h.lng),
        eta: Math.round((calcDist(lat, lng, h.lat, h.lng) / 30) * 60),
      })).sort((a, b) => a.distance - b.distance);
      return { data: withDist, success: true };
    },
    getAIRecommendation: async ({ condition, specialist, urgency }) => {
      await delay(1500);
      const scored = HOSPITALS.map(hospital => ({
        ...hospital,
        aiScore: calculateHospitalScore(hospital, condition, urgency),
        reasons: [
          hospital.distance < 3 ? `✓ Only ${hospital.distance}km away` : null,
          hospital.icuBeds.available > 5 ? `✓ ${hospital.icuBeds.available} ICU beds available` : null,
          hospital.emergency ? '✓ 24/7 Emergency services' : null,
          hospital.rating >= 4.7 ? `✓ Highly rated (${hospital.rating}/5)` : null,
          hospital.waitTime < 20 ? `✓ Short wait time (~${hospital.waitTime} min)` : null,
          specialist && hospital.specialists.includes(specialist) ? `✓ ${specialist} available` : null,
        ].filter(Boolean),
      })).sort((a, b) => b.aiScore - a.aiScore);

      return { data: scored, recommended: scored[0], success: true };
    },
  },

  // ─── DOCTORS ────────────────────────────────────────────────────────────────
  doctors: {
    getAll: async () => {
      await delay();
      return { data: DOCTORS, success: true };
    },
    getById: async (id) => {
      await delay(300);
      const doc = DOCTORS.find(d => d.id === id);
      return doc ? { data: doc, success: true } : { error: 'Not found', success: false };
    },
    search: async ({ specialization, hospital, available }) => {
      await delay(600);
      let results = [...DOCTORS];
      if (specialization) results = results.filter(d => d.specialization === specialization);
      if (hospital) results = results.filter(d => d.hospital.toLowerCase().includes(hospital.toLowerCase()));
      if (available !== undefined) results = results.filter(d => d.available === available);
      return { data: results, success: true };
    },
  },

  // ─── AMBULANCES ─────────────────────────────────────────────────────────────
  ambulances: {
    getAvailable: async () => {
      await delay(700);
      const available = AMBULANCES.filter(a => a.status === 'Available');
      return { data: available, success: true };
    },
    request: async (pickupLocation, hospitalId) => {
      await delay(2000);
      const ambulance = AMBULANCES.find(a => a.status === 'Available');
      if (!ambulance) throw new Error('No ambulances available');
      return {
        data: {
          ...ambulance,
          status: 'Assigned',
          bookingId: `AMB-${Date.now()}`,
          estimatedArrival: ambulance.eta,
        },
        success: true,
      };
    },
    trackStatus: async (bookingId) => {
      await delay(300);
      const statuses = ['Searching', 'Assigned', 'Arriving', 'Picked Up', 'At Hospital'];
      return { data: { status: 'Arriving', progress: 60 }, success: true };
    },
  },

  // ─── BLOOD BANK ──────────────────────────────────────────────────────────────
  bloodBank: {
    search: async (bloodType) => {
      await delay(600);
      if (!bloodType) return { data: BLOOD_BANKS, success: true };
      const results = BLOOD_BANKS
        .filter(b => b.inventory[bloodType] > 0)
        .map(b => ({ ...b, unitsAvailable: b.inventory[bloodType] }))
        .sort((a, b) => b.unitsAvailable - a.unitsAvailable);
      return { data: results, success: true };
    },
    requestBlood: async (bankId, bloodType, units) => {
      await delay(1000);
      return { data: { requestId: `BLD-${Date.now()}`, status: 'Requested' }, success: true };
    },
  },

  // ─── APPOINTMENTS ────────────────────────────────────────────────────────────
  appointments: {
    getAll: async () => {
      await delay(500);
      const stored = JSON.parse(localStorage.getItem('ag_appointments') || 'null');
      return { data: stored || APPOINTMENTS, success: true };
    },
    book: async ({ doctorId, date, time, type = 'Consultation' }) => {
      await delay(1000);
      const doctor = DOCTORS.find(d => d.id === doctorId);
      if (!doctor) throw new Error('Doctor not found');
      const newAppt = {
        id: Date.now(),
        doctorId,
        doctorName: doctor.name,
        specialization: doctor.specialization,
        hospital: doctor.hospital,
        date,
        time,
        type,
        status: 'Confirmed',
        tokenNumber: `T-${Math.floor(Math.random() * 900) + 100}`,
        fee: doctor.consultationFee,
        notes: '',
      };
      const existing = JSON.parse(localStorage.getItem('ag_appointments') || 'null') || APPOINTMENTS;
      const updated = [newAppt, ...existing];
      localStorage.setItem('ag_appointments', JSON.stringify(updated));
      return { data: newAppt, success: true };
    },
    cancel: async (id) => {
      await delay(500);
      const existing = JSON.parse(localStorage.getItem('ag_appointments') || 'null') || APPOINTMENTS;
      const updated = existing.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a);
      localStorage.setItem('ag_appointments', JSON.stringify(updated));
      return { data: { success: true }, success: true };
    },
  },

  // ─── AI HEALTH ASSISTANT ─────────────────────────────────────────────────────
  ai: {
    chat: async (message) => {
      await delay(1500);
      const { AI_RESPONSES } = await import('../data/mockData');
      const lower = message.toLowerCase();
      let response = AI_RESPONSES.default;

      for (const [key, val] of Object.entries(AI_RESPONSES)) {
        if (key !== 'default' && lower.includes(key)) {
          response = val;
          break;
        }
      }

      return {
        data: {
          message: response.guidance,
          severity: response.severity,
          recommendations: response.recommendations,
          seekEmergency: response.seekEmergency,
          specialist: response.specialist,
        },
        success: true,
      };
    },
  },

  // ─── ANALYTICS ──────────────────────────────────────────────────────────────
  analytics: {
    getDashboard: async () => {
      await delay(400);
      return {
        data: {
          totalHospitals: HOSPITALS.length,
          totalDoctors: DOCTORS.length,
          availableAmbulances: AMBULANCES.filter(a => a.status === 'Available').length,
          totalBeds: HOSPITALS.reduce((sum, h) => sum + h.beds.general + h.beds.icu + h.beds.emergency, 0),
          emergencyContacts: 6,
          appointments: (JSON.parse(localStorage.getItem('ag_appointments') || 'null') || APPOINTMENTS).length,
        },
        success: true,
      };
    },
  },
};

export default api;
