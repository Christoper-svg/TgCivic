import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "en" | "hi" | "te";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

// Translation object
const translations = {
  // Navigation
  home: {
    en: "Home",
    hi: "होम",
    te: "హోమ్",
  },
  register_complaint: {
    en: "Register Complaint",
    hi: "शिकायत दर्ज करें",
    te: "ఫిర్యాదు నమోదు",
  },
  track_complaint: {
    en: "Track Complaint",
    hi: "शिकायत ट्रैक करें",
    te: "ఫిర్యాదు ట్రాక్ చేయండి",
  },
  dashboard: {
    en: "Dashboard",
    hi: "डैशबोर्ड",
    te: "డాష్‌బోర్డ్",
  },
  citizen_services: {
    en: "Citizen Services",
    hi: "नागरिक सेवाएं",
    te: "పౌర సేవలు",
  },
  contact: {
    en: "Contact",
    hi: "संपर्क",
    te: "సంప్రదించండి",
  },
  help: {
    en: "Help",
    hi: "मदद",
    te: "సహాయం",
  },
  sign_in: {
    en: "Sign In",
    hi: "साइन इन",
    te: "సైన్ ఇన్",
  },
  register: {
    en: "Register",
    hi: "रजिस्टर",
    te: "రిజిస్టర్",
  },
  logout: {
    en: "Logout",
    hi: "लॉगआउट",
    te: "లాగ్ అవుట్",
  },
  notifications: {
    en: "Notifications",
    hi: "सूचनाएं",
    te: "నోటిఫికేషన్లు",
  },
  profile: {
    en: "Profile",
    hi: "प्रोफाइल",
    te: "ప్రొఫైల్",
  },
  settings: {
    en: "Settings",
    hi: "सेटिंग्स",
    te: "సెట్టింగ్‌లు",
  },

  // Homepage
  transform_your_city: {
    en: "Transform Your City",
    hi: "अपने शहर को बदलें",
    te: "మీ నగరాన్ని మార్చండి",
  },
  one_report_at_time: {
    en: "One Report at a Time",
    hi: "एक समय में एक रिपोर्ट",
    te: "ఒక సమయంలో ఒక రిపోర్ట్",
  },
  join_digital_revolution: {
    en: "Join the digital revolution in civic engagement. Report issues, track progress, and see real change happen in your community with TG Civic.",
    hi: "नागरिक भागीदारी में डिजिटल क्रांति में शामिल हों। समस्याओं की रिपोर्ट करें, प्रगति को ट्रैक करें, और TG Civic के साथ अपने समुदाय में वास्तविक बदलाव देखें।",
    te: "పౌర భాగస్���ామ్యంలో డిజిటల్ విప్లవంలో చేరండి. సమస్యలను నివేదించండి, పురోగతిని ట్రాక్ చేయండి మరియు TG Civic తో మీ కమ్యూనిటీలో నిజమైన మార్పును చూడండి.",
  },
  report_an_issue: {
    en: "Report an Issue",
    hi: "समस्या रिपोर्ट करें",
    te: "సమస్యను నివేదించండి",
  },
  track_progress: {
    en: "Track Progress",
    hi: "प्रगति ट्रैक करें",
    te: "పురోగతిని ట్రాక్ చేయండి",
  },

  // Categories
  roads: {
    en: "Roads & Transport",
    hi: "सड़कें और परिवहन",
    te: "రోడ్లు మరియు రవాణా",
  },
  water: {
    en: "Water Supply",
    hi: "पानी की आपूर्ति",
    te: "నీటి సరఫరా",
  },
  sanitation: {
    en: "Sanitation",
    hi: "स्वच्छता",
    te: "పరిశుభ్రత",
  },
  electricity: {
    en: "Electricity",
    hi: "बिजली",
    te: "విద్యుత్",
  },
  street_lights: {
    en: "Street Lights",
    hi: "स्ट्रीट लाइट्स",
    te: "వీధి దీపాలు",
  },
  safety: {
    en: "Public Safety",
    hi: "सार्वजनिक सुरक्षा",
    te: "ప్రజా భద్రత",
  },

  // Stats
  complaints_registered: {
    en: "Complaints Registered",
    hi: "शिकायतें ���र्ज",
    te: "ఫిర్యాదులు నమోదు",
  },
  issues_resolved: {
    en: "Issues Resolved",
    hi: "समस्याएं हल",
    te: "సమస్యలు పరిష్కరించబడ్డాయి",
  },
  days_average: {
    en: "Days Average",
    hi: "औसत दिन",
    te: "రోజుల సగటు",
  },
  active_citizens: {
    en: "Active Citizens",
    hi: "सक्रिय नागरिक",
    te: "చురుకైన పౌరులు",
  },
  this_month: {
    en: "This Month",
    hi: "इस महीने",
    te: "ఈ నెల",
  },
  success_rate: {
    en: "Success Rate: 94%",
    hi: "सफलता दर: 94%",
    te: "విజయ రేటు: 94%",
  },
  resolution_time: {
    en: "Resolution Time",
    hi: "समाधान समय",
    te: "రిజల్యూషన్ సమయం",
  },
  registered_users: {
    en: "Registered Users",
    hi: "पंजीकृत उपयोगकर्ता",
    te: "నమోదిత వినియోగదారులు",
  },

  // Features
  smart_registration: {
    en: "Smart Registration",
    hi: "स्मार्ट पंजीकरण",
    te: "స్మార్ట్ రిజిస్ట్రేషన్",
  },
  smart_registration_desc: {
    en: "AI-powered complaint categorization with photo upload and GPS location",
    hi: "फोटो अपलोड और GPS स्थान के साथ AI-संचालित शिकायत वर्गीकरण",
    te: "ఫోటో అప్‌లోడ్ మరియు GPS లొకేషన్‌తో AI-శక్తితో కూడిన ఫిర్యాదు వర్గీకరణ",
  },
  real_time_tracking: {
    en: "Real-time Tracking",
    hi: "रियल-टाइम ट्रैकिंग",
    te: "రియల్-టైమ్ ట్రాకింగ్",
  },
  real_time_tracking_desc: {
    en: "Live status updates with SMS notifications and estimated completion",
    hi: "SMS सूचनाओं और अनुमानित पूर्णता के साथ लाइव स्थिति अपडेट",
    te: "SMS నోటిఫికేషన్‌లు మరియు అంచనా పూర్తితో లైవ్ స్టేటస్ అప్‌డేట్‌లు",
  },
  multilingual_support: {
    en: "Multilingual Support",
    hi: "बहुभाषी समर्थन",
    te: "బహుభాషా మద్దతు",
  },
  multilingual_support_desc: {
    en: "Available in Telugu, Hindi & English with voice-to-text support",
    hi: "वॉयस-टू-टेक्स्ट स���र्थन के साथ तेलुगु, हिंदी और अंग्रेजी में उपलब्ध",
    te: "వాయిస్-టు-టెక్స్ట్ మద్దతుతో తెలుగు, హిందీ మరియు ఇంగ్లీష్‌లో అందుబాటులో ఉంది",
  },
  ai_assistant: {
    en: "AI Assistant",
    hi: "AI सहायक",
    te: "AI అసిస్టెంట్",
  },
  ai_assistant_desc: {
    en: "24/7 intelligent chatbot for instant help and guidance",
    hi: "तत्काल सहायता और मार्गदर्शन के लिए 24/7 बुद्धिमान चैटबॉट",
    te: "తక్షణ సహాయం మరియు మార్గదర్శకత్వం కోసం 24/7 తెలివైన చాట్‌బాట్",
  },

  // Notifications
  stay_updated: {
    en: "Stay updated with your civic activities and system alerts",
    hi: "अपनी नागरिक गतिविधियों और सिस्टम अलर्ट के साथ अपडेट रहें",
    te: "మీ పౌర కార్యకలాపాలు మరియు సిస్టమ్ అలర్ట్‌లతో అప్‌డేట్‌గా ఉండండి",
  },
  total: {
    en: "Total",
    hi: "कुल",
    te: "మొత్తం",
  },
  unread: {
    en: "Unread",
    hi: "अपठित",
    te: "చదవని",
  },
  today: {
    en: "Today",
    hi: "आज",
    te: "నేడు",
  },
  all: {
    en: "All",
    hi: "सभी",
    te: "అన్ని",
  },
  read: {
    en: "Read",
    hi: "पढ़ा गया",
    te: "చదివింది",
  },
  no_notifications_found: {
    en: "No notifications found",
    hi: "कोई सूचना नहीं मिली",
    te: "నోటిఫికేషన్‌లు కనుగొనబడలేదు",
  },
  all_caught_up: {
    en: "You're all caught up! No unread notifications.",
    hi: "आप सभी अप-टू-डेट हैं! कोई अपठित सूचना नहीं।",
    te: "మీరు అన్నింటినీ చూశారు! చదవని నోటిఫికేషన్‌లు లేవు.",
  },
  mark_all_read: {
    en: "Mark All as Read",
    hi: "सभी को पढ़ा गया चिह्नित करें",
    te: "అన్నింటినీ చదివినట్లు గుర్తు పెట్టండి",
  },
  clear_all: {
    en: "Clear All",
    hi: "सभी साफ़ करें",
    te: "అన్నింటినీ క్లియర్ చేయండి",
  },

  // Common
  loading: {
    en: "Loading...",
    hi: "लोड हो रहा है...",
    te: "లోడ్ అవుతోంది...",
  },
  error: {
    en: "Error",
    hi: "त्रुटि",
    te: "లోపం",
  },
  success: {
    en: "Success",
    hi: "सफलता",
    te: "విజయం",
  },
  cancel: {
    en: "Cancel",
    hi: "रद्द करें",
    te: "రద్దు చేయండి",
  },
  confirm: {
    en: "Confirm",
    hi: "पुष्टि करें",
    te: "నిర్ధారించండి",
  },
  save: {
    en: "Save",
    hi: "सेव करें",
    te: "సేవ్ చేయండి",
  },
  delete: {
    en: "Delete",
    hi: "हटाएं",
    te: "తొలగించండి",
  },
  edit: {
    en: "Edit",
    hi: "संपादित करें",
    te: "సవరించండి",
  },
  view: {
    en: "View",
    hi: "देखें",
    te: "చూడండి",
  },
  back: {
    en: "Back",
    hi: "वापस",
    te: "వెనుకకు",
  },
  next: {
    en: "Next",
    hi: "अगला",
    te: "తదుపరి",
  },
  submit: {
    en: "Submit",
    hi: "जमा करें",
    te: "సమర్పించండి",
  },
  close: {
    en: "Close",
    hi: "बंद करें",
    te: "మూసివేయండి",
  },

  // AI Chatbot Translations
  ai_greeting: {
    en: "Hello! I'm your TG Civic AI assistant. I can help you with complaint registration, tracking, and answer your questions. How can I assist you today?",
    hi: "नमस्ते! मैं आपका TG Civic AI सहायक हूं। मैं शिकायत पंजीकरण, ट्रैकिंग में आपकी मदद कर सकता हूं और आपके प्रश्नों का उत्तर दे सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
    te: "నమస్కారం! నేను మీ TG Civic AI అసిస్టెంట్. నేను ఫిర్యాద�� నమోదు, ట్రాకింగ్‌లో మీకు స���ాయం చేయగలను మరియు మీ ప్రశ్నలకు సమాధానాలు ఇవ్వగలను. ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?",
  },
  ai_online_status: {
    en: "Online • Ready to help",
    hi: "ऑनलाइन • मदद के लिए तैयार",
    te: "ఆన్‌లైన్ • సహాయానికి సిద్ధం",
  },
  ai_register_help: {
    en: "To register a complaint: 1) Click 'Register Complaint' in the navigation, 2) Select your issue category (roads, water, etc.), 3) Fill in all details including photos and location, 4) Submit to get your tracking ID. Would you like me to guide you through a specific step?",
    hi: "शिकायत दर्ज करने के लिए: 1) नेवीगेशन में 'शिकायत दर्ज करें' पर क्लिक करें, 2) अपनी स���स्या की श्रेणी चुनें (सड़कें, पानी, आदि), 3) फोटो और स्थान सहित सभी विवरण भरें, 4) अपना ट्रैकिंग ID प्राप्त करने के लिए सबमिट करें। क्या आप चाहेंगे कि मैं आपको किसी विशेष चरण के माध्यम से मार्गदर्शन करूं?",
    te: "ఫిర్యాదు నమోదు చేయడానికి: 1) నావిగేషన్‌లో 'ఫిర్యాదు నమోదు' మీద క్లిక్ చేయండి, 2) మీ సమస్య వర్గాన్ని ఎంచుకోండి (రోడ్లు, నీరు, మొదలైనవి), 3) ఫోటోలు మరియు లొకేషన్‌తో సహా అన్ని వివరాలను పూరించండి, 4) మీ ట్రాకింగ్ ID పొందడానికి సమర్పించండి. నేను మిమ్మల్ని ఏదైనా నిర్దిష్ట దశ ద్వారా మార్గదర్శనం చేయాలని మీరు అనుకుంటున్నారా?",
  },
  ai_track_help: {
    en: "To track your complaint: 1) Go to 'Track Complaint' page, 2) Enter your complaint ID (format: TGC2024XXXXXX) or phone number, 3) View complete status history and details. Do you have your complaint ID?",
    hi: "अपनी शिकायत को ट्रैक करने के लिए: 1) 'शिकायत ट्र���क करें' पेज पर जाएं, 2) अपना शिकायत ID (प्रारूप: TGC2024XXXXXX) या फोन नंबर दर्ज करें, 3) पूर्ण स्थिति इतिहास और विवरण देखें। क्या आपके पास अपना शिकायत ID है?",
    te: "మీ ఫిర్యాదును ట్రాక్ చేయడానికి: 1) 'ఫిర్యాదు ట్రాక్ చేయండి' పేజీకి వెళ్లండి, 2) మీ ఫిర్యాదు ID (ఫార్మాట్: TGC2024XXXXXX) లేదా ఫోన్ నంబర్ నమోదు ��ేయండి, 3) పూర్తి స్థితి చరిత్ర మరియు వివరాలను చూడండి. మీ దగ్గర మీ ఫిర్యాదు ID ఉందా?",
  },
  ai_time_help: {
    en: "Resolution times vary by issue type: Roads (3-7 days), Water (2-5 days), Street lights (1-2 days), Sanitation (1-3 days). You'll receive SMS/email updates throughout the process. Is there a specific type of issue you're asking about?",
    hi: "समाधान का समय समस्या के प्रकार के अनुसार अलग होता है: सड़कें (3-7 दिन), पानी (2-5 दिन), स्ट्रीट लाइट (1-2 दिन), स्वच्छता (1-3 दिन)। पूरी प्रक्रिया के दौरान आपको SMS/ईमेल अपडेट मिलेंगे। क्या कोई विशेष प्रकार की समस्या है जिसके बारे में आप पूछ रहे हैं?",
    te: "పరిష్కార సమయాలు సమస్య రకం ఆధారంగా మారుతాయి: రోడ్లు (3-7 రోజులు), నీరు (2-5 రోజులు), వీధి దీపాలు (1-2 రోజులు), పరిశుభ్రత (1-3 రోజులు). మొత్తం ప్రక్రియ అంతా మీకు SMS/ఇమెయిల్ అప్‌డేట్‌లు వస్తాయి. మీరు ఏదైనా నిర్దిష్ట రకం సమస్య గురించి అడుగుతున్నారా?",
  },
  ai_photo_help: {
    en: "You can upload up to 5 photos during complaint registration. Photos help officials understand the problem better. Supported formats: JPG, PNG, WebP. Click the camera icon or drag photos to the upload area.",
    hi: "शिकायत पंजीकरण के दौरान आप 5 तक फोटो अपलोड कर सकते हैं। फोटो अधिकारियों को समस्या को बेहतर ढंग से समझने में मदद करती हैं। समर्थित प्रारूप: JPG, PNG, WebP। कैमरा आइकन पर क्लिक करें या फोट��� को अपलोड क्षेत्र में खींचें।",
    te: "ఫిర్యాదు నమోదు సమయంలో మీరు 5 ఫోటోలు వరకు అప్‌లోడ్ చేయవచ్చు. ఫోటోలు అధికారులకు సమస్యను బాగా అర్థం చేసుకోవడంలో సహాయపడతాయి. మద్దతు ఉన్న ఫార్మాట్‌లు: JPG, PNG, WebP. కెమెరా ఐకాన్‌పై క్లిక్ చేయండి లేదా ఫోటోలను అప్‌లోడ్ ప్రాంతానికి లాగండి.",
  },
  ai_location_help: {
    en: "For location: 1) Use 'My Location' button for automatic GPS detection, 2) Or manually enter your address, 3) Add nearby landmarks for better identification. Accurate location helps officials reach the right spot quickly.",
    hi: "स्थान के लिए: 1) स्वचालित GPS खोज के लिए 'मेरा स्थान' बटन का उपयोग करें, 2) या मैन्युअल रूप से अपना पता दर्ज करें, 3) बेहतर पहचान के लिए आस-पास के स्थलचिह्न जोड़ें। सटीक स्थान अधिकारियों को सही जगह जल्दी पहुंचने में मदद करता है।",
    te: "లొకేషన్ కోసం: 1) ఆటోమేటిక్ GPS గుర్తింపు కోసం 'నా లొకేషన్' బటన్ ఉపయోగించండి, 2) లేదా మాన్యువల్‌గా మీ చిరునామా నమోదు చేయండి, 3) మంచి గుర్తింపు కోసం సమీపంలోని ల్యాండ్‌మార్క్‌లను జోడించండి. ఖచ్చితమైన లొకేషన్ అధికారులకు సరైన ప్రదేశాన���కి త్వరగా చేరుకోవడంలో సహాయపడుతుంది.",
  },
  ai_contact_help: {
    en: "You can contact support: 📞 Helpline: 1800-XXX-XXXX (24/7), 📧 Email: support@tgcivic.gov.in, 🏢 Visit your local municipal office, or continue chatting with me for immediate help!",
    hi: "आप सहायता से संपर्क कर सकते हैं: 📞 हेल्पलाइन: 1800-XXX-XXXX (24/7), 📧 ईमेल: support@tgcivic.gov.in, 🏢 अपने स्थानीय नगरपालिका कार्यालय में जाएं, या तत्काल सहायता के लिए मुझसे चैट करना जारी रखें!",
    te: "మీరు మద్దతును సంప్రదించవచ్చు: 📞 హెల్ప్‌లైన్: 1800-XXX-XXXX (24/7), 📧 ఇమెయిల్: support@tgcivic.gov.in, 🏢 మీ స్థానిక మునిసిపల్ కార్యాలయాన్ని సందర్శించండి, లేదా తక్షణ సహాయం కోసం నాతో చాట్ చేయడం కొనసాగించండి!",
  },
  ai_thanks: {
    en: "You're welcome! I'm here to help with any questions about TG Civic. Feel free to ask about complaint registration, tracking, or any other civic services. Is there anything else you'd like to know?",
    hi: "आपका स्वागत है! मैं TG Civic के बारे में किसी भी प्रश्न में मदद के लिए यहां हूं। शिकायत पंजीकरण, ट्रैकिंग, या किसी अन्य नागरिक सेवा के बारे में बेझिझक पूछें। क्या कुछ और है जो आप जानना चाहते हैं?",
    te: "మీకు స్వాగతం! TG Civic గురించి ఏవైనా ప్రశ్నలతో సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. ఫిర్యాదు నమోదు, ట్రాకింగ్ లేదా ఏవైనా ఇతర పౌర సేవల గురించి అడగడానికి వెనుకాడకండి. మీరు తెలుసుకోవాలని అనుకునే ఇంకేమైనా ఉందా?",
  },
  ai_emergency: {
    en: "For emergencies: 🚨 Call 100 (Police), 🚒 Call 101 (Fire), 🚑 Call 108 (Ambulance). For urgent civic issues, register a complaint and mark it as 'High Priority'. Emergency complaints are processed immediately.",
    hi: "आपातकाल के लिए: 🚨 100 कॉल करें (पुलिस), 🚒 101 कॉल करें (फायर), 🚑 108 कॉल करें (एम्बुलेंस)। तत्काल नागरिक मुद्दों के लिए, एक शिकायत दर्ज करें और इसे 'उच्च प्राथमिकता' के रूप में चिह्नित करें। आपातकालीन शिकायतों को तुरंत संसाधित किया जाता है।",
    te: "అత్యవసర పరిస్థితుల కోసం: 🚨 100కు కాల్ చేయండి (పోలీసు), 🚒 101కు కాల్ చేయండి (అగ్నిమాపక), 🚑 108కు కాల్ చేయండి (అంబులెన్స్). అత్యవసర పౌర సమస్యల కోసం, ఫిర్యాదు నమోదు చేసి దానిని 'అధిక ప్రాధాన్యత'గా గుర్తు పెట్టండి. అత్యవసర ఫిర్యాదులు వెంటనే ప్రాసెస్ చేయబడతాయి.",
  },
  ai_default: {
    en: "I'd be happy to help! I can assist you with: 1) Registering complaints, 2) Tracking complaint status, 3) Understanding the resolution process, 4) Technical support. Could you please be more specific about what you need help with?",
    hi: "मैं खुशी से मदद करूंगा! मैं आपकी सहायता कर सकता हूं: 1) शिकायतें दर्ज करना, 2) शिकायत की स्थिति ट्रैक करना, 3) समाधान प्रक्रिया को समझना, 4) तकनीकी सहायता। क्या आप कृपया अधिक विशिष्ट बता सकते हैं कि आपको किस चीज़ में मदद चाहिए?",
    te: "నేను సంతోషంగా సహాయం చేస్తాను! నేను మీకు ఈ విషయాలలో సహాయం చేయగలను: 1) ఫిర్యాదులు నమోదు చేయడం, 2) ఫిర్యాదు స్థితిని ట్రాక్ చేయడం, 3) పరిష్కార ప్రక్రియను అర్థం చేసుకోవడం, 4) సాంకేతిక మద్దతు. దయచేసి మీకు ఏ విషయంలో సహాయం కావాలో మరింత నిర్దిష్టంగా చెప్పగలరా?",
  },
  ai_quick_register: {
    en: "How to register complaint?",
    hi: "शिकायत कैसे दर्ज करें?",
    te: "ఫిర్యాదు ఎలా నమోదు చేయాలి?",
  },
  ai_quick_track: {
    en: "Track my complaint",
    hi: "मेरी शिकायत ट्रैक करें",
    te: "నా ఫిర్యాదు ట్రాక్ చేయండి",
  },
  ai_quick_documents: {
    en: "What documents needed?",
    hi: "कौन से दस्तावेज़ चाहिए?",
    te: "ఏ పత్రాలు అవసరం?",
  },
  ai_quick_time: {
    en: "How long to resolve?",
    hi: "हल होने में कितना समय?",
    te: "పరిష���కరించడానికి ఎంత సమయం?",
  },
  ai_quick_support: {
    en: "Contact support",
    hi: "सहायता से संपर्क करें",
    te: "మద్దతును సంప్రదించండి",
  },
  ai_quick_another: {
    en: "Ask another question",
    hi: "दूसरा प्रश्न पूछें",
    te: "మరో ప్రశ్న అడగండి",
  },
  ai_register_btn: {
    en: "Register",
    hi: "दर्ज करें",
    te: "నమోదు",
  },
  ai_track_btn: {
    en: "Track",
    hi: "ट्रैक करें",
    te: "ట్రాక్ చేయండి",
  },
  ai_support_btn: {
    en: "Support",
    hi: "सहायता",
    te: "మద్దతు",
  },

  // Homepage Statistics Labels (missing translations)
  complaints_registered: {
    en: "Complaints Registered",
    hi: "दर्ज शिकायतें",
    te: "నమోదైన ఫిర్యాదులు",
  },
  this_month: {
    en: "This Month",
    hi: "इस महीने",
    te: "ఈ నెల",
  },
  issues_resolved: {
    en: "Issues Resolved",
    hi: "समाधान किए गए मुद्दे",
    te: "పరిష్కరించబడిన సమస్యలు",
  },
  success_rate: {
    en: "Success Rate",
    hi: "सफलता दर",
    te: "విజయ రేటు",
  },
  days_average: {
    en: "Days Average",
    hi: "औसत दिन",
    te: "సగటు రోజులు",
  },
  resolution_time: {
    en: "Resolution Time",
    hi: "समाधान समय",
    te: "పరిష���కార సమయం",
  },
  active_citizens: {
    en: "Active Citizens",
    hi: "सक्रिय नागरिक",
    te: "క్రియాశీల పౌరులు",
  },
  registered_users: {
    en: "Registered Users",
    hi: "पंजीकृत उपयोगकर्ता",
    te: "నమోదిత వినియోగదారులు",
  },
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("tg-civic-language") as Language;
    if (savedLanguage && ["en", "hi", "te"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("tg-civic-language", language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: string, fallback?: string): string => {
    const keys = key.split(".");
    let current: any = translations;

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        return fallback || key;
      }
    }

    if (current && typeof current === "object" && language in current) {
      return current[language];
    }

    return fallback || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
