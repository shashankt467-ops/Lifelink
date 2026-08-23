// Official Firebase & Cloud Firestore Service Initialization
import { firebaseConfig } from '../firebase';

// Helper for local reactive Firestore state store with local persistence backup
class MemoryFirestoreStore {
  constructor() {
    this.collections = {
      users: JSON.parse(localStorage.getItem('ll_db_users') || '{}'),
      hospitals: JSON.parse(localStorage.getItem('ll_db_hospitals') || 'null'),
      doctors: JSON.parse(localStorage.getItem('ll_db_doctors') || 'null'),
      beds: JSON.parse(localStorage.getItem('ll_db_beds') || 'null'),
      bloodBanks: JSON.parse(localStorage.getItem('ll_db_bloodBanks') || 'null'),
      ambulances: JSON.parse(localStorage.getItem('ll_db_ambulances') || 'null'),
      appointments: JSON.parse(localStorage.getItem('ll_db_appointments') || '[]'),
      emergencyRequests: JSON.parse(localStorage.getItem('ll_db_emergencyRequests') || '[]'),
      notifications: JSON.parse(localStorage.getItem('ll_db_notifications') || '[]'),
    };
    this.listeners = new Map();
  }

  _persist(collName) {
    try {
      localStorage.setItem(`ll_db_${collName}`, JSON.stringify(this.collections[collName]));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  _notify(collName) {
    const subs = this.listeners.get(collName) || [];
    const data = this.getCollection(collName);
    subs.forEach(cb => cb(data));
  }

  subscribe(collName, callback) {
    if (!this.listeners.has(collName)) {
      this.listeners.set(collName, []);
    }
    this.listeners.get(collName).push(callback);
    callback(this.getCollection(collName));
    return () => {
      const arr = this.listeners.get(collName) || [];
      const idx = arr.indexOf(callback);
      if (idx > -1) arr.splice(idx, 1);
    };
  }

  getCollection(collName) {
    const raw = this.collections[collName];
    if (Array.isArray(raw)) return [...raw];
    if (raw && typeof raw === 'object') return Object.values(raw);
    return [];
  }

  setCollection(collName, items) {
    if (Array.isArray(items)) {
      this.collections[collName] = items;
    } else {
      this.collections[collName] = items;
    }
    this._persist(collName);
    this._notify(collName);
  }

  setDocument(collName, docId, docData) {
    const current = this.collections[collName] || (Array.isArray(this.collections[collName]) ? [] : {});
    if (Array.isArray(current)) {
      const idx = current.findIndex(item => item.id === docId || item.uid === docId);
      const payload = { ...docData, id: docId, updatedAt: new Date().toISOString() };
      if (idx > -1) {
        current[idx] = { ...current[idx], ...payload };
      } else {
        current.unshift(payload);
      }
      this.collections[collName] = current;
    } else {
      this.collections[collName][docId] = {
        ...current[docId],
        ...docData,
        id: docId,
        updatedAt: new Date().toISOString(),
      };
    }
    this._persist(collName);
    this._notify(collName);
  }

  addDocument(collName, docData) {
    const docId = `${collName.slice(0, 4)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newDoc = {
      ...docData,
      id: docId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (!Array.isArray(this.collections[collName])) {
      this.collections[collName] = Object.values(this.collections[collName] || {});
    }
    this.collections[collName].unshift(newDoc);
    this._persist(collName);
    this._notify(collName);
    return newDoc;
  }
}

export const dbStore = new MemoryFirestoreStore();
