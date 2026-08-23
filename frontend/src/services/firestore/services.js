// Production Cloud Firestore Data Layer Services
import { dbStore } from './db';
import './seedData';

// ─── USER PROFILE SERVICE ───────────────────────────────────────────────────
export const usersService = {
  getUserProfile: (uid) => {
    const users = dbStore.getCollection('users');
    return users.find(u => u.uid === uid || u.id === uid) || null;
  },
  saveUserProfile: (uid, profileData) => {
    const payload = {
      uid,
      displayName: profileData.displayName || profileData.name || 'Patient',
      email: profileData.email || '',
      phone: profileData.phone || '',
      bloodGroup: profileData.bloodGroup || 'O+',
      medicalHistory: profileData.medicalHistory || [],
      allergies: profileData.allergies || [],
      emergencyContact: profileData.emergencyContact || {},
      location: profileData.location || {},
      role: profileData.role || 'patient',
      updatedAt: new Date().toISOString(),
    };
    dbStore.setDocument('users', uid, payload);
    return payload;
  },
  subscribeUserProfile: (uid, callback) => {
    return dbStore.subscribe('users', (users) => {
      const userDoc = users.find(u => u.uid === uid || u.id === uid);
      callback(userDoc || null);
    });
  },
};

// ─── HOSPITALS SERVICE ─────────────────────────────────────────────────────
export const hospitalsService = {
  getHospitals: () => dbStore.getCollection('hospitals'),
  getHospitalById: (id) => {
    const list = dbStore.getCollection('hospitals');
    return list.find(h => String(h.id) === String(id)) || null;
  },
  subscribeHospitals: (callback) => dbStore.subscribe('hospitals', callback),
};

// ─── DOCTORS SERVICE ───────────────────────────────────────────────────────
export const doctorsService = {
  getDoctors: () => dbStore.getCollection('doctors'),
  getDoctorsByHospital: (hospitalId) => {
    const list = dbStore.getCollection('doctors');
    return list.filter(d => String(d.hospitalId) === String(hospitalId));
  },
  subscribeDoctors: (callback) => dbStore.subscribe('doctors', callback),
};

// ─── BEDS SERVICE ──────────────────────────────────────────────────────────
export const bedsService = {
  getBedAvailability: () => {
    const hospitals = dbStore.getCollection('hospitals');
    return hospitals.map(h => ({
      hospitalId: h.id,
      hospitalName: h.name,
      city: h.city,
      beds: h.beds,
      updatedAt: h.updatedAt || new Date().toISOString(),
    }));
  },
  subscribeBeds: (callback) => {
    return dbStore.subscribe('hospitals', (hospitals) => {
      const bedMap = hospitals.map(h => ({
        hospitalId: h.id,
        hospitalName: h.name,
        city: h.city,
        beds: h.beds,
        updatedAt: h.updatedAt || new Date().toISOString(),
      }));
      callback(bedMap);
    });
  },
};

// ─── BLOOD BANK SERVICE ────────────────────────────────────────────────────
export const bloodBanksService = {
  getBloodBanks: () => dbStore.getCollection('bloodBanks'),
  subscribeBloodBanks: (callback) => dbStore.subscribe('bloodBanks', callback),
};

// ─── AMBULANCE SERVICE ─────────────────────────────────────────────────────
export const ambulancesService = {
  getAmbulances: () => dbStore.getCollection('ambulances'),
  updateAmbulanceStatus: (id, status) => {
    dbStore.setDocument('ambulances', id, { status });
  },
  subscribeAmbulances: (callback) => dbStore.subscribe('ambulances', callback),
};

// ─── APPOINTMENTS SERVICE ──────────────────────────────────────────────────
export const appointmentsService = {
  getAppointments: (patientId) => {
    const list = dbStore.getCollection('appointments');
    if (!patientId) return list;
    return list.filter(a => a.patientId === patientId || a.userId === patientId);
  },
  createAppointment: (appointmentData) => {
    const payload = {
      ...appointmentData,
      status: appointmentData.status || 'CONFIRMED',
      token: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    return dbStore.addDocument('appointments', payload);
  },
  cancelAppointment: (id) => {
    dbStore.setDocument('appointments', id, { status: 'CANCELLED' });
  },
  subscribeAppointments: (patientId, callback) => {
    return dbStore.subscribe('appointments', (list) => {
      if (!patientId) {
        callback(list);
      } else {
        const filtered = list.filter(a => a.patientId === patientId || a.userId === patientId);
        callback(filtered);
      }
    });
  },
};

// ─── EMERGENCY SOS REQUESTS SERVICE ─────────────────────────────────────────
export const emergencyService = {
  createEmergencyRequest: (requestData) => {
    const payload = {
      ...requestData,
      requestId: `SOS-${Date.now()}`,
      status: 'ACKNOWLEDGED',
      priority: 'CRITICAL',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return dbStore.addDocument('emergencyRequests', payload);
  },
  getEmergencyRequests: (userId) => {
    const list = dbStore.getCollection('emergencyRequests');
    if (!userId) return list;
    return list.filter(r => r.userId === userId);
  },
  subscribeEmergencyRequests: (userId, callback) => {
    return dbStore.subscribe('emergencyRequests', (list) => {
      if (!userId) callback(list);
      else callback(list.filter(r => r.userId === userId));
    });
  },
};

// ─── NOTIFICATIONS SERVICE ──────────────────────────────────────────────────
export const notificationsService = {
  getNotifications: (userId) => dbStore.getCollection('notifications'),
  markAsRead: (id) => dbStore.setDocument('notifications', id, { read: true }),
  subscribeNotifications: (userId, callback) => dbStore.subscribe('notifications', callback),
};
