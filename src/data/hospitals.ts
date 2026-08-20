// Curated public dataset of real multispecialty hospitals across major Indian cities.
// Sources: hospital directories, NABH listings, public hospital websites.
// Data is for informational purposes only — always verify before visiting.

export interface Hospital {
  name: string;
  city: string;
  address: string;
  phone: string;
  website?: string;
  specialties: string[]; // canonical specialty keys (lowercase)
}

// Canonical specialty keys used to match AI-suggested specialists to hospitals.
export const SPECIALTY_KEYS = [
  "cardiology",
  "neurology",
  "nephrology",
  "pulmonology",
  "endocrinology",
  "gastroenterology",
  "hepatology",
  "oncology",
  "orthopedics",
  "general medicine",
  "pediatrics",
  "urology",
  "dermatology",
  "psychiatry",
  "ophthalmology",
] as const;

// Map free-form AI specialty strings -> canonical keys.
export function normalizeSpecialty(s: string): string {
  const x = s.toLowerCase();
  if (x.includes("cardio") || x.includes("heart")) return "cardiology";
  if (x.includes("neuro") || x.includes("brain")) return "neurology";
  if (x.includes("nephro") || x.includes("kidney") || x.includes("renal")) return "nephrology";
  if (x.includes("pulmo") || x.includes("lung") || x.includes("respiratory") || x.includes("chest")) return "pulmonology";
  if (x.includes("endocrin") || x.includes("diabet") || x.includes("thyroid") || x.includes("hormone")) return "endocrinology";
  if (x.includes("gastro") || x.includes("stomach") || x.includes("intestin")) return "gastroenterology";
  if (x.includes("hepato") || x.includes("liver")) return "hepatology";
  if (x.includes("onco") || x.includes("cancer") || x.includes("tumor")) return "oncology";
  if (x.includes("ortho") || x.includes("bone") || x.includes("joint")) return "orthopedics";
  if (x.includes("pediatr") || x.includes("child")) return "pediatrics";
  if (x.includes("uro")) return "urology";
  if (x.includes("derma") || x.includes("skin")) return "dermatology";
  if (x.includes("psych") || x.includes("mental")) return "psychiatry";
  if (x.includes("ophthal") || x.includes("eye")) return "ophthalmology";
  return "general medicine";
}

export const HOSPITALS: Hospital[] = [
  // ----- Mumbai -----
  {
    name: "Kokilaben Dhirubhai Ambani Hospital",
    city: "Mumbai",
    address: "Rao Saheb Achutrao Patwardhan Marg, Four Bunglows, Andheri West, Mumbai 400053",
    phone: "+91 22 4269 6969",
    website: "https://www.kokilabenhospital.com",
    specialties: ["cardiology", "neurology", "oncology", "nephrology", "orthopedics", "gastroenterology", "general medicine"],
  },
  {
    name: "Lilavati Hospital and Research Centre",
    city: "Mumbai",
    address: "A-791, Bandra Reclamation, Bandra West, Mumbai 400050",
    phone: "+91 22 2675 1000",
    website: "https://www.lilavatihospital.com",
    specialties: ["cardiology", "neurology", "oncology", "orthopedics", "general medicine", "gastroenterology"],
  },
  {
    name: "Tata Memorial Hospital",
    city: "Mumbai",
    address: "Dr. E Borges Road, Parel, Mumbai 400012",
    phone: "+91 22 2417 7000",
    website: "https://tmc.gov.in",
    specialties: ["oncology", "general medicine"],
  },
  {
    name: "Hinduja Hospital",
    city: "Mumbai",
    address: "Veer Savarkar Marg, Mahim West, Mumbai 400016",
    phone: "+91 22 2444 7000",
    website: "https://www.hindujahospital.com",
    specialties: ["cardiology", "nephrology", "neurology", "pulmonology", "general medicine"],
  },

  // ----- Delhi / NCR -----
  {
    name: "All India Institute of Medical Sciences (AIIMS)",
    city: "Delhi",
    address: "Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029",
    phone: "+91 11 2658 8500",
    website: "https://www.aiims.edu",
    specialties: ["cardiology", "neurology", "oncology", "nephrology", "pulmonology", "endocrinology", "general medicine", "pediatrics"],
  },
  {
    name: "Fortis Escorts Heart Institute",
    city: "Delhi",
    address: "Okhla Road, New Delhi 110025",
    phone: "+91 11 4713 5000",
    website: "https://www.fortisescorts.in",
    specialties: ["cardiology", "general medicine"],
  },
  {
    name: "Indraprastha Apollo Hospitals",
    city: "Delhi",
    address: "Mathura Road, Sarita Vihar, New Delhi 110076",
    phone: "+91 11 7179 1090",
    website: "https://www.apollohospitals.com",
    specialties: ["cardiology", "neurology", "oncology", "orthopedics", "gastroenterology", "nephrology", "general medicine"],
  },
  {
    name: "Max Super Speciality Hospital, Saket",
    city: "Delhi",
    address: "1, 2 Press Enclave Road, Saket, New Delhi 110017",
    phone: "+91 11 2651 5050",
    website: "https://www.maxhealthcare.in",
    specialties: ["cardiology", "oncology", "neurology", "orthopedics", "endocrinology", "general medicine"],
  },
  {
    name: "Medanta - The Medicity",
    city: "Gurgaon",
    address: "CH Baktawar Singh Road, Sector 38, Gurgaon 122001",
    phone: "+91 124 414 1414",
    website: "https://www.medanta.org",
    specialties: ["cardiology", "neurology", "nephrology", "hepatology", "oncology", "orthopedics", "general medicine"],
  },

  // ----- Bangalore -----
  {
    name: "Manipal Hospital, Old Airport Road",
    city: "Bangalore",
    address: "98, HAL Old Airport Road, Bangalore 560017",
    phone: "+91 80 2502 4444",
    website: "https://www.manipalhospitals.com",
    specialties: ["cardiology", "neurology", "oncology", "orthopedics", "gastroenterology", "general medicine"],
  },
  {
    name: "Narayana Health City",
    city: "Bangalore",
    address: "258/A, Bommasandra Industrial Area, Hosur Road, Bangalore 560099",
    phone: "+91 80 7122 2222",
    website: "https://www.narayanahealth.org",
    specialties: ["cardiology", "oncology", "nephrology", "neurology", "general medicine"],
  },
  {
    name: "Apollo Hospitals, Bannerghatta Road",
    city: "Bangalore",
    address: "154/11, Opp. IIM-B, Bannerghatta Road, Bangalore 560076",
    phone: "+91 80 2630 4050",
    website: "https://www.apollohospitals.com",
    specialties: ["cardiology", "neurology", "orthopedics", "gastroenterology", "general medicine"],
  },
  {
    name: "Fortis Hospital, Bannerghatta",
    city: "Bangalore",
    address: "154/9, Bannerghatta Main Road, Bangalore 560076",
    phone: "+91 80 6621 4444",
    website: "https://www.fortishealthcare.com",
    specialties: ["cardiology", "neurology", "oncology", "orthopedics", "general medicine"],
  },

  // ----- Hyderabad -----
  {
    name: "Apollo Hospitals, Jubilee Hills",
    city: "Hyderabad",
    address: "Road No. 72, Opp. Bharatiya Vidya Bhavan, Film Nagar, Jubilee Hills, Hyderabad 500033",
    phone: "+91 40 2360 7777",
    website: "https://www.apollohospitals.com",
    specialties: ["cardiology", "neurology", "oncology", "orthopedics", "gastroenterology", "general medicine"],
  },
  {
    name: "AIG Hospitals",
    city: "Hyderabad",
    address: "Plot No 2/3/4/5, Survey No 136/1, Mindspace Rd, Gachibowli, Hyderabad 500032",
    phone: "+91 40 4244 4222",
    website: "https://www.aighospitals.com",
    specialties: ["gastroenterology", "hepatology", "general medicine"],
  },
  {
    name: "KIMS Hospitals, Secunderabad",
    city: "Hyderabad",
    address: "1-8-31/1, Minister Road, Krishna Nagar Colony, Begumpet, Secunderabad 500003",
    phone: "+91 40 4488 5000",
    website: "https://www.kimshospitals.com",
    specialties: ["cardiology", "neurology", "nephrology", "orthopedics", "general medicine"],
  },

  // ----- Chennai -----
  {
    name: "Apollo Hospitals, Greams Road",
    city: "Chennai",
    address: "21, Greams Lane, Off Greams Road, Chennai 600006",
    phone: "+91 44 2829 3333",
    website: "https://www.apollohospitals.com",
    specialties: ["cardiology", "oncology", "neurology", "orthopedics", "general medicine"],
  },
  {
    name: "MIOT International",
    city: "Chennai",
    address: "4/112, Mount Poonamallee Road, Manapakkam, Chennai 600089",
    phone: "+91 44 4200 2288",
    website: "https://www.miotinternational.com",
    specialties: ["orthopedics", "cardiology", "nephrology", "general medicine"],
  },
  {
    name: "Sri Ramachandra Medical Centre",
    city: "Chennai",
    address: "1, Ramachandra Nagar, Porur, Chennai 600116",
    phone: "+91 44 2476 8027",
    website: "https://www.sriramachandra.edu.in",
    specialties: ["cardiology", "neurology", "oncology", "pediatrics", "general medicine"],
  },

  // ----- Kolkata -----
  {
    name: "Apollo Gleneagles Hospital",
    city: "Kolkata",
    address: "58, Canal Circular Road, Kadapara, Kolkata 700054",
    phone: "+91 33 2320 3040",
    website: "https://kolkata.apollohospitals.com",
    specialties: ["cardiology", "neurology", "oncology", "orthopedics", "general medicine"],
  },
  {
    name: "AMRI Hospital, Dhakuria",
    city: "Kolkata",
    address: "P-4 & 5, Block A, Gariahat Road, Dhakuria, Kolkata 700029",
    phone: "+91 33 6680 0000",
    website: "https://www.amrihospitals.in",
    specialties: ["cardiology", "neurology", "nephrology", "general medicine"],
  },

  // ----- Pune -----
  {
    name: "Ruby Hall Clinic",
    city: "Pune",
    address: "40, Sassoon Road, Pune 411001",
    phone: "+91 20 6645 5100",
    website: "https://rubyhall.com",
    specialties: ["cardiology", "oncology", "neurology", "orthopedics", "general medicine"],
  },
  {
    name: "Jehangir Hospital",
    city: "Pune",
    address: "32, Sassoon Road, Pune 411001",
    phone: "+91 20 6681 9999",
    website: "https://jehangirhospital.com",
    specialties: ["cardiology", "neurology", "orthopedics", "general medicine"],
  },

  // ----- Ahmedabad -----
  {
    name: "Sterling Hospitals",
    city: "Ahmedabad",
    address: "Sterling Hospital Road, Memnagar, Ahmedabad 380052",
    phone: "+91 79 4001 1111",
    website: "https://www.sterlinghospitals.com",
    specialties: ["cardiology", "neurology", "oncology", "orthopedics", "general medicine"],
  },
  {
    name: "Apollo Hospitals International, Gandhinagar",
    city: "Ahmedabad",
    address: "Plot No. 1A, Bhat GIDC Estate, Gandhinagar 382428",
    phone: "+91 79 6670 1800",
    website: "https://ahmedabad.apollohospitals.com",
    specialties: ["cardiology", "neurology", "oncology", "orthopedics", "general medicine"],
  },
];

export const ALL_CITIES = Array.from(new Set(HOSPITALS.map((h) => h.city))).sort();

export function findHospitals(city: string, specialties: string[]): Hospital[] {
  const cityLc = city.trim().toLowerCase();
  if (!cityLc) return [];
  const wanted = new Set(specialties.map(normalizeSpecialty));
  // Always allow general medicine fallback
  wanted.add("general medicine");

  const inCity = HOSPITALS.filter((h) => h.city.toLowerCase() === cityLc);
  const scored = inCity
    .map((h) => {
      const matches = h.specialties.filter((s) => wanted.has(s)).length;
      return { h, matches };
    })
    .filter((x) => x.matches > 0)
    .sort((a, b) => b.matches - a.matches);

  return scored.slice(0, 6).map((x) => x.h);
}
