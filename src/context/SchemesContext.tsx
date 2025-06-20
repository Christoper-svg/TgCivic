import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface Scheme {
  id: string;
  name: string;
  description: string;
  category: string;
  department: string;
  keyBenefits: string[];
  eligibilityCriteria: string[];
  applicationProcess: string[];
  requiredDocuments: string[];
  contactInfo: {
    phone?: string;
    email?: string;
    website?: string;
  };
  views: number;
  status: "Active" | "Inactive" | "Under Review";
  createdAt: string;
  updatedAt: string;
  icon?: string;
}

interface SchemesContextType {
  schemes: Scheme[];
  getSchemeById: (id: string) => Scheme | undefined;
  getSchemesByCategory: (category: string) => Scheme[];
  getAllCategories: () => string[];
  getTotalViews: () => number;
  getMostViewedScheme: () => Scheme | undefined;
  incrementViews: (schemeId: string) => void;
  searchSchemes: (query: string) => Scheme[];
  updateScheme: (id: string, updates: Partial<Scheme>) => boolean;
  deleteScheme: (id: string) => boolean;
  addScheme: (scheme: Omit<Scheme, "id" | "createdAt" | "updatedAt">) => string;
}

const SchemesContext = createContext<SchemesContextType | undefined>(undefined);

export const useSchemes = () => {
  const context = useContext(SchemesContext);
  if (!context) {
    throw new Error("useSchemes must be used within a SchemesProvider");
  }
  return context;
};

export const SchemesProvider = ({ children }: { children: ReactNode }) => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    // Initialize with sample schemes data
    const sampleSchemes: Scheme[] = [
      {
        id: "rythu-bandhu",
        name: "Rythu Bandhu",
        description:
          "Financial assistance to farmers for procurement of inputs for cultivation per season",
        category: "Farmers",
        department: "Agriculture Department",
        keyBenefits: [
          "₹5,000 per acre per season",
          "Direct bank transfer",
          "No middleman involvement",
          "4 years",
        ],
        eligibilityCriteria: [
          "Must be a farmer with agricultural land",
          "Land should be registered in applicant's name",
          "Valid Aadhaar card required",
          "Bank account linked to Aadhaar",
        ],
        applicationProcess: [
          "Visit nearest agricultural extension office",
          "Submit required documents",
          "Verification by officials",
          "Amount credited to bank account",
        ],
        requiredDocuments: [
          "Land ownership documents",
          "Aadhaar card",
          "Bank account details",
          "Recent passport size photo",
        ],
        contactInfo: {
          phone: "1800-425-333",
          email: "rythu.bandhu@telangana.gov.in",
          website: "https://rythu.telangana.gov.in",
        },
        views: 1250,
        status: "Active",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
        icon: "🌾",
      },
      {
        id: "aasara-pension",
        name: "Aasara Pension",
        description:
          "Monthly pension for elderly, widows, and disabled persons",
        category: "Senior Citizens",
        department: "Social Welfare Department",
        keyBenefits: [
          "₹2,016 per month",
          "Direct bank transfer",
          "Free healthcare",
          "₹1 more",
        ],
        eligibilityCriteria: [
          "Age 65+ for elderly pension",
          "Below poverty line certificate",
          "Resident of Telangana for 10+ years",
          "Income less than ₹2 lakh per annum",
        ],
        applicationProcess: [
          "Apply online or at MPP office",
          "Submit required documents",
          "Social verification",
          "Pension starts from next month",
        ],
        requiredDocuments: [
          "Age proof certificate",
          "Income certificate",
          "Residence proof",
          "Bank account details",
          "Aadhaar card",
        ],
        contactInfo: {
          phone: "1800-425-999",
          email: "aasara@telangana.gov.in",
        },
        views: 930,
        status: "Active",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
        icon: "👴",
      },
      {
        id: "kalyana-lakshmi",
        name: "Kalyana Lakshmi",
        description:
          "Financial assistance for marriage of daughters from economically weaker sections",
        category: "Women",
        department: "Women and Child Welfare",
        keyBenefits: [
          "₹1,16,116 financial assistance",
          "Direct bank transfer",
          "Gold worth ₹1 lakh",
          "₹1 more",
        ],
        eligibilityCriteria: [
          "Bride's family income < ₹2 lakh per annum",
          "Bride should be 18+ years old",
          "One-time benefit per family",
          "Telangana resident for 5+ years",
        ],
        applicationProcess: [
          "Apply through local MRO office",
          "Submit required documents",
          "Verification by officials",
          "Amount released after marriage",
        ],
        requiredDocuments: [
          "Income certificate",
          "Age proof of bride",
          "Marriage invitation card",
          "Bank account details",
          "Caste certificate (if applicable)",
        ],
        contactInfo: {
          phone: "1800-425-777",
          email: "kalyana.lakshmi@telangana.gov.in",
        },
        views: 785,
        status: "Active",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
        icon: "👰",
      },
      {
        id: "ts-meeseva",
        name: "TS MeeSeva",
        description:
          "Online portal for citizen services and government scheme applications",
        category: "Digital Services",
        department: "IT Department",
        keyBenefits: [
          "150+ government services online",
          "24/7 availability",
          "Digital certificates",
          "Track application status",
        ],
        eligibilityCriteria: [
          "Valid mobile number",
          "Email address",
          "Aadhaar card",
          "Required documents for specific services",
        ],
        applicationProcess: [
          "Register on MeeSeva portal",
          "Select required service",
          "Upload documents",
          "Track application status online",
        ],
        requiredDocuments: [
          "Aadhaar card",
          "Mobile number",
          "Email address",
          "Service-specific documents",
        ],
        contactInfo: {
          phone: "1800-425-111",
          email: "support@meeseva.telangana.gov.in",
          website: "https://meeseva.telangana.gov.in",
        },
        views: 2100,
        status: "Active",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
        icon: "💻",
      },
      {
        id: "kanti-velugu",
        name: "Kanti Velugu",
        description:
          "Free eye screening and treatment program for all citizens",
        category: "Healthcare",
        department: "Health Department",
        keyBenefits: [
          "Free eye screening",
          "Free spectacles",
          "Free cataract surgery",
          "Door-to-door service",
        ],
        eligibilityCriteria: [
          "All age groups eligible",
          "Resident of Telangana",
          "No income limit",
          "Free for all citizens",
        ],
        applicationProcess: [
          "Wait for mobile unit in your area",
          "Register at nearest PHC",
          "Get eye examination",
          "Follow-up treatment if needed",
        ],
        requiredDocuments: [
          "Aadhaar card",
          "Any previous medical records",
          "Address proof",
        ],
        contactInfo: {
          phone: "1800-425-555",
          email: "kanti.velugu@telangana.gov.in",
        },
        views: 456,
        status: "Active",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
        icon: "👁️",
      },
      {
        id: "ts-ipass",
        name: "TS-iPASS",
        description: "Industrial promotion and single window clearance system",
        category: "Business",
        department: "Industries Department",
        keyBenefits: [
          "Single window clearance",
          "Online application tracking",
          "Reduced approval time",
          "Investment facilitation",
        ],
        eligibilityCriteria: [
          "Industrial/business investment",
          "Valid business plan",
          "Environmental clearances",
          "Land ownership documents",
        ],
        applicationProcess: [
          "Apply online on TS-iPASS portal",
          "Submit business plan",
          "Pay required fees",
          "Track approval status",
        ],
        requiredDocuments: [
          "Business registration documents",
          "Land documents",
          "Project report",
          "Environmental clearance",
        ],
        contactInfo: {
          phone: "1800-425-888",
          email: "support@tsipass.telangana.gov.in",
          website: "https://tsipass.telangana.gov.in",
        },
        views: 342,
        status: "Active",
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: "2024-01-15T00:00:00Z",
        icon: "🏭",
      },
    ];

    setSchemes(sampleSchemes);
  }, []);

  const getSchemeById = (id: string): Scheme | undefined => {
    return schemes.find((scheme) => scheme.id === id);
  };

  const getSchemesByCategory = (category: string): Scheme[] => {
    return schemes.filter((scheme) => scheme.category === category);
  };

  const getAllCategories = (): string[] => {
    const categories = schemes.map((scheme) => scheme.category);
    return [...new Set(categories)];
  };

  const getTotalViews = (): number => {
    return schemes.reduce((total, scheme) => total + scheme.views, 0);
  };

  const getMostViewedScheme = (): Scheme | undefined => {
    return schemes.reduce((prev, current) =>
      prev.views > current.views ? prev : current,
    );
  };

  const incrementViews = (schemeId: string): void => {
    setSchemes((prevSchemes) =>
      prevSchemes.map((scheme) =>
        scheme.id === schemeId
          ? { ...scheme, views: scheme.views + 1 }
          : scheme,
      ),
    );
  };

  const searchSchemes = (query: string): Scheme[] => {
    const lowercaseQuery = query.toLowerCase();
    return schemes.filter(
      (scheme) =>
        scheme.name.toLowerCase().includes(lowercaseQuery) ||
        scheme.description.toLowerCase().includes(lowercaseQuery) ||
        scheme.category.toLowerCase().includes(lowercaseQuery) ||
        scheme.department.toLowerCase().includes(lowercaseQuery),
    );
  };

  const updateScheme = (id: string, updates: Partial<Scheme>): boolean => {
    setSchemes((prevSchemes) =>
      prevSchemes.map((scheme) =>
        scheme.id === id
          ? { ...scheme, ...updates, updatedAt: new Date().toISOString() }
          : scheme,
      ),
    );
    return true;
  };

  const deleteScheme = (id: string): boolean => {
    const schemeExists = schemes.some((scheme) => scheme.id === id);
    if (schemeExists) {
      setSchemes((prevSchemes) =>
        prevSchemes.filter((scheme) => scheme.id !== id),
      );
      return true;
    }
    return false;
  };

  const addScheme = (
    schemeData: Omit<Scheme, "id" | "createdAt" | "updatedAt">,
  ): string => {
    const id = `scheme-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const newScheme: Scheme = {
      ...schemeData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    setSchemes((prevSchemes) => [newScheme, ...prevSchemes]);
    return id;
  };

  const value: SchemesContextType = {
    schemes,
    getSchemeById,
    getSchemesByCategory,
    getAllCategories,
    getTotalViews,
    getMostViewedScheme,
    incrementViews,
    searchSchemes,
    updateScheme,
    deleteScheme,
    addScheme,
  };

  return (
    <SchemesContext.Provider value={value}>{children}</SchemesContext.Provider>
  );
};
