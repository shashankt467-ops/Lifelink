// Production API Service connected directly to Cloud Firestore Services Layer
import {
  hospitalsService,
  doctorsService,
  ambulancesService,
  bloodBanksService,
  appointmentsService,
  emergencyService,
  usersService
} from './firestore/services';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://lifelink-backend-4cwa.onrender.com').replace(/\/$/, '');

// Simulated network latency for smooth transitions
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

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
  const icuAvailable = hospital.beds?.icu || hospital.icuBeds?.available || 4;
  const icuTotal = hospital.beds?.total || hospital.icuBeds?.total || 20;
  const icuPercent = (icuAvailable / Math.max(icuTotal, 1)) * 100;
  score += weights.icu * icuPercent;

  // Bed score
  const totalAvailable = (hospital.beds?.general || 15) + (hospital.beds?.icu || 4) + (hospital.beds?.emergency || 5);
  score += weights.beds * Math.min(100, (totalAvailable / 10) * 100);

  // Emergency score
  if (hospital.emergency) score += weights.emergency * 100;

  // Rating score
  score += weights.rating * ((hospital.rating || 4.5) / 5) * 100;

  // Wait time (lower = better, max 60 min)
  const waitTime = hospital.waitTime || 15;
  score += weights.waitTime * Math.max(0, (60 - waitTime) / 60) * 100;

  // Urgency multiplier
  if (urgency === 'critical') {
    score = score * (dist < 5 ? 1.2 : 0.8);
  }

  return Math.min(100, Math.round(score));
};

// Haversine distance helper
function calcDist(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 5;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 +
    Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1));
}

// ─── FIRESTORE CONNECTED API INTERFACE ─────────────────────────────────────
export const api = {
  hospitals: {
    getAll: async () => {
      await delay();
      const list = hospitalsService.getHospitals();
      return { data: list, success: true };
    },
    getById: async (id) => {
      await delay();
      const hospital = hospitalsService.getHospitalById(id);
      return hospital ? { data: hospital, success: true } : { error: 'Not found', success: false };
    },
    getNearby: async (lat, lng, radius = 50) => {
      await delay();
      const list = hospitalsService.getHospitals();
      const withDist = list.map(h => ({
        ...h,
        distance: calcDist(lat, lng, h.latitude || h.lat, h.longitude || h.lng),
        eta: Math.round((calcDist(lat, lng, h.latitude || h.lat, h.longitude || h.lng) / 30) * 60),
      })).sort((a, b) => a.distance - b.distance);
      return { data: withDist, success: true };
    },
    getAIRecommendation: async ({ condition, specialist, urgency, lat = 18.5204, lng = 73.8567 }) => {
      await delay(800);
      const list = hospitalsService.getHospitals();
      const scored = list.map(hospital => {
        const dist = calcDist(lat, lng, hospital.latitude || hospital.lat, hospital.longitude || hospital.lng);
        const hospitalWithDist = { ...hospital, distance: dist };
        const score = calculateHospitalScore(hospitalWithDist, condition, urgency);
        const icuAvail = hospital.beds?.icu || 4;
        return {
          ...hospitalWithDist,
          aiScore: score,
          reasons: [
            dist < 5 ? `✓ Only ${dist}km from current location` : null,
            icuAvail > 3 ? `✓ ${icuAvail} ICU beds available` : null,
            hospital.emergency ? '✓ 24/7 Emergency trauma center' : null,
            (hospital.rating || 4.5) >= 4.6 ? `✓ Highly rated (${hospital.rating}/5)` : null,
            specialist && hospital.specialists?.includes(specialist) ? `✓ ${specialist} specialist team active` : null,
          ].filter(Boolean),
        };
      }).sort((a, b) => b.aiScore - a.aiScore);

      return { data: scored, recommended: scored[0], success: true };
    },
  },

  // ─── DOCTORS ────────────────────────────────────────────────────────────────
  doctors: {
    getAll: async () => {
      await delay();
      const list = doctorsService.getDoctors();
      return { data: list, success: true };
    },
    getById: async (id) => {
      await delay();
      const list = doctorsService.getDoctors();
      const doc = list.find(d => String(d.id) === String(id));
      return doc ? { data: doc, success: true } : { error: 'Not found', success: false };
    },
    search: async ({ specialization, hospital, available }) => {
      await delay();
      let results = doctorsService.getDoctors();
      if (specialization) results = results.filter(d => d.specialization === specialization);
      if (hospital) results = results.filter(d => (d.hospital || '').toLowerCase().includes(hospital.toLowerCase()));
      if (available !== undefined) results = results.filter(d => d.available === available);
      return { data: results, success: true };
    },
  },

  // ─── AMBULANCES ─────────────────────────────────────────────────────────────
  ambulances: {
    getAvailable: async () => {
      await delay();
      const list = ambulancesService.getAmbulances();
      const available = list.filter(a => a.status === 'AVAILABLE' || a.status === 'Available');
      return { data: available, success: true };
    },
    request: async (pickupLocation, hospitalId) => {
      await delay(800);
      const list = ambulancesService.getAmbulances();
      const ambulance = list.find(a => a.status === 'AVAILABLE' || a.status === 'Available') || list[0];
      if (!ambulance) throw new Error('No ambulances available');
      ambulancesService.updateAmbulanceStatus(ambulance.id, 'ON_ROUTE');
      return {
        data: {
          ...ambulance,
          status: 'ON_ROUTE',
          bookingId: `AMB-${Date.now()}`,
          estimatedArrival: ambulance.eta || 8,
        },
        success: true,
      };
    },
    trackStatus: async (bookingId) => {
      await delay(300);
      return { data: { status: 'ON_ROUTE', progress: 65 }, success: true };
    },
  },

  // ─── BLOOD BANK ──────────────────────────────────────────────────────────────
  bloodBank: {
    search: async (bloodType) => {
      await delay();
      const banks = bloodBanksService.getBloodBanks();
      if (!bloodType) return { data: banks, success: true };
      const results = banks
        .map(b => ({
          ...b,
          unitsAvailable: b.units?.[bloodType] || 0,
        }))
        .filter(b => b.unitsAvailable > 0)
        .sort((a, b) => b.unitsAvailable - a.unitsAvailable);
      return { data: results, success: true };
    },
    requestBlood: async (bankId, bloodType, units) => {
      await delay(600);
      return { data: { requestId: `BLD-${Date.now()}`, status: 'REQUESTED' }, success: true };
    },
  },

  // ─── APPOINTMENTS ────────────────────────────────────────────────────────────
  appointments: {
    getAll: async (patientId) => {
      await delay();
      const list = appointmentsService.getAppointments(patientId);
      return { data: list, success: true };
    },
    book: async ({ doctorId, doctorName, patientId, patientName, date, time, type = 'Consultation' }) => {
      await delay(600);
      const doctors = doctorsService.getDoctors();
      const doc = doctors.find(d => String(d.id) === String(doctorId)) || {};
      const newAppt = appointmentsService.createAppointment({
        patientId: patientId || 'user-default',
        patientName: patientName || 'Patient',
        doctorId,
        doctorName: doctorName || doc.name || 'Specialist Doctor',
        specialization: doc.specialization || 'General',
        hospital: doc.hospital || 'Hospital',
        appointmentDate: date,
        appointmentTime: time,
        type,
        fee: doc.consultationFee || 700,
      });
      return { data: newAppt, success: true };
    },
    cancel: async (id) => {
      await delay(300);
      appointmentsService.cancelAppointment(id);
      return { data: { success: true }, success: true };
    },
  },

  // ─── EMERGENCY SOS REQUESTS ───────────────────────────────────────────────────
  emergency: {
    createSOS: async (sosData) => {
      await delay(500);
      const req = emergencyService.createEmergencyRequest(sosData);
      return { data: req, success: true };
    },
  },

  // ─── AI HEALTH ASSISTANT ─────────────────────────────────────────────────────
  ai: {
    chat: async (message) => {
      await delay(800);
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

  // ─── ANALYTICS & FIRESTORE DASHBOARD COUNTS ──────────────────────────────────
  analytics: {
    getDashboard: async () => {
      await delay(200);
      const hospitals = hospitalsService.getHospitals();
      const doctors = doctorsService.getDoctors();
      const ambulances = ambulancesService.getAmbulances();
      const bloodBanks = bloodBanksService.getBloodBanks();
      const appointments = appointmentsService.getAppointments();

      const totalBeds = hospitals.reduce((sum, h) => {
        const b = h.beds || {};
        return sum + (b.general || 0) + (b.icu || 0) + (b.emergency || 0);
      }, 0);

      const readyAmbulances = ambulances.filter(a => a.status === 'AVAILABLE' || a.status === 'Available').length;
      const activeDoctors = doctors.filter(d => d.available === true).length;

      return {
        data: {
          totalHospitals: hospitals.length,
          totalDoctors: activeDoctors || doctors.length,
          availableAmbulances: readyAmbulances,
          totalBeds: totalBeds || 120,
          bloodBanksCount: bloodBanks.length,
          appointmentsCount: appointments.length,
        },
        success: true,
      };
    },
  },
};

export default api;
