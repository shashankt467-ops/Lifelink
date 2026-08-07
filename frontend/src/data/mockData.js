// ============================================================
// MOCK DATA — Anti Gravity Emergency Healthcare Platform
// INDIA-WIDE DATASET — Demo/Hackathon Data
// ⚠️  All bed counts, blood availability, doctor details and
//     ratings are SIMULATED for demonstration purposes only.
//     isDemoData: true on all records.
// ============================================================

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const sim = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const blood = () => ({
  "A+": sim(5, 40), "A-": sim(0, 12), "B+": sim(5, 35), "B-": sim(0, 10),
  "O+": sim(8, 50), "O-": sim(2, 18), "AB+": sim(1, 15), "AB-": sim(0, 6),
});

// ─── STATE / CITY LOOKUP ──────────────────────────────────────────────────────
export const INDIA_STATES = [
  "Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Telangana",
  "West Bengal", "Gujarat", "Rajasthan", "Kerala", "Uttar Pradesh",
  "Punjab", "Odisha", "Madhya Pradesh", "Andhra Pradesh",
];

export const CITIES_BY_STATE = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Navi Mumbai", "Chhatrapati Sambhajinagar", "Kolhapur", "Solapur"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kottayam"],
  "Telangana": ["Hyderabad", "Warangal"],
  "Karnataka": ["Bengaluru", "Mysuru", "Mangaluru"],
  "Delhi": ["New Delhi", "Delhi"],
  "West Bengal": ["Kolkata"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara"],
  "Rajasthan": ["Jaipur", "Jodhpur"],
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Agra"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar"],
  "Odisha": ["Bhubaneswar"],
  "Madhya Pradesh": ["Indore", "Bhopal"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada"],
};

// ─── HOSPITAL TYPES ───────────────────────────────────────────────────────────
export const HOSPITAL_TYPES = [
  "Multi-Specialty", "Super Specialty", "Government Teaching",
  "Government District", "Private Specialty", "Cancer Institute",
];

// ─── HOSPITALS ────────────────────────────────────────────────────────────────
export const HOSPITALS = [

  // ══════════════════════════════════════════════════════
  // MAHARASHTRA — MUMBAI
  // ══════════════════════════════════════════════════════
  {
    id: 1, name: "Kokilaben Dhirubhai Ambani Hospital", city: "Mumbai", state: "Maharashtra",
    type: "Super Specialty", address: "Rao Saheb Achutrao Patwardhan Marg, 4 Bunglows, Andheri West, Mumbai – 400053",
    lat: 19.1264, lng: 72.8333, distance: 0, eta: 0, rating: 4.8, reviewCount: 3241,
    phone: "+91-22-30996000", emergency: true, emergencyPhone: "+91-22-30999999",
    beds: { general: 55, icu: 14, emergency: 18, total: 750 },
    icuBeds: { available: 14, total: 60 }, waitTime: 20,
    specialists: ["Cardiologist", "Neurologist", "Oncologist", "Orthopedic Surgeon", "Neurosurgeon", "Robotic Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "Robotic Surgery", "Cath Lab", "PET-CT", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Aditya Birla", "Niva Bupa"],
    score: 96, isDemoData: true,
  },
  {
    id: 2, name: "Lilavati Hospital & Research Centre", city: "Mumbai", state: "Maharashtra",
    type: "Multi-Specialty", address: "A-791, Bandra Reclamation, Bandra West, Mumbai – 400050",
    lat: 19.0555, lng: 72.8190, distance: 0, eta: 0, rating: 4.7, reviewCount: 2876,
    phone: "+91-22-26751000", emergency: true, emergencyPhone: "+91-22-26751000",
    beds: { general: 42, icu: 10, emergency: 14, total: 330 },
    icuBeds: { available: 10, total: 40 }, waitTime: 25,
    specialists: ["Cardiologist", "Gastroenterologist", "Nephrologist", "Gynecologist", "Orthopedic Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "Catheterization Lab", "Dialysis", "MRI", "CT Scan", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 93, isDemoData: true,
  },
  {
    id: 3, name: "P. D. Hinduja Hospital & MRC", city: "Mumbai", state: "Maharashtra",
    type: "Multi-Specialty", address: "Veer Savarkar Marg, Mahim, Mumbai – 400016",
    lat: 19.0376, lng: 72.8397, distance: 0, eta: 0, rating: 4.8, reviewCount: 3102,
    phone: "+91-22-24452222", emergency: true, emergencyPhone: "+91-22-24452222",
    beds: { general: 48, icu: 11, emergency: 16, total: 360 },
    icuBeds: { available: 11, total: 44 }, waitTime: 22,
    specialists: ["Cardiologist", "Neurologist", "Liver Transplant", "Oncologist", "ENT Specialist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Liver Transplant", "Heart Transplant", "Blood Bank", "MRI"],
    insuranceAccepted: ["Star Health", "ICICI Lombard", "HDFC ERGO"],
    score: 94, isDemoData: true,
  },
  {
    id: 4, name: "Nanavati Max Super Speciality Hospital", city: "Mumbai", state: "Maharashtra",
    type: "Super Specialty", address: "Vile Parle West, Mumbai – 400056",
    lat: 19.1010, lng: 72.8460, distance: 0, eta: 0, rating: 4.6, reviewCount: 1987,
    phone: "+91-22-26267500", emergency: true, emergencyPhone: "+91-22-26267500",
    beds: { general: 38, icu: 9, emergency: 12, total: 350 },
    icuBeds: { available: 9, total: 38 }, waitTime: 18,
    specialists: ["Cardiologist", "Orthopedic Surgeon", "Endocrinologist", "Pulmonologist", "Psychiatrist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Robotic Surgery", "MRI", "PET Scan", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Religare"],
    score: 90, isDemoData: true,
  },
  {
    id: 5, name: "Jaslok Hospital & Research Centre", city: "Mumbai", state: "Maharashtra",
    type: "Multi-Specialty", address: "15, Dr. G. Deshmukh Marg, Peddar Road, Mumbai – 400026",
    lat: 18.9714, lng: 72.8080, distance: 0, eta: 0, rating: 4.7, reviewCount: 2543,
    phone: "+91-22-66573333", emergency: true, emergencyPhone: "+91-22-66573333",
    beds: { general: 50, icu: 12, emergency: 15, total: 340 },
    icuBeds: { available: 12, total: 48 }, waitTime: 28,
    specialists: ["Cardiologist", "Neurosurgeon", "Oncologist", "Gastroenterologist", "Urologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Bone Marrow Transplant", "Dialysis", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Niva Bupa"],
    score: 92, isDemoData: true,
  },
  {
    id: 6, name: "Tata Memorial Hospital", city: "Mumbai", state: "Maharashtra",
    type: "Cancer Institute", address: "Dr. E. Borges Road, Parel, Mumbai – 400012",
    lat: 19.0035, lng: 72.8415, distance: 0, eta: 0, rating: 4.9, reviewCount: 4231,
    phone: "+91-22-24177000", emergency: false, emergencyPhone: "",
    beds: { general: 60, icu: 15, emergency: 8, total: 629 },
    icuBeds: { available: 15, total: 55 }, waitTime: 60,
    specialists: ["Oncologist", "Radiation Oncologist", "Surgical Oncologist", "Palliative Care"],
    blood: blood(), facilities: ["Cancer Surgery", "Radiation Therapy", "Chemotherapy", "Bone Marrow Transplant", "Blood Bank"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "Star Health", "HDFC ERGO"],
    score: 97, isDemoData: true,
  },
  {
    id: 7, name: "KEM Hospital (Municipal)", city: "Mumbai", state: "Maharashtra",
    type: "Government Teaching", address: "Acharya Donde Marg, Parel, Mumbai – 400012",
    lat: 19.0012, lng: 72.8402, distance: 0, eta: 0, rating: 4.4, reviewCount: 5634,
    phone: "+91-22-24136051", emergency: true, emergencyPhone: "+91-22-24136051",
    beds: { general: 100, icu: 20, emergency: 30, total: 1800 },
    icuBeds: { available: 20, total: 80 }, waitTime: 55,
    specialists: ["Cardiologist", "Neurologist", "General Surgeon", "Orthopedic Surgeon", "Pediatrician", "Psychiatrist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Trauma Center", "Blood Bank", "CT Scan", "MRI"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "ESI"],
    score: 85, isDemoData: true,
  },
  {
    id: 8, name: "Sir J. J. Hospital (Government)", city: "Mumbai", state: "Maharashtra",
    type: "Government Teaching", address: "Byculla, Mumbai – 400008",
    lat: 18.9770, lng: 72.8323, distance: 0, eta: 0, rating: 4.3, reviewCount: 4102,
    phone: "+91-22-23735555", emergency: true, emergencyPhone: "+91-22-23735555",
    beds: { general: 120, icu: 22, emergency: 35, total: 2500 },
    icuBeds: { available: 22, total: 90 }, waitTime: 65,
    specialists: ["General Surgeon", "Orthopedic Surgeon", "Neurologist", "Oncologist", "Gynecologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Trauma Center", "Blood Bank", "Dialysis"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "ESI"],
    score: 80, isDemoData: true,
  },
  {
    id: 9, name: "Wockhardt Hospital Mira Road", city: "Thane", state: "Maharashtra",
    type: "Multi-Specialty", address: "Mira Road East, Thane – 401107",
    lat: 19.2819, lng: 72.8567, distance: 0, eta: 0, rating: 4.4, reviewCount: 1245,
    phone: "+91-22-28117700", emergency: true, emergencyPhone: "+91-22-28117700",
    beds: { general: 30, icu: 7, emergency: 10, total: 200 },
    icuBeds: { available: 7, total: 28 }, waitTime: 20,
    specialists: ["Cardiologist", "Orthopedic Surgeon", "General Physician", "Gynecologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 82, isDemoData: true,
  },
  {
    id: 10, name: "Apollo Hospitals Navi Mumbai", city: "Navi Mumbai", state: "Maharashtra",
    type: "Multi-Specialty", address: "Plot No. 13, Sector 23, CBD Belapur, Navi Mumbai – 400614",
    lat: 19.0176, lng: 73.0304, distance: 0, eta: 0, rating: 4.7, reviewCount: 2134,
    phone: "+91-22-27579000", emergency: true, emergencyPhone: "+91-22-27579000",
    beds: { general: 40, icu: 9, emergency: 12, total: 300 },
    icuBeds: { available: 9, total: 36 }, waitTime: 18,
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Surgeon", "Oncologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "Cath Lab", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Aditya Birla", "Niva Bupa"],
    score: 91, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // MAHARASHTRA — PUNE
  // ══════════════════════════════════════════════════════
  {
    id: 11, name: "Ruby Hall Clinic", city: "Pune", state: "Maharashtra",
    type: "Multi-Specialty", address: "40, Sassoon Road, Pune – 411001",
    lat: 18.5314, lng: 73.8724, distance: 0, eta: 0, rating: 4.7, reviewCount: 3421,
    phone: "+91-20-26163391", emergency: true, emergencyPhone: "+91-20-26163391",
    beds: { general: 45, icu: 11, emergency: 15, total: 450 },
    icuBeds: { available: 11, total: 44 }, waitTime: 22,
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Surgeon", "Gastroenterologist", "Oncologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "Dialysis", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 93, isDemoData: true,
  },
  {
    id: 12, name: "Jehangir Hospital", city: "Pune", state: "Maharashtra",
    type: "Multi-Specialty", address: "32, Sassoon Road, Pune – 411001",
    lat: 18.5329, lng: 73.8742, distance: 0, eta: 0, rating: 4.6, reviewCount: 2987,
    phone: "+91-20-66810000", emergency: true, emergencyPhone: "+91-20-66810000",
    beds: { general: 38, icu: 9, emergency: 12, total: 350 },
    icuBeds: { available: 9, total: 36 }, waitTime: 25,
    specialists: ["Cardiologist", "Gynecologist", "Pediatrician", "ENT Specialist", "Dermatologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "MRI", "CT Scan", "Blood Bank", "Pharmacy"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Religare"],
    score: 88, isDemoData: true,
  },
  {
    id: 13, name: "Deenanath Mangeshkar Hospital", city: "Pune", state: "Maharashtra",
    type: "Multi-Specialty", address: "Erandwane, Pune – 411004",
    lat: 18.5120, lng: 73.8349, distance: 0, eta: 0, rating: 4.7, reviewCount: 3102,
    phone: "+91-20-49150000", emergency: true, emergencyPhone: "+91-20-49150000",
    beds: { general: 50, icu: 12, emergency: 16, total: 500 },
    icuBeds: { available: 12, total: 48 }, waitTime: 20,
    specialists: ["Cardiologist", "Neurologist", "Oncologist", "Urologist", "Nephrologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "Robotic Surgery", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Aditya Birla"],
    score: 94, isDemoData: true,
  },
  {
    id: 14, name: "Sahyadri Hospitals Pune", city: "Pune", state: "Maharashtra",
    type: "Multi-Specialty", address: "30-C, Karve Road, Deccan Gymkhana, Pune – 411004",
    lat: 18.5180, lng: 73.8397, distance: 0, eta: 0, rating: 4.5, reviewCount: 1876,
    phone: "+91-20-67210000", emergency: true, emergencyPhone: "+91-20-67210000",
    beds: { general: 35, icu: 8, emergency: 10, total: 300 },
    icuBeds: { available: 8, total: 32 }, waitTime: 18,
    specialists: ["Cardiologist", "Gastroenterologist", "Orthopedic Surgeon", "Gynecologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "MRI", "CT Scan", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 87, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // MAHARASHTRA — NAGPUR
  // ══════════════════════════════════════════════════════
  {
    id: 15, name: "AIIMS Nagpur", city: "Nagpur", state: "Maharashtra",
    type: "Government Teaching", address: "Plot No. 2, Sector-20, MIHAN, Nagpur – 441108",
    lat: 21.0833, lng: 79.0833, distance: 0, eta: 0, rating: 4.8, reviewCount: 3421,
    phone: "+91-712-2970050", emergency: true, emergencyPhone: "+91-712-2970050",
    beds: { general: 80, icu: 18, emergency: 25, total: 960 },
    icuBeds: { available: 18, total: 72 }, waitTime: 35,
    specialists: ["Cardiologist", "Neurologist", "General Surgeon", "Orthopedic Surgeon", "Oncologist", "Psychiatrist"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "Trauma Center", "Blood Bank", "MRI"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "Star Health"],
    score: 95, isDemoData: true,
  },
  {
    id: 16, name: "Wockhardt Hospitals Nagpur", city: "Nagpur", state: "Maharashtra",
    type: "Multi-Specialty", address: "Ramdaspeth, Nagpur – 440010",
    lat: 21.1458, lng: 79.0882, distance: 0, eta: 0, rating: 4.4, reviewCount: 987,
    phone: "+91-712-6161300", emergency: true, emergencyPhone: "+91-712-6161300",
    beds: { general: 28, icu: 6, emergency: 9, total: 200 },
    icuBeds: { available: 6, total: 24 }, waitTime: 22,
    specialists: ["Cardiologist", "Orthopedic Surgeon", "Neurologist", "General Physician"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 82, isDemoData: true,
  },
  {
    id: 17, name: "Lata Mangeshkar Hospital", city: "Nagpur", state: "Maharashtra",
    type: "Private Specialty", address: "Digdoh Hills, Hingna Road, Nagpur – 440016",
    lat: 21.1270, lng: 79.0090, distance: 0, eta: 0, rating: 4.5, reviewCount: 1432,
    phone: "+91-712-6602222", emergency: true, emergencyPhone: "+91-712-6602222",
    beds: { general: 32, icu: 8, emergency: 10, total: 250 },
    icuBeds: { available: 8, total: 32 }, waitTime: 18,
    specialists: ["Cardiologist", "Pediatrician", "Gynecologist", "Orthopedic Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "Blood Bank", "CT Scan"],
    insuranceAccepted: ["Star Health", "Bajaj Allianz", "Niva Bupa"],
    score: 85, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // MAHARASHTRA — NASHIK
  // ══════════════════════════════════════════════════════
  {
    id: 18, name: "Wockhardt Hospitals Nashik", city: "Nashik", state: "Maharashtra",
    type: "Multi-Specialty", address: "Pathardi Phata, Nashik – 422010",
    lat: 20.0059, lng: 73.7897, distance: 0, eta: 0, rating: 4.3, reviewCount: 876,
    phone: "+91-253-6161600", emergency: true, emergencyPhone: "+91-253-6161600",
    beds: { general: 25, icu: 5, emergency: 8, total: 150 },
    icuBeds: { available: 5, total: 20 }, waitTime: 20,
    specialists: ["Cardiologist", "Orthopedic Surgeon", "General Physician", "Gynecologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 80, isDemoData: true,
  },
  {
    id: 19, name: "Nashik District Government Hospital", city: "Nashik", state: "Maharashtra",
    type: "Government District", address: "Civil Hospital Road, Nashik – 422001",
    lat: 20.0059, lng: 73.7929, distance: 0, eta: 0, rating: 4.0, reviewCount: 1234,
    phone: "+91-253-2577000", emergency: true, emergencyPhone: "+91-253-2577000",
    beds: { general: 60, icu: 10, emergency: 15, total: 500 },
    icuBeds: { available: 10, total: 40 }, waitTime: 45,
    specialists: ["General Surgeon", "Orthopedic Surgeon", "Gynecologist", "Pediatrician"],
    blood: blood(), facilities: ["Emergency", "ICU", "Blood Bank", "X-Ray", "CT Scan"],
    insuranceAccepted: ["Ayushman Bharat", "Mahatma Phule Jan Arogya"],
    score: 75, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // MAHARASHTRA — CHHATRAPATI SAMBHAJINAGAR (AURANGABAD)
  // ══════════════════════════════════════════════════════
  {
    id: 20, name: "MGM Hospital Chhatrapati Sambhajinagar", city: "Chhatrapati Sambhajinagar", state: "Maharashtra",
    type: "Private Specialty", address: "N-6, CIDCO, Chhatrapati Sambhajinagar – 431003",
    lat: 19.8762, lng: 75.3433, distance: 0, eta: 0, rating: 4.4, reviewCount: 1102,
    phone: "+91-240-2402400", emergency: true, emergencyPhone: "+91-240-2402400",
    beds: { general: 35, icu: 7, emergency: 10, total: 300 },
    icuBeds: { available: 7, total: 28 }, waitTime: 25,
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Surgeon", "General Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "MRI", "CT Scan", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Ayushman Bharat"],
    score: 82, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // MAHARASHTRA — KOLHAPUR
  // ══════════════════════════════════════════════════════
  {
    id: 21, name: "CPR District Hospital Kolhapur", city: "Kolhapur", state: "Maharashtra",
    type: "Government District", address: "New Shahupuri, Kolhapur – 416001",
    lat: 16.7050, lng: 74.2433, distance: 0, eta: 0, rating: 4.1, reviewCount: 987,
    phone: "+91-231-2650505", emergency: true, emergencyPhone: "+91-231-2650505",
    beds: { general: 55, icu: 10, emergency: 14, total: 500 },
    icuBeds: { available: 10, total: 40 }, waitTime: 40,
    specialists: ["General Surgeon", "Orthopedic Surgeon", "Gynecologist", "Pediatrician"],
    blood: blood(), facilities: ["Emergency", "ICU", "Blood Bank", "X-Ray", "CT Scan"],
    insuranceAccepted: ["Ayushman Bharat", "Mahatma Phule Jan Arogya"],
    score: 76, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // MAHARASHTRA — SOLAPUR
  // ══════════════════════════════════════════════════════
  {
    id: 22, name: "Solapur Civil Hospital", city: "Solapur", state: "Maharashtra",
    type: "Government District", address: "Civil Hospital Road, Solapur – 413001",
    lat: 17.6804, lng: 75.9064, distance: 0, eta: 0, rating: 4.0, reviewCount: 876,
    phone: "+91-217-2317200", emergency: true, emergencyPhone: "+91-217-2317200",
    beds: { general: 60, icu: 10, emergency: 15, total: 600 },
    icuBeds: { available: 10, total: 40 }, waitTime: 45,
    specialists: ["General Surgeon", "Gynecologist", "Pediatrician", "Orthopedic Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "Blood Bank", "X-Ray"],
    insuranceAccepted: ["Ayushman Bharat", "Mahatma Phule Jan Arogya"],
    score: 74, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // DELHI / NCR
  // ══════════════════════════════════════════════════════
  {
    id: 23, name: "AIIMS New Delhi", city: "New Delhi", state: "Delhi",
    type: "Government Teaching", address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi – 110029",
    lat: 28.5672, lng: 77.2100, distance: 0, eta: 0, rating: 4.9, reviewCount: 8765,
    phone: "+91-11-26588500", emergency: true, emergencyPhone: "+91-11-26588700",
    beds: { general: 120, icu: 25, emergency: 40, total: 2500 },
    icuBeds: { available: 25, total: 100 }, waitTime: 50,
    specialists: ["Cardiologist", "Neurologist", "Oncologist", "Transplant Surgeon", "Psychiatrist", "Orthopedic Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "Trauma Center", "Burn Unit", "Blood Bank"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "All Government Schemes"],
    score: 98, isDemoData: true,
  },
  {
    id: 24, name: "Max Super Speciality Hospital Saket", city: "New Delhi", state: "Delhi",
    type: "Super Specialty", address: "1–2, Press Enclave Road, Saket, New Delhi – 110017",
    lat: 28.5264, lng: 77.2159, distance: 0, eta: 0, rating: 4.6, reviewCount: 3421,
    phone: "+91-11-26515050", emergency: true, emergencyPhone: "+91-11-26515050",
    beds: { general: 45, icu: 11, emergency: 15, total: 500 },
    icuBeds: { available: 11, total: 44 }, waitTime: 28,
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Surgeon", "ENT Specialist", "Gynecologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "MRI", "PET-CT", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 91, isDemoData: true,
  },
  {
    id: 25, name: "Medanta The Medicity Gurugram", city: "New Delhi", state: "Delhi",
    type: "Super Specialty", address: "CH Baktawar Singh Road, Sector 38, Gurugram – 122001",
    lat: 28.4425, lng: 77.0349, distance: 0, eta: 0, rating: 4.7, reviewCount: 4102,
    phone: "+91-124-4141414", emergency: true, emergencyPhone: "+91-124-4141414",
    beds: { general: 70, icu: 16, emergency: 22, total: 1250 },
    icuBeds: { available: 16, total: 64 }, waitTime: 30,
    specialists: ["Cardiac Surgeon", "Neurologist", "Oncologist", "Transplant Specialist", "Endocrinologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Robotic Surgery", "Cath Lab", "Blood Bank", "PET Scan"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Aditya Birla", "Niva Bupa"],
    score: 95, isDemoData: true,
  },
  {
    id: 26, name: "Safdarjung Hospital", city: "New Delhi", state: "Delhi",
    type: "Government Teaching", address: "Ring Road, Ansari Nagar West, New Delhi – 110029",
    lat: 28.5697, lng: 77.2066, distance: 0, eta: 0, rating: 4.3, reviewCount: 5432,
    phone: "+91-11-26165060", emergency: true, emergencyPhone: "+91-11-26165060",
    beds: { general: 100, icu: 20, emergency: 30, total: 1531 },
    icuBeds: { available: 20, total: 80 }, waitTime: 60,
    specialists: ["General Surgeon", "Orthopedic Surgeon", "Neurologist", "Pediatrician", "Burn Specialist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Trauma Center", "Burns Unit", "Blood Bank"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "ESI"],
    score: 82, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // KARNATAKA — BENGALURU
  // ══════════════════════════════════════════════════════
  {
    id: 27, name: "Manipal Hospitals HAL Airport Road", city: "Bengaluru", state: "Karnataka",
    type: "Multi-Specialty", address: "98, HAL Airport Road, Bengaluru – 560017",
    lat: 12.9784, lng: 77.6408, distance: 0, eta: 0, rating: 4.5, reviewCount: 2543,
    phone: "+91-80-25024444", emergency: true, emergencyPhone: "+91-80-25024444",
    beds: { general: 40, icu: 9, emergency: 12, total: 600 },
    icuBeds: { available: 9, total: 36 }, waitTime: 22,
    specialists: ["Cardiologist", "Urologist", "Nephrologist", "Ophthalmologist", "Gastroenterologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "MRI", "Endoscopy", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Religare", "Niva Bupa"],
    score: 88, isDemoData: true,
  },
  {
    id: 28, name: "Fortis Hospital Cunningham Road", city: "Bengaluru", state: "Karnataka",
    type: "Multi-Specialty", address: "14, Cunningham Road, Bengaluru – 560052",
    lat: 12.9854, lng: 77.5860, distance: 0, eta: 0, rating: 4.6, reviewCount: 2987,
    phone: "+91-80-66214444", emergency: true, emergencyPhone: "+91-80-66214444",
    beds: { general: 35, icu: 8, emergency: 11, total: 380 },
    icuBeds: { available: 8, total: 32 }, waitTime: 20,
    specialists: ["Cardiologist", "Neurologist", "Gastroenterologist", "Dermatologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Dialysis", "MRI", "CT Scan", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "National Insurance"],
    score: 89, isDemoData: true,
  },
  {
    id: 29, name: "Narayana Health City", city: "Bengaluru", state: "Karnataka",
    type: "Super Specialty", address: "258/A, Bommasandra Industrial Area, Bengaluru – 560099",
    lat: 12.8254, lng: 77.6868, distance: 0, eta: 0, rating: 4.7, reviewCount: 3654,
    phone: "+91-80-71222222", emergency: true, emergencyPhone: "+91-80-71222222",
    beds: { general: 65, icu: 15, emergency: 20, total: 1400 },
    icuBeds: { available: 15, total: 60 }, waitTime: 25,
    specialists: ["Cardiac Surgeon", "Pediatric Cardiac Surgeon", "Neurologist", "Oncologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cardiac Cath Lab", "Blood Bank", "MRI"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Aditya Birla", "Ayushman Bharat"],
    score: 94, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // TAMIL NADU — CHENNAI
  // ══════════════════════════════════════════════════════
  {
    id: 30, name: "Apollo Hospitals Chennai", city: "Chennai", state: "Tamil Nadu",
    type: "Multi-Specialty", address: "21, Greams Lane, Off Greams Road, Chennai – 600006",
    lat: 13.0614, lng: 80.2479, distance: 0, eta: 0, rating: 4.8, reviewCount: 4231,
    phone: "+91-44-28290200", emergency: true, emergencyPhone: "+91-44-28290200",
    beds: { general: 55, icu: 13, emergency: 18, total: 800 },
    icuBeds: { available: 13, total: 52 }, waitTime: 18,
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Surgeon", "Oncologist", "Liver Transplant"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "Cath Lab", "PET-CT", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Niva Bupa", "Aditya Birla"],
    score: 96, isDemoData: true,
  },
  {
    id: 31, name: "Government Royapettah Hospital", city: "Chennai", state: "Tamil Nadu",
    type: "Government Teaching", address: "65, Royapettah High Road, Chennai – 600014",
    lat: 13.0569, lng: 80.2607, distance: 0, eta: 0, rating: 4.2, reviewCount: 2345,
    phone: "+91-44-28114433", emergency: true, emergencyPhone: "+91-44-28114433",
    beds: { general: 75, icu: 14, emergency: 22, total: 900 },
    icuBeds: { available: 14, total: 56 }, waitTime: 55,
    specialists: ["General Surgeon", "Orthopedic Surgeon", "Gynecologist", "Pediatrician"],
    blood: blood(), facilities: ["Emergency", "ICU", "Blood Bank", "CT Scan", "X-Ray"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "ESI"],
    score: 78, isDemoData: true,
  },
  {
    id: 32, name: "CMC Vellore — Christian Medical College", city: "Chennai", state: "Tamil Nadu",
    type: "Government Teaching", address: "Ida Scudder Road, Vellore – 632004",
    lat: 12.9204, lng: 79.1325, distance: 0, eta: 0, rating: 4.9, reviewCount: 6543,
    phone: "+91-416-2281000", emergency: true, emergencyPhone: "+91-416-2281000",
    beds: { general: 110, icu: 22, emergency: 30, total: 2500 },
    icuBeds: { available: 22, total: 88 }, waitTime: 55,
    specialists: ["Cardiologist", "Neurologist", "Nephrology", "Hematologist", "Transplant Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "Bone Marrow Transplant", "Blood Bank"],
    insuranceAccepted: ["Ayushman Bharat", "Star Health", "HDFC ERGO", "CGHS"],
    score: 98, isDemoData: true,
  },
  {
    id: 33, name: "Coimbatore Medical College Hospital", city: "Coimbatore", state: "Tamil Nadu",
    type: "Government Teaching", address: "Avanashi Road, Coimbatore – 641018",
    lat: 11.0168, lng: 76.9558, distance: 0, eta: 0, rating: 4.3, reviewCount: 2134,
    phone: "+91-422-2302000", emergency: true, emergencyPhone: "+91-422-2302000",
    beds: { general: 80, icu: 16, emergency: 22, total: 1000 },
    icuBeds: { available: 16, total: 64 }, waitTime: 50,
    specialists: ["General Surgeon", "Orthopedic Surgeon", "Neurologist", "Cardiology"],
    blood: blood(), facilities: ["Emergency", "ICU", "Blood Bank", "MRI", "CT Scan"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS"],
    score: 79, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // TELANGANA — HYDERABAD
  // ══════════════════════════════════════════════════════
  {
    id: 34, name: "Yashoda Hospitals Secunderabad", city: "Hyderabad", state: "Telangana",
    type: "Multi-Specialty", address: "Raj Bhavan Road, Somajiguda, Hyderabad – 500082",
    lat: 17.4239, lng: 78.4738, distance: 0, eta: 0, rating: 4.7, reviewCount: 3241,
    phone: "+91-40-45674567", emergency: true, emergencyPhone: "+91-40-45674567",
    beds: { general: 48, icu: 11, emergency: 15, total: 600 },
    icuBeds: { available: 11, total: 44 }, waitTime: 22,
    specialists: ["Cardiologist", "Neurologist", "Oncologist", "Gastroenterologist", "Orthopedic Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "NICU", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Aditya Birla"],
    score: 93, isDemoData: true,
  },
  {
    id: 35, name: "Apollo Hospitals Hyderabad", city: "Hyderabad", state: "Telangana",
    type: "Multi-Specialty", address: "Jubilee Hills, Hyderabad – 500033",
    lat: 17.4326, lng: 78.4071, distance: 0, eta: 0, rating: 4.8, reviewCount: 3987,
    phone: "+91-40-23607777", emergency: true, emergencyPhone: "+91-40-23607777",
    beds: { general: 52, icu: 12, emergency: 16, total: 700 },
    icuBeds: { available: 12, total: 48 }, waitTime: 20,
    specialists: ["Cardiologist", "Neurologist", "Oncologist", "Orthopedic Surgeon", "Urology"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "Robotic Surgery", "PET-CT", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Niva Bupa", "Aditya Birla"],
    score: 96, isDemoData: true,
  },
  {
    id: 36, name: "NIMS Hyderabad (Nizam's Institute)", city: "Hyderabad", state: "Telangana",
    type: "Government Teaching", address: "Punjagutta, Hyderabad – 500082",
    lat: 17.4219, lng: 78.4491, distance: 0, eta: 0, rating: 4.5, reviewCount: 4321,
    phone: "+91-40-23489000", emergency: true, emergencyPhone: "+91-40-23489999",
    beds: { general: 90, icu: 18, emergency: 28, total: 1000 },
    icuBeds: { available: 18, total: 72 }, waitTime: 45,
    specialists: ["Cardiologist", "Neurologist", "Oncologist", "Nephrology", "Transplant Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "Kidney Transplant", "Blood Bank"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "ESI"],
    score: 88, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // WEST BENGAL — KOLKATA
  // ══════════════════════════════════════════════════════
  {
    id: 37, name: "Apollo Gleneagles Hospital Kolkata", city: "Kolkata", state: "West Bengal",
    type: "Multi-Specialty", address: "58, Canal Circular Road, Kolkata – 700054",
    lat: 22.5726, lng: 88.4162, distance: 0, eta: 0, rating: 4.6, reviewCount: 2134,
    phone: "+91-33-23205040", emergency: true, emergencyPhone: "+91-33-23205040",
    beds: { general: 38, icu: 9, emergency: 12, total: 400 },
    icuBeds: { available: 9, total: 36 }, waitTime: 25,
    specialists: ["Cardiologist", "Neurologist", "Oncologist", "Orthopedic Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "Blood Bank", "MRI"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 88, isDemoData: true,
  },
  {
    id: 38, name: "SSKM Hospital Kolkata (Government)", city: "Kolkata", state: "West Bengal",
    type: "Government Teaching", address: "244, AJC Bose Road, Kolkata – 700020",
    lat: 22.5425, lng: 88.3639, distance: 0, eta: 0, rating: 4.3, reviewCount: 5432,
    phone: "+91-33-22235555", emergency: true, emergencyPhone: "+91-33-22235555",
    beds: { general: 100, icu: 20, emergency: 30, total: 2000 },
    icuBeds: { available: 20, total: 80 }, waitTime: 65,
    specialists: ["General Surgeon", "Neurologist", "Cardiologist", "Orthopedic Surgeon", "Psychiatrist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Trauma Center", "Blood Bank", "MRI"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "ESI"],
    score: 80, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // GUJARAT — AHMEDABAD
  // ══════════════════════════════════════════════════════
  {
    id: 39, name: "Apollo Hospitals Ahmedabad", city: "Ahmedabad", state: "Gujarat",
    type: "Multi-Specialty", address: "Bhat, Ahmedabad – 382428",
    lat: 23.0225, lng: 72.5714, distance: 0, eta: 0, rating: 4.6, reviewCount: 2341,
    phone: "+91-79-66701800", emergency: true, emergencyPhone: "+91-79-66701800",
    beds: { general: 42, icu: 10, emergency: 13, total: 450 },
    icuBeds: { available: 10, total: 40 }, waitTime: 22,
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Surgeon", "Oncologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Niva Bupa"],
    score: 90, isDemoData: true,
  },
  {
    id: 40, name: "Civil Hospital Ahmedabad", city: "Ahmedabad", state: "Gujarat",
    type: "Government Teaching", address: "Asarwa, Ahmedabad – 380016",
    lat: 23.0510, lng: 72.5986, distance: 0, eta: 0, rating: 4.2, reviewCount: 6543,
    phone: "+91-79-22681003", emergency: true, emergencyPhone: "+91-79-22681003",
    beds: { general: 110, icu: 22, emergency: 35, total: 2700 },
    icuBeds: { available: 22, total: 88 }, waitTime: 65,
    specialists: ["General Surgeon", "Cardiologist", "Neurologist", "Orthopedic Surgeon", "Psychiatrist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Trauma Center", "Blood Bank", "MRI"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "ESI"],
    score: 80, isDemoData: true,
  },
  {
    id: 41, name: "Sterling Hospital Surat", city: "Surat", state: "Gujarat",
    type: "Multi-Specialty", address: "Gurukul Road, Memnagar, Surat – 395007",
    lat: 21.1702, lng: 72.8311, distance: 0, eta: 0, rating: 4.4, reviewCount: 1432,
    phone: "+91-261-2600005", emergency: true, emergencyPhone: "+91-261-2600005",
    beds: { general: 30, icu: 7, emergency: 10, total: 250 },
    icuBeds: { available: 7, total: 28 }, waitTime: 20,
    specialists: ["Cardiologist", "Orthopedic Surgeon", "Gynecologist", "General Physician"],
    blood: blood(), facilities: ["Emergency", "ICU", "MRI", "CT Scan", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 83, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // RAJASTHAN — JAIPUR
  // ══════════════════════════════════════════════════════
  {
    id: 42, name: "Fortis Escorts Hospital Jaipur", city: "Jaipur", state: "Rajasthan",
    type: "Multi-Specialty", address: "Jawahar Lal Nehru Marg, Jaipur – 302017",
    lat: 26.9124, lng: 75.8073, distance: 0, eta: 0, rating: 4.5, reviewCount: 1987,
    phone: "+91-141-2547000", emergency: true, emergencyPhone: "+91-141-2547000",
    beds: { general: 38, icu: 9, emergency: 12, total: 350 },
    icuBeds: { available: 9, total: 36 }, waitTime: 22,
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Surgeon", "Oncologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 88, isDemoData: true,
  },
  {
    id: 43, name: "SMS Hospital Jaipur (Government)", city: "Jaipur", state: "Rajasthan",
    type: "Government Teaching", address: "Sawai Ram Singh Road, Jaipur – 302004",
    lat: 26.9124, lng: 75.8073, distance: 0, eta: 0, rating: 4.2, reviewCount: 7654,
    phone: "+91-141-2518888", emergency: true, emergencyPhone: "+91-141-2518888",
    beds: { general: 120, icu: 22, emergency: 35, total: 5000 },
    icuBeds: { available: 22, total: 88 }, waitTime: 70,
    specialists: ["General Surgeon", "Cardiologist", "Neurologist", "Orthopedic Surgeon", "Psychiatrist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Trauma Center", "Blood Bank", "MRI"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "ESI", "BSBY"],
    score: 78, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // KERALA — KOCHI
  // ══════════════════════════════════════════════════════
  {
    id: 44, name: "Aster Medcity Kochi", city: "Kochi", state: "Kerala",
    type: "Super Specialty", address: "Kuttisahib Road, South Chittoor, Kochi – 682027",
    lat: 9.9312, lng: 76.2673, distance: 0, eta: 0, rating: 4.8, reviewCount: 3421,
    phone: "+91-484-6699999", emergency: true, emergencyPhone: "+91-484-6699999",
    beds: { general: 50, icu: 12, emergency: 16, total: 670 },
    icuBeds: { available: 12, total: 48 }, waitTime: 18,
    specialists: ["Cardiologist", "Neurologist", "Oncologist", "Orthopedic Surgeon", "Gastroenterologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Robotic Surgery", "Cath Lab", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Aditya Birla"],
    score: 95, isDemoData: true,
  },
  {
    id: 45, name: "Medical Trust Hospital Kochi", city: "Kochi", state: "Kerala",
    type: "Multi-Specialty", address: "M.G. Road, Ernakulam, Kochi – 682016",
    lat: 9.9816, lng: 76.2999, distance: 0, eta: 0, rating: 4.5, reviewCount: 2134,
    phone: "+91-484-2358001", emergency: true, emergencyPhone: "+91-484-2358001",
    beds: { general: 35, icu: 8, emergency: 11, total: 300 },
    icuBeds: { available: 8, total: 32 }, waitTime: 20,
    specialists: ["Cardiologist", "Neurologist", "Gynecologist", "Pediatrician"],
    blood: blood(), facilities: ["Emergency", "ICU", "MRI", "CT Scan", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Oriental Insurance"],
    score: 86, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // UTTAR PRADESH — LUCKNOW
  // ══════════════════════════════════════════════════════
  {
    id: 46, name: "KGMU Lucknow (King George's Medical University)", city: "Lucknow", state: "Uttar Pradesh",
    type: "Government Teaching", address: "Shahmina Road, Lucknow – 226003",
    lat: 26.8647, lng: 80.9462, distance: 0, eta: 0, rating: 4.5, reviewCount: 5432,
    phone: "+91-522-2257450", emergency: true, emergencyPhone: "+91-522-2257450",
    beds: { general: 110, icu: 22, emergency: 35, total: 4500 },
    icuBeds: { available: 22, total: 88 }, waitTime: 55,
    specialists: ["Cardiologist", "Neurologist", "Oncologist", "Transplant Surgeon", "Orthopedic Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "Trauma Center", "Blood Bank", "MRI", "PET-CT"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "ESI"],
    score: 90, isDemoData: true,
  },
  {
    id: 47, name: "Medanta Hospital Lucknow", city: "Lucknow", state: "Uttar Pradesh",
    type: "Multi-Specialty", address: "Sushant Golf City, Amar Shaheed Path, Lucknow – 226030",
    lat: 26.7606, lng: 81.0042, distance: 0, eta: 0, rating: 4.6, reviewCount: 1876,
    phone: "+91-522-4505050", emergency: true, emergencyPhone: "+91-522-4505050",
    beds: { general: 40, icu: 9, emergency: 12, total: 400 },
    icuBeds: { available: 9, total: 36 }, waitTime: 22,
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Surgeon", "Gastroenterologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Aditya Birla"],
    score: 88, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // PUNJAB — CHANDIGARH
  // ══════════════════════════════════════════════════════
  {
    id: 48, name: "PGI Chandigarh (PGIMER)", city: "Chandigarh", state: "Punjab",
    type: "Government Teaching", address: "Sector 12, Chandigarh – 160012",
    lat: 30.7643, lng: 76.7767, distance: 0, eta: 0, rating: 4.8, reviewCount: 7654,
    phone: "+91-172-2755555", emergency: true, emergencyPhone: "+91-172-2755555",
    beds: { general: 120, icu: 24, emergency: 40, total: 2500 },
    icuBeds: { available: 24, total: 96 }, waitTime: 60,
    specialists: ["Cardiologist", "Neurologist", "Liver Transplant", "Kidney Transplant", "Psychiatrist", "Oncologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "Liver Transplant", "Blood Bank", "MRI"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "All Government Schemes"],
    score: 97, isDemoData: true,
  },
  {
    id: 49, name: "Fortis Hospital Mohali", city: "Chandigarh", state: "Punjab",
    type: "Multi-Specialty", address: "Phase 8, Industrial Area, Mohali – 160062",
    lat: 30.7041, lng: 76.7173, distance: 0, eta: 0, rating: 4.5, reviewCount: 2134,
    phone: "+91-172-4927000", emergency: true, emergencyPhone: "+91-172-4927000",
    beds: { general: 38, icu: 8, emergency: 11, total: 350 },
    icuBeds: { available: 8, total: 32 }, waitTime: 22,
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Surgeon", "Gastroenterologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 87, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // ODISHA — BHUBANESWAR
  // ══════════════════════════════════════════════════════
  {
    id: 50, name: "AIIMS Bhubaneswar", city: "Bhubaneswar", state: "Odisha",
    type: "Government Teaching", address: "Sijua, Patrapada, Bhubaneswar – 751019",
    lat: 20.1493, lng: 85.6676, distance: 0, eta: 0, rating: 4.6, reviewCount: 2987,
    phone: "+91-674-2476774", emergency: true, emergencyPhone: "+91-674-2476774",
    beds: { general: 70, icu: 15, emergency: 22, total: 960 },
    icuBeds: { available: 15, total: 60 }, waitTime: 40,
    specialists: ["Cardiologist", "Neurologist", "General Surgeon", "Orthopedic Surgeon", "Oncologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "Trauma Center", "Blood Bank"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "Biju Swasthya Kalyan Yojana"],
    score: 90, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // MADHYA PRADESH — INDORE / BHOPAL
  // ══════════════════════════════════════════════════════
  {
    id: 51, name: "Bombay Hospital Indore", city: "Indore", state: "Madhya Pradesh",
    type: "Multi-Specialty", address: "Ring Road, Indore – 452010",
    lat: 22.7196, lng: 75.8577, distance: 0, eta: 0, rating: 4.4, reviewCount: 1543,
    phone: "+91-731-2391444", emergency: true, emergencyPhone: "+91-731-2391444",
    beds: { general: 32, icu: 7, emergency: 10, total: 250 },
    icuBeds: { available: 7, total: 28 }, waitTime: 20,
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Surgeon", "General Physician"],
    blood: blood(), facilities: ["Emergency", "ICU", "MRI", "CT Scan", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 83, isDemoData: true,
  },
  {
    id: 52, name: "Hamidia Hospital Bhopal (Government)", city: "Bhopal", state: "Madhya Pradesh",
    type: "Government Teaching", address: "Royal Market, Sultan Nagar, Bhopal – 462001",
    lat: 23.2599, lng: 77.4126, distance: 0, eta: 0, rating: 4.2, reviewCount: 3421,
    phone: "+91-755-2543500", emergency: true, emergencyPhone: "+91-755-2543500",
    beds: { general: 85, icu: 16, emergency: 25, total: 1500 },
    icuBeds: { available: 16, total: 64 }, waitTime: 55,
    specialists: ["General Surgeon", "Cardiologist", "Neurologist", "Orthopedic Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "Trauma Center", "Blood Bank", "CT Scan"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS", "ESI"],
    score: 77, isDemoData: true,
  },

  // ══════════════════════════════════════════════════════
  // ANDHRA PRADESH — VISAKHAPATNAM
  // ══════════════════════════════════════════════════════
  {
    id: 53, name: "Apollo Hospitals Visakhapatnam", city: "Visakhapatnam", state: "Andhra Pradesh",
    type: "Multi-Specialty", address: "Waltair Main Road, Visakhapatnam – 530002",
    lat: 17.7231, lng: 83.3182, distance: 0, eta: 0, rating: 4.6, reviewCount: 2134,
    phone: "+91-891-2715000", emergency: true, emergencyPhone: "+91-891-2715000",
    beds: { general: 40, icu: 9, emergency: 12, total: 400 },
    icuBeds: { available: 9, total: 36 }, waitTime: 22,
    specialists: ["Cardiologist", "Neurologist", "Orthopedic Surgeon", "Oncologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Niva Bupa"],
    score: 89, isDemoData: true,
  },
  {
    id: 54, name: "King George Hospital Visakhapatnam (Government)", city: "Visakhapatnam", state: "Andhra Pradesh",
    type: "Government Teaching", address: "Maharanipeta, Visakhapatnam – 530002",
    lat: 17.7050, lng: 83.2985, distance: 0, eta: 0, rating: 4.2, reviewCount: 3987,
    phone: "+91-891-2564891", emergency: true, emergencyPhone: "+91-891-2564891",
    beds: { general: 90, icu: 18, emergency: 28, total: 1500 },
    icuBeds: { available: 18, total: 72 }, waitTime: 60,
    specialists: ["General Surgeon", "Orthopedic Surgeon", "Gynecologist", "Pediatrician"],
    blood: blood(), facilities: ["Emergency", "ICU", "Trauma Center", "Blood Bank"],
    insuranceAccepted: ["Ayushman Bharat", "CGHS"],
    score: 76, isDemoData: true,
  },

  // Extra Maharashtra hospitals
  {
    id: 55, name: "Fortis Hospital Mulund Mumbai", city: "Mumbai", state: "Maharashtra",
    type: "Multi-Specialty", address: "Mulund Goregaon Link Road, Mumbai – 400078",
    lat: 19.1653, lng: 72.9523, distance: 0, eta: 0, rating: 4.5, reviewCount: 1654,
    phone: "+91-22-21822000", emergency: true, emergencyPhone: "+91-22-21822000",
    beds: { general: 35, icu: 8, emergency: 11, total: 300 },
    icuBeds: { available: 8, total: 32 }, waitTime: 20,
    specialists: ["Cardiologist", "Orthopedic Surgeon", "Neurologist", "Gastroenterologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "MRI", "CT Scan", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Bajaj Allianz"],
    score: 86, isDemoData: true,
  },
  {
    id: 56, name: "Bombay Hospital Mumbai", city: "Mumbai", state: "Maharashtra",
    type: "Multi-Specialty", address: "12, New Marine Lines, Mumbai – 400020",
    lat: 18.9397, lng: 72.8255, distance: 0, eta: 0, rating: 4.5, reviewCount: 2134,
    phone: "+91-22-22067676", emergency: true, emergencyPhone: "+91-22-22067676",
    beds: { general: 42, icu: 10, emergency: 13, total: 360 },
    icuBeds: { available: 10, total: 40 }, waitTime: 25,
    specialists: ["Cardiologist", "Neurologist", "Gastroenterologist", "Oncologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Niva Bupa"],
    score: 87, isDemoData: true,
  },
  {
    id: 57, name: "Global Hospital Mumbai", city: "Mumbai", state: "Maharashtra",
    type: "Super Specialty", address: "35, Dr. E. Borges Road, Parel, Mumbai – 400012",
    lat: 19.0008, lng: 72.8427, distance: 0, eta: 0, rating: 4.6, reviewCount: 1987,
    phone: "+91-22-67670101", emergency: true, emergencyPhone: "+91-22-67670101",
    beds: { general: 40, icu: 10, emergency: 13, total: 350 },
    icuBeds: { available: 10, total: 40 }, waitTime: 22,
    specialists: ["Liver Transplant", "Kidney Transplant", "Cardiologist", "Neurologist"],
    blood: blood(), facilities: ["Emergency", "ICU", "Transplant Unit", "Blood Bank", "MRI"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Aditya Birla"],
    score: 91, isDemoData: true,
  },
  {
    id: 58, name: "Poona Hospital Pune", city: "Pune", state: "Maharashtra",
    type: "Multi-Specialty", address: "27, Sadashiv Peth, Pune – 411030",
    lat: 18.5161, lng: 73.8467, distance: 0, eta: 0, rating: 4.3, reviewCount: 1345,
    phone: "+91-20-24456789", emergency: true, emergencyPhone: "+91-20-24456789",
    beds: { general: 28, icu: 6, emergency: 8, total: 200 },
    icuBeds: { available: 6, total: 24 }, waitTime: 22,
    specialists: ["General Physician", "Cardiologist", "Gynecologist", "Orthopedic Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "Blood Bank", "X-Ray", "CT Scan"],
    insuranceAccepted: ["Star Health", "Bajaj Allianz", "Ayushman Bharat"],
    score: 79, isDemoData: true,
  },
  {
    id: 59, name: "Narayana Hospital Gurugram", city: "New Delhi", state: "Delhi",
    type: "Multi-Specialty", address: "Sector 55, DLF Phase 5, Gurugram – 122011",
    lat: 28.4255, lng: 77.0900, distance: 0, eta: 0, rating: 4.5, reviewCount: 1876,
    phone: "+91-124-4511111", emergency: true, emergencyPhone: "+91-124-4511111",
    beds: { general: 38, icu: 9, emergency: 12, total: 380 },
    icuBeds: { available: 9, total: 36 }, waitTime: 22,
    specialists: ["Cardiologist", "Cardiac Surgeon", "Neurologist", "Orthopedic Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "Cath Lab", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Aditya Birla"],
    score: 87, isDemoData: true,
  },
  {
    id: 60, name: "Aster CMI Hospital Bengaluru", city: "Bengaluru", state: "Karnataka",
    type: "Multi-Specialty", address: "New Airport Road, Hebbal, Bengaluru – 560092",
    lat: 13.0480, lng: 77.5921, distance: 0, eta: 0, rating: 4.6, reviewCount: 2345,
    phone: "+91-80-48343434", emergency: true, emergencyPhone: "+91-80-48343434",
    beds: { general: 42, icu: 10, emergency: 14, total: 480 },
    icuBeds: { available: 10, total: 40 }, waitTime: 20,
    specialists: ["Cardiologist", "Neurologist", "Oncologist", "Orthopedic Surgeon"],
    blood: blood(), facilities: ["Emergency", "ICU", "NICU", "Cath Lab", "MRI", "Blood Bank"],
    insuranceAccepted: ["Star Health", "HDFC ERGO", "Niva Bupa"],
    score: 90, isDemoData: true,
  },
];

// ─── DISTANCE UTILITIES ───────────────────────────────────────────────────────
export function calcDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function etaMinutes(distanceKm) {
  // Assume 30 km/h average city speed
  return Math.round((distanceKm / 30) * 60);
}

export function hospitalsNearLocation(lat, lon, hospitals = HOSPITALS) {
  return hospitals
    .map(h => ({
      ...h,
      distance: parseFloat(calcDistanceKm(lat, lon, h.lat, h.lng).toFixed(1)),
      eta: etaMinutes(calcDistanceKm(lat, lon, h.lat, h.lng)),
    }))
    .sort((a, b) => a.distance - b.distance);
}

// City → approx coords for fallback city selection
export const CITY_COORDS = {
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Nagpur": { lat: 21.1458, lng: 79.0882 },
  "Nashik": { lat: 20.0059, lng: 73.7897 },
  "Thane": { lat: 19.2183, lng: 72.9781 },
  "Navi Mumbai": { lat: 19.0330, lng: 73.0297 },
  "Chhatrapati Sambhajinagar": { lat: 19.8762, lng: 75.3433 },
  "Kolhapur": { lat: 16.7050, lng: 74.2433 },
  "Solapur": { lat: 17.6804, lng: 75.9064 },
  "New Delhi": { lat: 28.6139, lng: 77.2090 },
  "Delhi": { lat: 28.7041, lng: 77.1025 },
  "Bengaluru": { lat: 12.9716, lng: 77.5946 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Surat": { lat: 21.1702, lng: 72.8311 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Kochi": { lat: 9.9312, lng: 76.2673 },
  "Lucknow": { lat: 26.8467, lng: 80.9462 },
  "Chandigarh": { lat: 30.7333, lng: 76.7794 },
  "Bhubaneswar": { lat: 20.2961, lng: 85.8245 },
  "Coimbatore": { lat: 11.0168, lng: 76.9558 },
  "Indore": { lat: 22.7196, lng: 75.8577 },
  "Bhopal": { lat: 23.2599, lng: 77.4126 },
  "Visakhapatnam": { lat: 17.6868, lng: 83.2185 },
};

// ─── DOCTORS ─────────────────────────────────────────────────────────────────
// All doctor profiles are fictional demo data created for prototype purposes.
// These do NOT represent real doctors at real hospitals.
export const DOCTORS = [
  {
    "id": 1,
    "name": "Dr. Aarav Mehta",
    "specialization": "Cardiologist",
    "hospital": "Demo Affiliation: Kokilaben Dhirubhai Ambani Hospital",
    "hospitalId": 1,
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 8,
    "qualification": "MBBS, MD/MS Cardiologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 400,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 2,
    "name": "Dr. Priya Iyer",
    "specialization": "Neurologist",
    "hospital": "Demo Affiliation: Lilavati Hospital",
    "hospitalId": 2,
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 11,
    "qualification": "MBBS, MD/MS Neurologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 550,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 3,
    "name": "Dr. Rohan Desai",
    "specialization": "Neurosurgeon",
    "hospital": "Demo Affiliation: Hinduja Hospital",
    "hospitalId": 3,
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 14,
    "qualification": "MBBS, MD/MS Neurosurgeon – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 700,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 4,
    "name": "Dr. Neha Kulkarni",
    "specialization": "Orthopedic Surgeon",
    "hospital": "Demo Affiliation: KEM Hospital",
    "hospitalId": 4,
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 17,
    "qualification": "MBBS, MD/MS Orthopedic Surgeon – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 850,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 5,
    "name": "Dr. Sanjay Patil",
    "specialization": "General Physician",
    "hospital": "Demo Affiliation: Kokilaben Dhirubhai Ambani Hospital",
    "hospitalId": 5,
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 20,
    "qualification": "MBBS, MD/MS General Physician – Demo Medical College",
    "rating": 4.9,
    "consultationFee": 1000,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 6,
    "name": "Dr. Meenakshi Joshi",
    "specialization": "Pediatrician",
    "hospital": "Demo Affiliation: Lilavati Hospital",
    "hospitalId": 6,
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 8,
    "qualification": "MBBS, MD/MS Pediatrician – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1150,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 7,
    "name": "Dr. Meenakshi Shah",
    "specialization": "Orthopedic Surgeon",
    "hospital": "Demo Affiliation: Ruby Hall Clinic",
    "hospitalId": 6,
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 9,
    "qualification": "MBBS, MD/MS Orthopedic Surgeon – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 450,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 8,
    "name": "Dr. Vikram Bhosale",
    "specialization": "General Physician",
    "hospital": "Demo Affiliation: Jehangir Hospital",
    "hospitalId": 7,
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 12,
    "qualification": "MBBS, MD/MS General Physician – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 600,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 9,
    "name": "Dr. Anjali Waghmare",
    "specialization": "Pediatrician",
    "hospital": "Demo Affiliation: Deenanath Mangeshkar Hospital",
    "hospitalId": 8,
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 15,
    "qualification": "MBBS, MD/MS Pediatrician – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 750,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 10,
    "name": "Dr. Rahul Deshpande",
    "specialization": "Gynecologist",
    "hospital": "Demo Affiliation: Sahyadri Hospitals",
    "hospitalId": 9,
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 18,
    "qualification": "MBBS, MD/MS Gynecologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 900,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 11,
    "name": "Dr. Sunita Gokhale",
    "specialization": "Dermatologist",
    "hospital": "Demo Affiliation: Ruby Hall Clinic",
    "hospitalId": 10,
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 21,
    "qualification": "MBBS, MD/MS Dermatologist – Demo Medical College",
    "rating": 4.9,
    "consultationFee": 1050,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 12,
    "name": "Dr. Abhijit Kale",
    "specialization": "ENT Specialist",
    "hospital": "Demo Affiliation: Jehangir Hospital",
    "hospitalId": 11,
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 9,
    "qualification": "MBBS, MD/MS ENT Specialist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1200,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 13,
    "name": "Dr. Abhijit Sathe",
    "specialization": "Gynecologist",
    "hospital": "Demo Affiliation: AIIMS Nagpur",
    "hospitalId": 11,
    "city": "Nagpur",
    "state": "Maharashtra",
    "experience": 10,
    "qualification": "MBBS, MD/MS Gynecologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 500,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 14,
    "name": "Dr. Sneha Bawankar",
    "specialization": "Dermatologist",
    "hospital": "Demo Affiliation: Wockhardt Hospital Nagpur",
    "hospitalId": 12,
    "city": "Nagpur",
    "state": "Maharashtra",
    "experience": 13,
    "qualification": "MBBS, MD/MS Dermatologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 650,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 15,
    "name": "Dr. Ganesh Nimkar",
    "specialization": "ENT Specialist",
    "hospital": "Demo Affiliation: Lata Mangeshkar Hospital",
    "hospitalId": 13,
    "city": "Nagpur",
    "state": "Maharashtra",
    "experience": 16,
    "qualification": "MBBS, MD/MS ENT Specialist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 800,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 16,
    "name": "Dr. Madhuri Chitnis",
    "specialization": "Ophthalmologist",
    "hospital": "Demo Affiliation: AIIMS Nagpur",
    "hospitalId": 14,
    "city": "Nagpur",
    "state": "Maharashtra",
    "experience": 19,
    "qualification": "MBBS, MD/MS Ophthalmologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 950,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 17,
    "name": "Dr. Kavya Gupta",
    "specialization": "Ophthalmologist",
    "hospital": "Demo Affiliation: Sahyadri Specialty Hospital Nashik",
    "hospitalId": 16,
    "city": "Nashik",
    "state": "Maharashtra",
    "experience": 11,
    "qualification": "MBBS, MD/MS Ophthalmologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 550,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 18,
    "name": "Dr. Rajeev Singh",
    "specialization": "Gastroenterologist",
    "hospital": "Demo Affiliation: Apollo Hospitals Nashik",
    "hospitalId": 17,
    "city": "Nashik",
    "state": "Maharashtra",
    "experience": 14,
    "qualification": "MBBS, MD/MS Gastroenterologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 700,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 19,
    "name": "Dr. Aakash Jain",
    "specialization": "Pulmonologist",
    "hospital": "Demo Affiliation: Sahyadri Specialty Hospital Nashik",
    "hospitalId": 18,
    "city": "Nashik",
    "state": "Maharashtra",
    "experience": 17,
    "qualification": "MBBS, MD/MS Pulmonologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 850,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 20,
    "name": "Dr. Shruti Saxena",
    "specialization": "Nephrologist",
    "hospital": "Demo Affiliation: Apollo Hospitals Nashik",
    "hospitalId": 19,
    "city": "Nashik",
    "state": "Maharashtra",
    "experience": 20,
    "qualification": "MBBS, MD/MS Nephrologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 1000,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 21,
    "name": "Dr. Arjun Subramanian",
    "specialization": "Nephrologist",
    "hospital": "Demo Affiliation: Jupiter Hospital Thane",
    "hospitalId": 21,
    "city": "Thane",
    "state": "Maharashtra",
    "experience": 12,
    "qualification": "MBBS, MD/MS Nephrologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 600,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 22,
    "name": "Dr. Pooja Krishnan",
    "specialization": "Urologist",
    "hospital": "Demo Affiliation: Horizon Hospital Thane",
    "hospitalId": 22,
    "city": "Thane",
    "state": "Maharashtra",
    "experience": 15,
    "qualification": "MBBS, MD/MS Urologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 750,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 23,
    "name": "Dr. Rajesh Murugan",
    "specialization": "Oncologist",
    "hospital": "Demo Affiliation: Jupiter Hospital Thane",
    "hospitalId": 23,
    "city": "Thane",
    "state": "Maharashtra",
    "experience": 18,
    "qualification": "MBBS, MD/MS Oncologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 900,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 24,
    "name": "Dr. Kavita Sundaram",
    "specialization": "Psychiatrist",
    "hospital": "Demo Affiliation: Horizon Hospital Thane",
    "hospitalId": 24,
    "city": "Thane",
    "state": "Maharashtra",
    "experience": 21,
    "qualification": "MBBS, MD/MS Psychiatrist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 1050,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 25,
    "name": "Dr. Ananya Ghosh",
    "specialization": "Psychiatrist",
    "hospital": "Demo Affiliation: Apollo Hospitals Navi Mumbai",
    "hospitalId": 26,
    "city": "Navi Mumbai",
    "state": "Maharashtra",
    "experience": 13,
    "qualification": "MBBS, MD/MS Psychiatrist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 650,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 26,
    "name": "Dr. Vikas Patel",
    "specialization": "Endocrinologist",
    "hospital": "Demo Affiliation: MGM Hospital Vashi",
    "hospitalId": 27,
    "city": "Navi Mumbai",
    "state": "Maharashtra",
    "experience": 16,
    "qualification": "MBBS, MD/MS Endocrinologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 800,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 27,
    "name": "Dr. Nidhi Agarwal",
    "specialization": "General Surgeon",
    "hospital": "Demo Affiliation: Apollo Hospitals Navi Mumbai",
    "hospitalId": 28,
    "city": "Navi Mumbai",
    "state": "Maharashtra",
    "experience": 19,
    "qualification": "MBBS, MD/MS General Surgeon – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 950,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 28,
    "name": "Dr. Karthik Thomas",
    "specialization": "Emergency Medicine",
    "hospital": "Demo Affiliation: MGM Hospital Vashi",
    "hospitalId": 29,
    "city": "Navi Mumbai",
    "state": "Maharashtra",
    "experience": 22,
    "qualification": "MBBS, MD/MS Emergency Medicine – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 1100,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 29,
    "name": "Dr. Prashanth Rath",
    "specialization": "Emergency Medicine",
    "hospital": "Demo Affiliation: MGM Medical College & Hospital",
    "hospitalId": 31,
    "city": "Chhatrapati Sambhajinagar",
    "state": "Maharashtra",
    "experience": 14,
    "qualification": "MBBS, MD/MS Emergency Medicine – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 700,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 30,
    "name": "Dr. Deepa Chouksey",
    "specialization": "Cardiologist",
    "hospital": "Demo Affiliation: United CIIGMA Hospital",
    "hospitalId": 32,
    "city": "Chhatrapati Sambhajinagar",
    "state": "Maharashtra",
    "experience": 17,
    "qualification": "MBBS, MD/MS Cardiologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 850,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 31,
    "name": "Dr. Balaji Tiwari",
    "specialization": "Neurologist",
    "hospital": "Demo Affiliation: MGM Medical College & Hospital",
    "hospitalId": 33,
    "city": "Chhatrapati Sambhajinagar",
    "state": "Maharashtra",
    "experience": 20,
    "qualification": "MBBS, MD/MS Neurologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 1000,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 32,
    "name": "Dr. Revathi Murthy",
    "specialization": "Neurosurgeon",
    "hospital": "Demo Affiliation: United CIIGMA Hospital",
    "hospitalId": 34,
    "city": "Chhatrapati Sambhajinagar",
    "state": "Maharashtra",
    "experience": 8,
    "qualification": "MBBS, MD/MS Neurosurgeon – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 1150,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 33,
    "name": "Dr. Padmavathi Pillai",
    "specialization": "Neurosurgeon",
    "hospital": "Demo Affiliation: Apple Saraswati Hospital",
    "hospitalId": 36,
    "city": "Kolhapur",
    "state": "Maharashtra",
    "experience": 15,
    "qualification": "MBBS, MD/MS Neurosurgeon – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 750,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 34,
    "name": "Dr. Srinivas More",
    "specialization": "Orthopedic Surgeon",
    "hospital": "Demo Affiliation: Aster Aadhar Hospital",
    "hospitalId": 37,
    "city": "Kolhapur",
    "state": "Maharashtra",
    "experience": 18,
    "qualification": "MBBS, MD/MS Orthopedic Surgeon – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 900,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 35,
    "name": "Dr. Padmaja Gaikwad",
    "specialization": "General Physician",
    "hospital": "Demo Affiliation: Apple Saraswati Hospital",
    "hospitalId": 38,
    "city": "Kolhapur",
    "state": "Maharashtra",
    "experience": 21,
    "qualification": "MBBS, MD/MS General Physician – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 1050,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 36,
    "name": "Dr. Venkat Sawant",
    "specialization": "Pediatrician",
    "hospital": "Demo Affiliation: Aster Aadhar Hospital",
    "hospitalId": 39,
    "city": "Kolhapur",
    "state": "Maharashtra",
    "experience": 9,
    "qualification": "MBBS, MD/MS Pediatrician – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 1200,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 37,
    "name": "Dr. Subrata Banerjee",
    "specialization": "Pediatrician",
    "hospital": "Demo Affiliation: Ashwini Sahakari Rughnalaya",
    "hospitalId": 41,
    "city": "Solapur",
    "state": "Maharashtra",
    "experience": 16,
    "qualification": "MBBS, MD/MS Pediatrician – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 800,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 38,
    "name": "Dr. Moumita Gowda",
    "specialization": "Gynecologist",
    "hospital": "Demo Affiliation: Solapur General Hospital",
    "hospitalId": 42,
    "city": "Solapur",
    "state": "Maharashtra",
    "experience": 19,
    "qualification": "MBBS, MD/MS Gynecologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 950,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 39,
    "name": "Dr. Haresh Chikhalkar",
    "specialization": "Dermatologist",
    "hospital": "Demo Affiliation: Ashwini Sahakari Rughnalaya",
    "hospitalId": 43,
    "city": "Solapur",
    "state": "Maharashtra",
    "experience": 22,
    "qualification": "MBBS, MD/MS Dermatologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 1100,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 40,
    "name": "Dr. Geeta Rathi",
    "specialization": "ENT Specialist",
    "hospital": "Demo Affiliation: Solapur General Hospital",
    "hospitalId": 44,
    "city": "Solapur",
    "state": "Maharashtra",
    "experience": 10,
    "qualification": "MBBS, MD/MS ENT Specialist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 1250,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 41,
    "name": "Dr. Suman Dutta",
    "specialization": "ENT Specialist",
    "hospital": "Demo Affiliation: Apollo Hospitals Chennai",
    "hospitalId": 46,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 17,
    "qualification": "MBBS, MD/MS ENT Specialist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 850,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 42,
    "name": "Dr. Anoop Mehta",
    "specialization": "Ophthalmologist",
    "hospital": "Demo Affiliation: CMC Vellore — Chennai OPD",
    "hospitalId": 47,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 20,
    "qualification": "MBBS, MD/MS Ophthalmologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 1000,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 43,
    "name": "Dr. Preethi Iyer",
    "specialization": "Gastroenterologist",
    "hospital": "Demo Affiliation: MGM Healthcare Chennai",
    "hospitalId": 48,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 8,
    "qualification": "MBBS, MD/MS Gastroenterologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 1150,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 44,
    "name": "Dr. Ramesh Desai",
    "specialization": "Pulmonologist",
    "hospital": "Demo Affiliation: Apollo Hospitals Chennai",
    "hospitalId": 49,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 11,
    "qualification": "MBBS, MD/MS Pulmonologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 400,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 45,
    "name": "Dr. Shalini Kulkarni",
    "specialization": "Nephrologist",
    "hospital": "Demo Affiliation: CMC Vellore — Chennai OPD",
    "hospitalId": 50,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 14,
    "qualification": "MBBS, MD/MS Nephrologist – Demo Medical College",
    "rating": 4.9,
    "consultationFee": 550,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 46,
    "name": "Dr. Gurpreet Patil",
    "specialization": "Urologist",
    "hospital": "Demo Affiliation: MGM Healthcare Chennai",
    "hospitalId": 51,
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 17,
    "qualification": "MBBS, MD/MS Urologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 700,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 47,
    "name": "Dr. Gurpreet Nair",
    "specialization": "Pulmonologist",
    "hospital": "Demo Affiliation: KMCH Coimbatore",
    "hospitalId": 51,
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "experience": 18,
    "qualification": "MBBS, MD/MS Pulmonologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 900,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 48,
    "name": "Dr. Navneet Shah",
    "specialization": "Nephrologist",
    "hospital": "Demo Affiliation: GKNM Hospital Coimbatore",
    "hospitalId": 52,
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "experience": 21,
    "qualification": "MBBS, MD/MS Nephrologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 1050,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 49,
    "name": "Dr. Biswajit Bhosale",
    "specialization": "Urologist",
    "hospital": "Demo Affiliation: KMCH Coimbatore",
    "hospitalId": 53,
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "experience": 9,
    "qualification": "MBBS, MD/MS Urologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 1200,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 50,
    "name": "Dr. Anil Waghmare",
    "specialization": "Oncologist",
    "hospital": "Demo Affiliation: GKNM Hospital Coimbatore",
    "hospitalId": 54,
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "experience": 12,
    "qualification": "MBBS, MD/MS Oncologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 450,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 51,
    "name": "Dr. Sreedhar Pawar",
    "specialization": "Oncologist",
    "hospital": "Demo Affiliation: Apollo Speciality Hospital Madurai",
    "hospitalId": 56,
    "city": "Madurai",
    "state": "Tamil Nadu",
    "experience": 19,
    "qualification": "MBBS, MD/MS Oncologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 950,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 52,
    "name": "Dr. Uma Sathe",
    "specialization": "Psychiatrist",
    "hospital": "Demo Affiliation: Meenakshi Mission Hospital",
    "hospitalId": 57,
    "city": "Madurai",
    "state": "Tamil Nadu",
    "experience": 22,
    "qualification": "MBBS, MD/MS Psychiatrist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 1100,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 53,
    "name": "Dr. Ranjit Bawankar",
    "specialization": "Endocrinologist",
    "hospital": "Demo Affiliation: Apollo Speciality Hospital Madurai",
    "hospitalId": 58,
    "city": "Madurai",
    "state": "Tamil Nadu",
    "experience": 10,
    "qualification": "MBBS, MD/MS Endocrinologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 1250,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 54,
    "name": "Dr. Fatima Nimkar",
    "specialization": "General Surgeon",
    "hospital": "Demo Affiliation: Meenakshi Mission Hospital",
    "hospitalId": 59,
    "city": "Madurai",
    "state": "Tamil Nadu",
    "experience": 13,
    "qualification": "MBBS, MD/MS General Surgeon – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 500,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 55,
    "name": "Dr. Archana Kapoor",
    "specialization": "General Surgeon",
    "hospital": "Demo Affiliation: Kauvery Hospital Trichy",
    "hospitalId": 61,
    "city": "Tiruchirappalli",
    "state": "Tamil Nadu",
    "experience": 20,
    "qualification": "MBBS, MD/MS General Surgeon – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1000,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 56,
    "name": "Dr. Nilesh Gupta",
    "specialization": "Emergency Medicine",
    "hospital": "Demo Affiliation: Frontier Lifeline Hospital",
    "hospitalId": 62,
    "city": "Tiruchirappalli",
    "state": "Tamil Nadu",
    "experience": 8,
    "qualification": "MBBS, MD/MS Emergency Medicine – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 1150,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 57,
    "name": "Dr. Preeti Singh",
    "specialization": "Cardiologist",
    "hospital": "Demo Affiliation: Kauvery Hospital Trichy",
    "hospitalId": 63,
    "city": "Tiruchirappalli",
    "state": "Tamil Nadu",
    "experience": 11,
    "qualification": "MBBS, MD/MS Cardiologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 400,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 58,
    "name": "Dr. Kedar Jain",
    "specialization": "Neurologist",
    "hospital": "Demo Affiliation: Frontier Lifeline Hospital",
    "hospitalId": 64,
    "city": "Tiruchirappalli",
    "state": "Tamil Nadu",
    "experience": 14,
    "qualification": "MBBS, MD/MS Neurologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 550,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 59,
    "name": "Dr. Neeraj Kumar",
    "specialization": "Neurologist",
    "hospital": "Demo Affiliation: Aster Medcity Kochi",
    "hospitalId": 66,
    "city": "Kochi",
    "state": "Kerala",
    "experience": 21,
    "qualification": "MBBS, MD/MS Neurologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1050,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 60,
    "name": "Dr. Meera Subramanian",
    "specialization": "Neurosurgeon",
    "hospital": "Demo Affiliation: Amrita Hospital Kochi",
    "hospitalId": 67,
    "city": "Kochi",
    "state": "Kerala",
    "experience": 9,
    "qualification": "MBBS, MD/MS Neurosurgeon – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 1200,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 61,
    "name": "Dr. Bhaskar Krishnan",
    "specialization": "Orthopedic Surgeon",
    "hospital": "Demo Affiliation: Medical Trust Hospital",
    "hospitalId": 68,
    "city": "Kochi",
    "state": "Kerala",
    "experience": 12,
    "qualification": "MBBS, MD/MS Orthopedic Surgeon – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 450,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 62,
    "name": "Dr. Himanshu Murugan",
    "specialization": "General Physician",
    "hospital": "Demo Affiliation: Aster Medcity Kochi",
    "hospitalId": 69,
    "city": "Kochi",
    "state": "Kerala",
    "experience": 15,
    "qualification": "MBBS, MD/MS General Physician – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 600,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 63,
    "name": "Dr. Swati Sundaram",
    "specialization": "Pediatrician",
    "hospital": "Demo Affiliation: Amrita Hospital Kochi",
    "hospitalId": 70,
    "city": "Kochi",
    "state": "Kerala",
    "experience": 18,
    "qualification": "MBBS, MD/MS Pediatrician – Demo Medical College",
    "rating": 4.9,
    "consultationFee": 750,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 64,
    "name": "Dr. Tejpal Rao",
    "specialization": "Gynecologist",
    "hospital": "Demo Affiliation: Medical Trust Hospital",
    "hospitalId": 71,
    "city": "Kochi",
    "state": "Kerala",
    "experience": 21,
    "qualification": "MBBS, MD/MS Gynecologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 900,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 65,
    "name": "Dr. Tejpal Biswas",
    "specialization": "General Physician",
    "hospital": "Demo Affiliation: KIMSHEALTH Trivandrum",
    "hospitalId": 71,
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "experience": 22,
    "qualification": "MBBS, MD/MS General Physician – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1100,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 66,
    "name": "Dr. Kamala Ghosh",
    "specialization": "Pediatrician",
    "hospital": "Demo Affiliation: GG Hospital Trivandrum",
    "hospitalId": 72,
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "experience": 10,
    "qualification": "MBBS, MD/MS Pediatrician – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 1250,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 67,
    "name": "Dr. Rakesh Patel",
    "specialization": "Gynecologist",
    "hospital": "Demo Affiliation: KIMSHEALTH Trivandrum",
    "hospitalId": 73,
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "experience": 13,
    "qualification": "MBBS, MD/MS Gynecologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 500,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 68,
    "name": "Dr. Sarika Agarwal",
    "specialization": "Dermatologist",
    "hospital": "Demo Affiliation: GG Hospital Trivandrum",
    "hospitalId": 74,
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "experience": 16,
    "qualification": "MBBS, MD/MS Dermatologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 650,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 69,
    "name": "Dr. Shilpa Kaur",
    "specialization": "Dermatologist",
    "hospital": "Demo Affiliation: Aster MIMS Calicut",
    "hospitalId": 76,
    "city": "Kozhikode",
    "state": "Kerala",
    "experience": 8,
    "qualification": "MBBS, MD/MS Dermatologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1150,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 70,
    "name": "Dr. Anand Rath",
    "specialization": "ENT Specialist",
    "hospital": "Demo Affiliation: Baby Memorial Hospital Kozhikode",
    "hospitalId": 77,
    "city": "Kozhikode",
    "state": "Kerala",
    "experience": 11,
    "qualification": "MBBS, MD/MS ENT Specialist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 400,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 71,
    "name": "Dr. Vignesh Chouksey",
    "specialization": "Ophthalmologist",
    "hospital": "Demo Affiliation: Aster MIMS Calicut",
    "hospitalId": 78,
    "city": "Kozhikode",
    "state": "Kerala",
    "experience": 14,
    "qualification": "MBBS, MD/MS Ophthalmologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 550,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 72,
    "name": "Dr. Divya Tiwari",
    "specialization": "Gastroenterologist",
    "hospital": "Demo Affiliation: Baby Memorial Hospital Kozhikode",
    "hospitalId": 79,
    "city": "Kozhikode",
    "state": "Kerala",
    "experience": 17,
    "qualification": "MBBS, MD/MS Gastroenterologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 700,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 73,
    "name": "Dr. Aarav Khan",
    "specialization": "Gastroenterologist",
    "hospital": "Demo Affiliation: Amala Institute of Medical Sciences",
    "hospitalId": 81,
    "city": "Thrissur",
    "state": "Kerala",
    "experience": 9,
    "qualification": "MBBS, MD/MS Gastroenterologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1200,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 74,
    "name": "Dr. Priya Pillai",
    "specialization": "Pulmonologist",
    "hospital": "Demo Affiliation: Jubilee Mission Hospital",
    "hospitalId": 82,
    "city": "Thrissur",
    "state": "Kerala",
    "experience": 12,
    "qualification": "MBBS, MD/MS Pulmonologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 450,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 75,
    "name": "Dr. Rohan More",
    "specialization": "Nephrologist",
    "hospital": "Demo Affiliation: Amala Institute of Medical Sciences",
    "hospitalId": 83,
    "city": "Thrissur",
    "state": "Kerala",
    "experience": 15,
    "qualification": "MBBS, MD/MS Nephrologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 600,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 76,
    "name": "Dr. Neha Gaikwad",
    "specialization": "Urologist",
    "hospital": "Demo Affiliation: Jubilee Mission Hospital",
    "hospitalId": 84,
    "city": "Thrissur",
    "state": "Kerala",
    "experience": 18,
    "qualification": "MBBS, MD/MS Urologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 750,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 77,
    "name": "Dr. Meenakshi Venkatesan",
    "specialization": "Urologist",
    "hospital": "Demo Affiliation: Caritas Hospital Kottayam",
    "hospitalId": 86,
    "city": "Kottayam",
    "state": "Kerala",
    "experience": 10,
    "qualification": "MBBS, MD/MS Urologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1250,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 78,
    "name": "Dr. Vikram Banerjee",
    "specialization": "Oncologist",
    "hospital": "Demo Affiliation: Bharat Hospital Kottayam",
    "hospitalId": 87,
    "city": "Kottayam",
    "state": "Kerala",
    "experience": 13,
    "qualification": "MBBS, MD/MS Oncologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 500,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 79,
    "name": "Dr. Anjali Gowda",
    "specialization": "Psychiatrist",
    "hospital": "Demo Affiliation: Caritas Hospital Kottayam",
    "hospitalId": 88,
    "city": "Kottayam",
    "state": "Kerala",
    "experience": 16,
    "qualification": "MBBS, MD/MS Psychiatrist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 650,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 80,
    "name": "Dr. Rahul Chikhalkar",
    "specialization": "Endocrinologist",
    "hospital": "Demo Affiliation: Bharat Hospital Kottayam",
    "hospitalId": 89,
    "city": "Kottayam",
    "state": "Kerala",
    "experience": 19,
    "qualification": "MBBS, MD/MS Endocrinologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 800,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 81,
    "name": "Dr. Abhijit Nambiar",
    "specialization": "Endocrinologist",
    "hospital": "Demo Affiliation: Yashoda Hospitals Secunderabad",
    "hospitalId": 91,
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 11,
    "qualification": "MBBS, MD/MS Endocrinologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 400,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 82,
    "name": "Dr. Sneha Dutta",
    "specialization": "General Surgeon",
    "hospital": "Demo Affiliation: Apollo Hospitals Jubilee Hills",
    "hospitalId": 92,
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 14,
    "qualification": "MBBS, MD/MS General Surgeon – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 550,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 83,
    "name": "Dr. Ganesh Mehta",
    "specialization": "Emergency Medicine",
    "hospital": "Demo Affiliation: NIMS Hyderabad",
    "hospitalId": 93,
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 17,
    "qualification": "MBBS, MD/MS Emergency Medicine – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 700,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 84,
    "name": "Dr. Madhuri Iyer",
    "specialization": "Cardiologist",
    "hospital": "Demo Affiliation: Yashoda Hospitals Secunderabad",
    "hospitalId": 94,
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 20,
    "qualification": "MBBS, MD/MS Cardiologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 850,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 85,
    "name": "Dr. Vinayak Desai",
    "specialization": "Neurologist",
    "hospital": "Demo Affiliation: Apollo Hospitals Jubilee Hills",
    "hospitalId": 95,
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 8,
    "qualification": "MBBS, MD/MS Neurologist – Demo Medical College",
    "rating": 4.9,
    "consultationFee": 1000,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 86,
    "name": "Dr. Kavya Kulkarni",
    "specialization": "Neurosurgeon",
    "hospital": "Demo Affiliation: NIMS Hyderabad",
    "hospitalId": 96,
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 11,
    "qualification": "MBBS, MD/MS Neurosurgeon – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1150,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 87,
    "name": "Dr. Kavya Joshi",
    "specialization": "Cardiologist",
    "hospital": "Demo Affiliation: Kakatiya Medical College Hospital",
    "hospitalId": 96,
    "city": "Warangal",
    "state": "Telangana",
    "experience": 12,
    "qualification": "MBBS, MD/MS Cardiologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 450,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 88,
    "name": "Dr. Rajeev Nair",
    "specialization": "Neurologist",
    "hospital": "Demo Affiliation: Maxcare Hospital Warangal",
    "hospitalId": 97,
    "city": "Warangal",
    "state": "Telangana",
    "experience": 15,
    "qualification": "MBBS, MD/MS Neurologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 600,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 89,
    "name": "Dr. Aakash Shah",
    "specialization": "Neurosurgeon",
    "hospital": "Demo Affiliation: Kakatiya Medical College Hospital",
    "hospitalId": 98,
    "city": "Warangal",
    "state": "Telangana",
    "experience": 18,
    "qualification": "MBBS, MD/MS Neurosurgeon – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 750,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 90,
    "name": "Dr. Shruti Bhosale",
    "specialization": "Orthopedic Surgeon",
    "hospital": "Demo Affiliation: Maxcare Hospital Warangal",
    "hospitalId": 99,
    "city": "Warangal",
    "state": "Telangana",
    "experience": 21,
    "qualification": "MBBS, MD/MS Orthopedic Surgeon – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 900,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 91,
    "name": "Dr. Arjun Kale",
    "specialization": "Orthopedic Surgeon",
    "hospital": "Demo Affiliation: Narayana Health City",
    "hospitalId": 101,
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 13,
    "qualification": "MBBS, MD/MS Orthopedic Surgeon – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 500,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 92,
    "name": "Dr. Pooja Pawar",
    "specialization": "General Physician",
    "hospital": "Demo Affiliation: Manipal Hospital HAL Road",
    "hospitalId": 102,
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 16,
    "qualification": "MBBS, MD/MS General Physician – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 650,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 93,
    "name": "Dr. Rajesh Sathe",
    "specialization": "Pediatrician",
    "hospital": "Demo Affiliation: Fortis Hospital Cunningham Road",
    "hospitalId": 103,
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 19,
    "qualification": "MBBS, MD/MS Pediatrician – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 800,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 94,
    "name": "Dr. Kavita Bawankar",
    "specialization": "Gynecologist",
    "hospital": "Demo Affiliation: Narayana Health City",
    "hospitalId": 104,
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 22,
    "qualification": "MBBS, MD/MS Gynecologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 950,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 95,
    "name": "Dr. Suresh Nimkar",
    "specialization": "Dermatologist",
    "hospital": "Demo Affiliation: Manipal Hospital HAL Road",
    "hospitalId": 105,
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 10,
    "qualification": "MBBS, MD/MS Dermatologist – Demo Medical College",
    "rating": 4.9,
    "consultationFee": 1100,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 96,
    "name": "Dr. Ananya Chitnis",
    "specialization": "ENT Specialist",
    "hospital": "Demo Affiliation: Fortis Hospital Cunningham Road",
    "hospitalId": 106,
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 13,
    "qualification": "MBBS, MD/MS ENT Specialist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1250,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 97,
    "name": "Dr. Ananya Verma",
    "specialization": "Gynecologist",
    "hospital": "Demo Affiliation: Apollo BGS Hospital Mysuru",
    "hospitalId": 106,
    "city": "Mysuru",
    "state": "Karnataka",
    "experience": 14,
    "qualification": "MBBS, MD/MS Gynecologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 550,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 98,
    "name": "Dr. Vikas Kapoor",
    "specialization": "Dermatologist",
    "hospital": "Demo Affiliation: JSS Hospital Mysuru",
    "hospitalId": 107,
    "city": "Mysuru",
    "state": "Karnataka",
    "experience": 17,
    "qualification": "MBBS, MD/MS Dermatologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 700,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 99,
    "name": "Dr. Nidhi Gupta",
    "specialization": "ENT Specialist",
    "hospital": "Demo Affiliation: Apollo BGS Hospital Mysuru",
    "hospitalId": 108,
    "city": "Mysuru",
    "state": "Karnataka",
    "experience": 20,
    "qualification": "MBBS, MD/MS ENT Specialist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 850,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 100,
    "name": "Dr. Karthik Singh",
    "specialization": "Ophthalmologist",
    "hospital": "Demo Affiliation: JSS Hospital Mysuru",
    "hospitalId": 109,
    "city": "Mysuru",
    "state": "Karnataka",
    "experience": 8,
    "qualification": "MBBS, MD/MS Ophthalmologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 1000,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 101,
    "name": "Dr. Prashanth Reddy",
    "specialization": "Ophthalmologist",
    "hospital": "Demo Affiliation: KMC Hospital Mangaluru",
    "hospitalId": 111,
    "city": "Mangaluru",
    "state": "Karnataka",
    "experience": 15,
    "qualification": "MBBS, MD/MS Ophthalmologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 600,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 102,
    "name": "Dr. Deepa Kumar",
    "specialization": "Gastroenterologist",
    "hospital": "Demo Affiliation: AJ Hospital & Research Centre",
    "hospitalId": 112,
    "city": "Mangaluru",
    "state": "Karnataka",
    "experience": 18,
    "qualification": "MBBS, MD/MS Gastroenterologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 750,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 103,
    "name": "Dr. Balaji Subramanian",
    "specialization": "Pulmonologist",
    "hospital": "Demo Affiliation: KMC Hospital Mangaluru",
    "hospitalId": 113,
    "city": "Mangaluru",
    "state": "Karnataka",
    "experience": 21,
    "qualification": "MBBS, MD/MS Pulmonologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 900,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 104,
    "name": "Dr. Revathi Krishnan",
    "specialization": "Nephrologist",
    "hospital": "Demo Affiliation: AJ Hospital & Research Centre",
    "hospitalId": 114,
    "city": "Mangaluru",
    "state": "Karnataka",
    "experience": 9,
    "qualification": "MBBS, MD/MS Nephrologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 1050,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 105,
    "name": "Dr. Padmavathi Ramaiah",
    "specialization": "Nephrologist",
    "hospital": "Demo Affiliation: AIIMS New Delhi",
    "hospitalId": 116,
    "city": "New Delhi",
    "state": "Delhi",
    "experience": 16,
    "qualification": "MBBS, MD/MS Nephrologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 650,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 106,
    "name": "Dr. Srinivas Biswas",
    "specialization": "Urologist",
    "hospital": "Demo Affiliation: Max Super Speciality Saket",
    "hospitalId": 117,
    "city": "New Delhi",
    "state": "Delhi",
    "experience": 19,
    "qualification": "MBBS, MD/MS Urologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 800,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 107,
    "name": "Dr. Padmaja Ghosh",
    "specialization": "Oncologist",
    "hospital": "Demo Affiliation: Sir Ganga Ram Hospital",
    "hospitalId": 118,
    "city": "New Delhi",
    "state": "Delhi",
    "experience": 22,
    "qualification": "MBBS, MD/MS Oncologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 950,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 108,
    "name": "Dr. Venkat Patel",
    "specialization": "Psychiatrist",
    "hospital": "Demo Affiliation: AIIMS New Delhi",
    "hospitalId": 119,
    "city": "New Delhi",
    "state": "Delhi",
    "experience": 10,
    "qualification": "MBBS, MD/MS Psychiatrist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 1100,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 109,
    "name": "Dr. Anuradha Agarwal",
    "specialization": "Endocrinologist",
    "hospital": "Demo Affiliation: Max Super Speciality Saket",
    "hospitalId": 120,
    "city": "New Delhi",
    "state": "Delhi",
    "experience": 13,
    "qualification": "MBBS, MD/MS Endocrinologist – Demo Medical College",
    "rating": 4.9,
    "consultationFee": 1250,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 110,
    "name": "Dr. Subrata Thomas",
    "specialization": "General Surgeon",
    "hospital": "Demo Affiliation: Sir Ganga Ram Hospital",
    "hospitalId": 121,
    "city": "New Delhi",
    "state": "Delhi",
    "experience": 16,
    "qualification": "MBBS, MD/MS General Surgeon – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 500,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 111,
    "name": "Dr. Subrata Srivastava",
    "specialization": "Psychiatrist",
    "hospital": "Demo Affiliation: Lok Nayak Hospital Delhi",
    "hospitalId": 121,
    "city": "Delhi",
    "state": "Delhi",
    "experience": 17,
    "qualification": "MBBS, MD/MS Psychiatrist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 700,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 112,
    "name": "Dr. Moumita Kaur",
    "specialization": "Endocrinologist",
    "hospital": "Demo Affiliation: Fortis Hospital Shalimar Bagh",
    "hospitalId": 122,
    "city": "Delhi",
    "state": "Delhi",
    "experience": 20,
    "qualification": "MBBS, MD/MS Endocrinologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 850,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 113,
    "name": "Dr. Haresh Rath",
    "specialization": "General Surgeon",
    "hospital": "Demo Affiliation: Lok Nayak Hospital Delhi",
    "hospitalId": 123,
    "city": "Delhi",
    "state": "Delhi",
    "experience": 8,
    "qualification": "MBBS, MD/MS General Surgeon – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 1000,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 114,
    "name": "Dr. Geeta Chouksey",
    "specialization": "Emergency Medicine",
    "hospital": "Demo Affiliation: Fortis Hospital Shalimar Bagh",
    "hospitalId": 124,
    "city": "Delhi",
    "state": "Delhi",
    "experience": 11,
    "qualification": "MBBS, MD/MS Emergency Medicine – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 1150,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 115,
    "name": "Dr. Suman Kadam",
    "specialization": "Emergency Medicine",
    "hospital": "Demo Affiliation: Apollo Gleneagles Kolkata",
    "hospitalId": 126,
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 18,
    "qualification": "MBBS, MD/MS Emergency Medicine – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 750,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 116,
    "name": "Dr. Anoop Khan",
    "specialization": "Cardiologist",
    "hospital": "Demo Affiliation: AMRI Hospital Dhakuria",
    "hospitalId": 127,
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 21,
    "qualification": "MBBS, MD/MS Cardiologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 900,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 117,
    "name": "Dr. Preethi Pillai",
    "specialization": "Neurologist",
    "hospital": "Demo Affiliation: SSKM Hospital Kolkata",
    "hospitalId": 128,
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 9,
    "qualification": "MBBS, MD/MS Neurologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 1050,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 118,
    "name": "Dr. Ramesh More",
    "specialization": "Neurosurgeon",
    "hospital": "Demo Affiliation: Apollo Gleneagles Kolkata",
    "hospitalId": 129,
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 12,
    "qualification": "MBBS, MD/MS Neurosurgeon – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 1200,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 119,
    "name": "Dr. Gurpreet Agarwal",
    "specialization": "Neurosurgeon",
    "hospital": "Demo Affiliation: Apollo Hospitals Ahmedabad",
    "hospitalId": 131,
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 19,
    "qualification": "MBBS, MD/MS Neurosurgeon – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 800,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 120,
    "name": "Dr. Navneet Venkatesan",
    "specialization": "Orthopedic Surgeon",
    "hospital": "Demo Affiliation: Zydus Hospital Ahmedabad",
    "hospitalId": 132,
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 22,
    "qualification": "MBBS, MD/MS Orthopedic Surgeon – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 950,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 121,
    "name": "Dr. Biswajit Banerjee",
    "specialization": "General Physician",
    "hospital": "Demo Affiliation: Civil Hospital Ahmedabad",
    "hospitalId": 133,
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 10,
    "qualification": "MBBS, MD/MS General Physician – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 1100,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 122,
    "name": "Dr. Anil Gowda",
    "specialization": "Pediatrician",
    "hospital": "Demo Affiliation: Apollo Hospitals Ahmedabad",
    "hospitalId": 134,
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 13,
    "qualification": "MBBS, MD/MS Pediatrician – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 1250,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 123,
    "name": "Dr. Sreedhar Menon",
    "specialization": "Pediatrician",
    "hospital": "Demo Affiliation: Kiran Super Multispeciality Hospital",
    "hospitalId": 136,
    "city": "Surat",
    "state": "Gujarat",
    "experience": 20,
    "qualification": "MBBS, MD/MS Pediatrician – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 850,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 124,
    "name": "Dr. Uma Nambiar",
    "specialization": "Gynecologist",
    "hospital": "Demo Affiliation: Sunshine Global Hospital Surat",
    "hospitalId": 137,
    "city": "Surat",
    "state": "Gujarat",
    "experience": 8,
    "qualification": "MBBS, MD/MS Gynecologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 1000,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 125,
    "name": "Dr. Ranjit Dutta",
    "specialization": "Dermatologist",
    "hospital": "Demo Affiliation: Kiran Super Multispeciality Hospital",
    "hospitalId": 138,
    "city": "Surat",
    "state": "Gujarat",
    "experience": 11,
    "qualification": "MBBS, MD/MS Dermatologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 1150,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 126,
    "name": "Dr. Fatima Mehta",
    "specialization": "ENT Specialist",
    "hospital": "Demo Affiliation: Sunshine Global Hospital Surat",
    "hospitalId": 139,
    "city": "Surat",
    "state": "Gujarat",
    "experience": 14,
    "qualification": "MBBS, MD/MS ENT Specialist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 400,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 127,
    "name": "Dr. Archana Patil",
    "specialization": "ENT Specialist",
    "hospital": "Demo Affiliation: Fortis Escorts Hospital Jaipur",
    "hospitalId": 141,
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 21,
    "qualification": "MBBS, MD/MS ENT Specialist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 900,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 128,
    "name": "Dr. Nilesh Joshi",
    "specialization": "Ophthalmologist",
    "hospital": "Demo Affiliation: SMS Hospital Jaipur",
    "hospitalId": 142,
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 9,
    "qualification": "MBBS, MD/MS Ophthalmologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 1050,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 129,
    "name": "Dr. Preeti Nair",
    "specialization": "Gastroenterologist",
    "hospital": "Demo Affiliation: Eternal Hospital Jaipur",
    "hospitalId": 143,
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 12,
    "qualification": "MBBS, MD/MS Gastroenterologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 1200,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 130,
    "name": "Dr. Kedar Shah",
    "specialization": "Pulmonologist",
    "hospital": "Demo Affiliation: Fortis Escorts Hospital Jaipur",
    "hospitalId": 144,
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 15,
    "qualification": "MBBS, MD/MS Pulmonologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 450,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 131,
    "name": "Dr. Neeraj Gokhale",
    "specialization": "Pulmonologist",
    "hospital": "Demo Affiliation: Apollo Hospitals Vizag",
    "hospitalId": 146,
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "experience": 22,
    "qualification": "MBBS, MD/MS Pulmonologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 950,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 132,
    "name": "Dr. Meera Kale",
    "specialization": "Nephrologist",
    "hospital": "Demo Affiliation: SevenHills Hospital Visakhapatnam",
    "hospitalId": 147,
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "experience": 10,
    "qualification": "MBBS, MD/MS Nephrologist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 1100,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 133,
    "name": "Dr. Bhaskar Pawar",
    "specialization": "Urologist",
    "hospital": "Demo Affiliation: Apollo Hospitals Vizag",
    "hospitalId": 148,
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "experience": 13,
    "qualification": "MBBS, MD/MS Urologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 1250,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 134,
    "name": "Dr. Himanshu Sathe",
    "specialization": "Oncologist",
    "hospital": "Demo Affiliation: SevenHills Hospital Visakhapatnam",
    "hospitalId": 149,
    "city": "Visakhapatnam",
    "state": "Andhra Pradesh",
    "experience": 16,
    "qualification": "MBBS, MD/MS Oncologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 500,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 135,
    "name": "Dr. Tejpal Sharma",
    "specialization": "Oncologist",
    "hospital": "Demo Affiliation: AIIMS Bhubaneswar",
    "hospitalId": 151,
    "city": "Bhubaneswar",
    "state": "Odisha",
    "experience": 8,
    "qualification": "MBBS, MD/MS Oncologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1000,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 136,
    "name": "Dr. Kamala Verma",
    "specialization": "Psychiatrist",
    "hospital": "Demo Affiliation: SUM Ultimate Medicare Bhubaneswar",
    "hospitalId": 152,
    "city": "Bhubaneswar",
    "state": "Odisha",
    "experience": 11,
    "qualification": "MBBS, MD/MS Psychiatrist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 1150,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 137,
    "name": "Dr. Rakesh Kapoor",
    "specialization": "Endocrinologist",
    "hospital": "Demo Affiliation: AIIMS Bhubaneswar",
    "hospitalId": 153,
    "city": "Bhubaneswar",
    "state": "Odisha",
    "experience": 14,
    "qualification": "MBBS, MD/MS Endocrinologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 400,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 138,
    "name": "Dr. Sarika Gupta",
    "specialization": "General Surgeon",
    "hospital": "Demo Affiliation: SUM Ultimate Medicare Bhubaneswar",
    "hospitalId": 154,
    "city": "Bhubaneswar",
    "state": "Odisha",
    "experience": 17,
    "qualification": "MBBS, MD/MS General Surgeon – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 550,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 139,
    "name": "Dr. Shilpa Rajan",
    "specialization": "General Surgeon",
    "hospital": "Demo Affiliation: KGMU Lucknow",
    "hospitalId": 156,
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 9,
    "qualification": "MBBS, MD/MS General Surgeon – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1050,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 140,
    "name": "Dr. Anand Reddy",
    "specialization": "Emergency Medicine",
    "hospital": "Demo Affiliation: Medanta Hospital Lucknow",
    "hospitalId": 157,
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 12,
    "qualification": "MBBS, MD/MS Emergency Medicine – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 1200,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 141,
    "name": "Dr. Vignesh Kumar",
    "specialization": "Cardiologist",
    "hospital": "Demo Affiliation: SGPGI Lucknow",
    "hospitalId": 158,
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 15,
    "qualification": "MBBS, MD/MS Cardiologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 450,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 142,
    "name": "Dr. Divya Subramanian",
    "specialization": "Neurologist",
    "hospital": "Demo Affiliation: KGMU Lucknow",
    "hospitalId": 159,
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 18,
    "qualification": "MBBS, MD/MS Neurologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 600,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 143,
    "name": "Dr. Aarav Rao",
    "specialization": "Neurologist",
    "hospital": "Demo Affiliation: PGI Chandigarh (PGIMER)",
    "hospitalId": 161,
    "city": "Chandigarh",
    "state": "Punjab",
    "experience": 10,
    "qualification": "MBBS, MD/MS Neurologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1100,
    "available": true,
    "availableSlots": [
      "9:30 AM",
      "11:30 AM",
      "2:00 PM",
      "4:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 144,
    "name": "Dr. Priya Ramaiah",
    "specialization": "Neurosurgeon",
    "hospital": "Demo Affiliation: Fortis Hospital Mohali",
    "hospitalId": 162,
    "city": "Chandigarh",
    "state": "Punjab",
    "experience": 13,
    "qualification": "MBBS, MD/MS Neurosurgeon – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 1250,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 145,
    "name": "Dr. Rohan Biswas",
    "specialization": "Orthopedic Surgeon",
    "hospital": "Demo Affiliation: PGI Chandigarh (PGIMER)",
    "hospitalId": 163,
    "city": "Chandigarh",
    "state": "Punjab",
    "experience": 16,
    "qualification": "MBBS, MD/MS Orthopedic Surgeon – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 500,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 146,
    "name": "Dr. Neha Ghosh",
    "specialization": "General Physician",
    "hospital": "Demo Affiliation: Fortis Hospital Mohali",
    "hospitalId": 164,
    "city": "Chandigarh",
    "state": "Punjab",
    "experience": 19,
    "qualification": "MBBS, MD/MS General Physician – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 650,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 147,
    "name": "Dr. Meenakshi Tripathi",
    "specialization": "General Physician",
    "hospital": "Demo Affiliation: Bombay Hospital Indore",
    "hospitalId": 166,
    "city": "Indore",
    "state": "Madhya Pradesh",
    "experience": 11,
    "qualification": "MBBS, MD/MS General Physician – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1150,
    "available": true,
    "availableSlots": [
      "8:30 AM",
      "10:30 AM",
      "3:30 PM",
      "5:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 148,
    "name": "Dr. Vikram Srivastava",
    "specialization": "Pediatrician",
    "hospital": "Demo Affiliation: Choithram Hospital Indore",
    "hospitalId": 167,
    "city": "Indore",
    "state": "Madhya Pradesh",
    "experience": 14,
    "qualification": "MBBS, MD/MS Pediatrician – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 400,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 149,
    "name": "Dr. Anjali Kaur",
    "specialization": "Gynecologist",
    "hospital": "Demo Affiliation: Bombay Hospital Indore",
    "hospitalId": 168,
    "city": "Indore",
    "state": "Madhya Pradesh",
    "experience": 17,
    "qualification": "MBBS, MD/MS Gynecologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 550,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 150,
    "name": "Dr. Rahul Rath",
    "specialization": "Dermatologist",
    "hospital": "Demo Affiliation: Choithram Hospital Indore",
    "hospitalId": 169,
    "city": "Indore",
    "state": "Madhya Pradesh",
    "experience": 20,
    "qualification": "MBBS, MD/MS Dermatologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 700,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  },
  {
    "id": 151,
    "name": "Dr. Abhijit Naidu",
    "specialization": "Dermatologist",
    "hospital": "Demo Affiliation: AIIMS Bhopal",
    "hospitalId": 171,
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "experience": 12,
    "qualification": "MBBS, MD/MS Dermatologist – Demo Medical College",
    "rating": 4.5,
    "consultationFee": 1200,
    "available": true,
    "availableSlots": [
      "11:00 AM",
      "2:30 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 152,
    "name": "Dr. Sneha Kadam",
    "specialization": "ENT Specialist",
    "hospital": "Demo Affiliation: Bansal Hospital Bhopal",
    "hospitalId": 172,
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "experience": 15,
    "qualification": "MBBS, MD/MS ENT Specialist – Demo Medical College",
    "rating": 4.6,
    "consultationFee": 450,
    "available": true,
    "availableSlots": [
      "9:00 AM",
      "11:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 153,
    "name": "Dr. Ganesh Khan",
    "specialization": "Ophthalmologist",
    "hospital": "Demo Affiliation: AIIMS Bhopal",
    "hospitalId": 173,
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "experience": 18,
    "qualification": "MBBS, MD/MS Ophthalmologist – Demo Medical College",
    "rating": 4.7,
    "consultationFee": 600,
    "available": true,
    "availableSlots": [
      "10:00 AM",
      "12:00 PM",
      "4:30 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Today",
    "isDemoProfile": true
  },
  {
    "id": 154,
    "name": "Dr. Madhuri Pillai",
    "specialization": "Gastroenterologist",
    "hospital": "Demo Affiliation: Bansal Hospital Bhopal",
    "hospitalId": 174,
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "experience": 21,
    "qualification": "MBBS, MD/MS Gastroenterologist – Demo Medical College",
    "rating": 4.8,
    "consultationFee": 750,
    "available": false,
    "availableSlots": [
      "10:00 AM",
      "3:00 PM"
    ],
    "languages": [
      "English",
      "Hindi"
    ],
    "nextAvailable": "Tomorrow",
    "isDemoProfile": true
  }
];

// ─── AMBULANCES ───────────────────────────────────────────────────────────────
export const AMBULANCES = [
  { id: 1, code: "AMB-MUM-001", type: "Advanced Life Support", hospital: "Kokilaben Dhirubhai Ambani Hospital", hospitalId: 1, driver: "Ramesh Jadhav", driverPhone: "+91-9876543210", distance: 1.2, eta: 4, status: "Available", equipped: ["Defibrillator", "Ventilator", "O2", "IV Setup", "ECG Monitor"], rating: 4.9, isDemoData: true },
  { id: 2, code: "AMB-MUM-002", type: "Basic Life Support", hospital: "Lilavati Hospital & Research Centre", hospitalId: 2, driver: "Santosh Rane", driverPhone: "+91-9876543211", distance: 2.1, eta: 7, status: "Available", equipped: ["First Aid", "O2", "Stretcher", "BP Monitor"], rating: 4.7, isDemoData: true },
  { id: 3, code: "AMB-MUM-003", type: "Cardiac Ambulance", hospital: "P. D. Hinduja Hospital & MRC", hospitalId: 3, driver: "Suresh Mane", driverPhone: "+91-9876543212", distance: 3.0, eta: 10, status: "On Call", equipped: ["12-Lead ECG", "Defibrillator", "Thrombolytics", "Ventilator"], rating: 4.8, isDemoData: true },
  { id: 4, code: "AMB-PUN-001", type: "Advanced Life Support", hospital: "Ruby Hall Clinic", hospitalId: 11, driver: "Anil Pawar", driverPhone: "+91-9876543213", distance: 1.8, eta: 6, status: "Available", equipped: ["Defibrillator", "Ventilator", "O2", "IV Setup"], rating: 4.8, isDemoData: true },
  { id: 5, code: "AMB-PUN-002", type: "Neonatal Ambulance", hospital: "Deenanath Mangeshkar Hospital", hospitalId: 13, driver: "Vijay Shinde", driverPhone: "+91-9876543214", distance: 2.5, eta: 9, status: "Available", equipped: ["Incubator", "Neonatal Ventilator", "IV Pump"], rating: 4.9, isDemoData: true },
  { id: 6, code: "AMB-DEL-001", type: "Advanced Life Support", hospital: "AIIMS New Delhi", hospitalId: 23, driver: "Mohan Kumar", driverPhone: "+91-9876543215", distance: 2.8, eta: 9, status: "Available", equipped: ["Defibrillator", "Ventilator", "O2", "ECG Monitor", "Blood Products"], rating: 4.9, isDemoData: true },
  { id: 7, code: "AMB-BLR-001", type: "Advanced Life Support", hospital: "Narayana Health City", hospitalId: 29, driver: "Krishna Swamy", driverPhone: "+91-9876543216", distance: 3.5, eta: 12, status: "Available", equipped: ["Defibrillator", "Ventilator", "O2", "IV Setup"], rating: 4.7, isDemoData: true },
  { id: 8, code: "AMB-CHN-001", type: "Basic Life Support", hospital: "Apollo Hospitals Chennai", hospitalId: 30, driver: "Murugan Selvam", driverPhone: "+91-9876543217", distance: 1.5, eta: 5, status: "Available", equipped: ["First Aid", "O2", "Stretcher", "AED"], rating: 4.6, isDemoData: true },
];

// ─── BLOOD BANKS ──────────────────────────────────────────────────────────────
export const BLOOD_BANKS = [
  { id: 1, name: "Kokilaben Hospital Blood Bank", hospital: "Kokilaben Dhirubhai Ambani Hospital", hospitalId: 1, city: "Mumbai", state: "Maharashtra", distance: 1.2, eta: 5, open24x7: true, phone: "+91-22-30996000", lastUpdated: "10 min ago", inventory: { "A+": 45, "A-": 12, "B+": 38, "B-": 8, "O+": 60, "O-": 15, "AB+": 18, "AB-": 4 }, isDemoData: true },
  { id: 2, name: "Ruby Hall Clinic Blood Bank", hospital: "Ruby Hall Clinic", hospitalId: 11, city: "Pune", state: "Maharashtra", distance: 2.1, eta: 8, open24x7: true, phone: "+91-20-26163391", lastUpdated: "25 min ago", inventory: { "A+": 32, "A-": 8, "B+": 28, "B-": 5, "O+": 42, "O-": 12, "AB+": 14, "AB-": 3 }, isDemoData: true },
  { id: 3, name: "AIIMS Blood Bank Delhi", hospital: "AIIMS New Delhi", hospitalId: 23, city: "New Delhi", state: "Delhi", distance: 3.5, eta: 13, open24x7: true, phone: "+91-11-26588500", lastUpdated: "5 min ago", inventory: { "A+": 80, "A-": 25, "B+": 72, "B-": 18, "O+": 100, "O-": 30, "AB+": 35, "AB-": 10 }, isDemoData: true },
  { id: 4, name: "Apollo Chennai Blood Bank", hospital: "Apollo Hospitals Chennai", hospitalId: 30, city: "Chennai", state: "Tamil Nadu", distance: 1.8, eta: 7, open24x7: true, phone: "+91-44-28290200", lastUpdated: "15 min ago", inventory: { "A+": 40, "A-": 10, "B+": 35, "B-": 7, "O+": 55, "O-": 18, "AB+": 22, "AB-": 5 }, isDemoData: true },
  { id: 5, name: "PGI Chandigarh Blood Bank", hospital: "PGI Chandigarh (PGIMER)", hospitalId: 48, city: "Chandigarh", state: "Punjab", distance: 2.5, eta: 9, open24x7: true, phone: "+91-172-2755555", lastUpdated: "30 min ago", inventory: { "A+": 55, "A-": 14, "B+": 48, "B-": 11, "O+": 70, "O-": 20, "AB+": 28, "AB-": 7 }, isDemoData: true },
];

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────
export const APPOINTMENTS = [
  { id: 1, doctorName: "Dr. Aarav Mehta", doctorId: 1, specialization: "Cardiologist", hospital: "Kokilaben Dhirubhai Ambani Hospital", hospitalId: 1, city: "Mumbai", date: "2026-08-08", time: "10:00 AM", status: "Confirmed", tokenNumber: 14, fee: 1200, notes: "Follow-up after ECG" },
  { id: 2, doctorName: "Dr. Sneha Gokhale", doctorId: 12, specialization: "Neurologist", hospital: "Deenanath Mangeshkar Hospital", hospitalId: 13, city: "Pune", date: "2026-08-05", time: "2:00 PM", status: "Completed", tokenNumber: 7, fee: 950, notes: "MRI report review" },
  { id: 3, doctorName: "Dr. Priya Iyer", doctorId: 2, specialization: "Neurologist", hospital: "Lilavati Hospital & Research Centre", hospitalId: 2, city: "Mumbai", date: "2026-08-03", time: "11:00 AM", status: "Cancelled", tokenNumber: 22, fee: 1000, notes: "" },
];

// ─── STATIC LISTS ─────────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: 1, type: "appointment", message: "Appointment with Dr. Aarav Mehta confirmed for Aug 8", time: "2h ago", read: false },
  { id: 2, type: "blood", message: "O- blood critically low at Mumbai hospitals", time: "4h ago", read: false },
  { id: 3, type: "general", message: "AIIMS Delhi new OPD timings: 8AM–1PM on weekdays", time: "1d ago", read: true },
];

export const MEDICAL_CONDITIONS = [
  "Chest Pain / Heart Attack", "Stroke / Brain Attack", "Road Accident / Trauma",
  "Breathing Difficulty", "Severe Abdominal Pain", "High Fever / Infection",
  "Diabetic Emergency", "Pregnancy Complications", "Burns / Poisoning",
  "Pediatric Emergency", "Psychiatric Emergency", "Kidney Failure",
  "Liver Failure", "Cancer Emergency", "Bone Fracture / Ortho",
  "Eye Injury", "Ear Nose Throat", "Dermatological Urgent",
  "Neurological (Non-stroke)", "General Check-up",
];

export const SPECIALIZATIONS = [
  "Cardiologist", "Neurologist", "Neurosurgeon", "Orthopedic Surgeon",
  "General Physician", "Pediatrician", "Gynecologist", "Dermatologist",
  "ENT Specialist", "Ophthalmologist", "Gastroenterologist", "Pulmonologist",
  "Nephrologist", "Urologist", "Oncologist", "Psychiatrist",
  "Endocrinologist", "Emergency Medicine", "General Surgeon",
  "Cardiac Surgeon", "Liver Transplant", "Kidney Transplant",
];

export const HEALTH_TIPS = [
  "💧 Drink at least 8 glasses of water daily to stay hydrated.",
  "🚶 Walk 30 minutes every day — it reduces heart disease risk by 35%.",
  "😴 Get 7–9 hours of quality sleep. Poor sleep affects immunity significantly.",
  "🥗 Eat 5 portions of fruit and vegetables daily for optimal nutrition.",
  "🧘 Practice deep breathing or meditation for 10 minutes to reduce stress.",
  "❤️ Know your blood pressure: Normal is below 120/80 mmHg.",
  "🩺 Annual health check-ups help detect conditions early.",
  "🚭 Quitting smoking reduces heart disease risk by 50% within one year.",
  "🩸 Know your blood type — it's critical in emergencies.",
  "💊 Never skip prescribed medications without consulting your doctor.",
];

export const AI_RESPONSES = {
  fever: { guidance: "Monitor temperature regularly. If above 103°F (39.4°C) or fever persists more than 3 days, seek medical attention immediately.", severity: "moderate", recommendations: ["Stay hydrated — drink water, ORS, or coconut water", "Rest and avoid exertion", "Take paracetamol if temperature is above 101°F", "Seek immediate care if you have difficulty breathing, rash, or stiff neck"], specialist: "General Physician or Internal Medicine specialist", seekEmergency: false },
  "chest pain": { guidance: "Chest pain can indicate a serious cardiac event. Do not ignore this symptom. If severe, call 112 immediately.", severity: "critical", recommendations: ["Call emergency services (112) immediately if pain is crushing/radiating to arm", "Chew aspirin 325mg if not allergic and no contraindications", "Sit or lie in a comfortable position", "Do not drive yourself to hospital"], specialist: "Emergency Medicine / Cardiologist", seekEmergency: true },
  default: { guidance: "Based on your symptoms, I recommend consulting a qualified healthcare professional for proper diagnosis and treatment.", severity: "low", recommendations: ["Monitor symptoms closely", "Stay hydrated and rested", "Consult a doctor if symptoms worsen or persist", "Keep an emergency contact handy"], specialist: "General Physician", seekEmergency: false },
};

export const USER_PROFILE = {
  id: "AG-MH-2025-0001", name: "Arjun Mehta", email: "demo@antigravity.health",
  phone: "+91-98765-43210", age: 34, gender: "Male", bloodGroup: "B+",
  address: "404, Sector 7, Andheri West, Mumbai – 400053",
  medicalHistory: ["Type 2 Diabetes (Controlled)", "Hypertension Stage 1"],
  currentMedications: ["Metformin 500mg – Twice daily", "Amlodipine 5mg – Once daily"],
  allergies: ["Penicillin", "Sulfa drugs"],
  emergencyContact: { name: "Priya Mehta", relation: "Spouse", phone: "+91-98765-12345" },
  insurance: { provider: "Star Health Comprehensive", policyNumber: "SH-MH-2024-77843", validTill: "March 2027" },
};
