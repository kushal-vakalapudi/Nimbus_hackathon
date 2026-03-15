import React, { useState, useEffect, useRef } from 'react';
// Note: Ensure 'lucide-react' is installed: npm install lucide-react
import { Send, RotateCcw, Globe, ExternalLink, ShieldCheck, User, Bot, Upload, CheckCircle } from 'lucide-react';

export default function GovAssistant() {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: 'Namaste! I am your Citizen Assistant. I can help you find government services, check eligibility for schemes, or list required documents. What can I do for you?' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [eligibilityMode, setEligibilityMode] = useState({ active: false, scheme: '', step: 0, data: {} });
  const [language, setLanguage] = useState('english');
  const scrollRef = useRef(null);

  // Translations object
  const translations = {
    english: {
      welcome: 'Namaste! I am your Citizen Assistant. I can help you find government services, check eligibility for schemes, or list required documents. What can I do for you?',
      reset: 'Session reset. All temporary data cleared. How can I help you start fresh?',
      passportText: 'To apply for a fresh Passport, you must register at the Passport Seva Portal. Here are the mandatory documents:',
      aadhaarText: 'To apply for an Aadhaar card, visit the UIDAI website or an enrolment center. Here are the required documents:',
      panText: 'To apply for a PAN card, use the NSDL or UTIITSL portal. Here are the required documents:',
      drivingText: 'To get a driving license, apply through the Parivahan Sewa portal. Here are the required documents:',
      schemeText: 'I can help with government schemes. Visit https://www.india.gov.in/my-government/schemes/search to search for schemes and check eligibility. Here are some popular ones:',
      pmkisanText: 'PM-Kisan provides income support to farmers. Eligibility: Small and marginal farmers with landholding. Visit https://www.india.gov.in/my-government/schemes/search for details.',
      pmayText: 'PMAY aims to provide affordable housing. Eligibility: Low and middle-income families. Visit https://www.india.gov.in/my-government/schemes/search for details.',
      ayushmanText: 'Ayushman Bharat provides health coverage. Eligibility: Families below poverty line. Visit https://www.india.gov.in/my-government/schemes/search for details.',
      eligibilityStart: 'To check your eligibility for {scheme}, please provide your name.',
      eligibilityAge: 'Please provide your age.',
      eligibilityLocation: 'Please provide your location (city/state).',
      eligibilityIncome: 'Please provide your annual income (in rupees).',
      eligible: 'Based on the information provided (Name: {name}, Age: {age}, Location: {location}, Income: {income}), you appear eligible for {scheme}. Please visit the official portal for final confirmation.',
      notEligible: 'Based on the information provided, you may not be eligible for {scheme}. {reason} Please check the official website for details.',
      default: "I'm looking into that. Could you please specify your state or the specific department?",
      docsTitle: 'Required Documentation',
      schemesTitle: 'Government Schemes',
      checkEligibility: 'Check Eligibility',
      dataPrivacy: 'Data Privacy Protected',
      officialLinks: 'Official Portal Links Only'
    },
    hindi: {
      welcome: 'नमस्ते! मैं आपका नागरिक सहायक हूँ। मैं सरकारी सेवाओं को खोजने, योजनाओं के लिए पात्रता जांचने, या अवसरमैन दस्तावेजों की सूची बनाने में मदद कर सकता हूँ। मैं आपकी क्या मदद कर सकता हूँ?',
      reset: 'सत्र रीसेट। सभी अस्थायी डेटा साफ़ किए गए। मैं नए सिरे से कैसे मदद कर सकता हूँ?',
      passportText: 'एक नए पासपोर्ट के लिए आवेदन करने के लिए, आपको पासपोर्ट सेवा पोर्टल पर पंजीकरण करना होगा। इक्कड़ अनिवार्य दस्तावेज हैं:',
      aadhaarText: 'आधार कार्ड के लिए आवेदन करने के लिए, UIDAI वेबसाइट या नामांकन केंद्र पर जाएँ। इक्कड़ अवसरमैन दस्तावेज हैं:',
      panText: 'PAN कार्ड के लिए आवेदन करने के लिए, NSDL या UTIITSL पोर्टल का उपयोग करें। इक्कड़ अवसरमैन दस्तावेज हैं:',
      drivingText: 'ड्राइविंग लाइसेन्स प्राप्त करने के लिए, परिवहन सेवा पोर्टल के माध्यम से आवेदन करें। इक्कड़ अवसरमैन दस्तावेज हैं:',
      schemeText: 'मैं सरकारी योजनाओं में मदद कर सकता हूँ। योजनाओं की खोज और पात्रता जांच के लिए https://www.india.gov.in/my-government/schemes/search पर जाएँ। इक्कड़ कुछ लोकप्रिय हैं:',
      pmkisanText: 'PM-Kisan किसानों को आदाय सहायता प्रदान करता है। पात्रता: छोटे और सीमांत किसान जिनके पास भूमि है। विवरण के लिए https://www.india.gov.in/my-government/schemes/search पर जाएँ।',
      pmayText: 'PMAY किफायती आवास प्रदान करने का उद्देश्य रखता है। पात्रता: कम और मध्यम आय परिवार। विवरण के लिए https://www.india.gov.in/my-government/schemes/search पर जाएँ।',
      ayushmanText: 'आयुष्मान भारत स्वास्थ्य कवरेज प्रदान करता है। पात्रता: गरीबी रेखा से नीचे परिवार। विवरण के लिए https://www.india.gov.in/my-government/schemes/search पर जाएँ।',
      eligibilityStart: '{scheme} के लिए अपनी पात्रता जांचने के लिए, कृपया अपना नाम प्रदान करें।',
      eligibilityAge: 'कृपया अपनी आयु प्रदान करें।',
      eligibilityLocation: 'कृपया अपना स्थान (शहर/राज्य) प्रदान करें।',
      eligibilityIncome: 'कृपया अपनी वार्षिक आय (रुपये में) प्रदान करें।',
      eligible: 'प्रदान की गई जानकारी के आधार पर (नाम: {name}, आयु: {age}, स्थान: {location}, आय: {income}), आप {scheme} के लिए पात्र प्रतीत होते हैं। कृपया अंतिम पुष्टि के लिए आधिकारिक पोर्टल पर जाएँ।',
      notEligible: 'प्रदान की गई जानकारी के आधार पर, आप {scheme} के लिए पात्र नहीं हो सकते। {reason} कृपया आधिकारिक वेबसाइट पर जांच करें।',
      default: 'मैं उस पर विचार कर रहा हूँ। कृपया अपना राज्य या निर्दिष्ट विभाग निर्दिष्ट करें?',
      docsTitle: 'आवश्यक दस्तावेजीकरण',
      schemesTitle: 'सरकारी योजनाएँ',
      checkEligibility: 'पात्रता जांचें',
      dataPrivacy: 'डेटा गोपनीयता संरक्षित',
      officialLinks: 'केवल आधिकारिक पोर्टल लिंक'
    },
    telugu: {
      welcome: 'నమస్కారం! నేను మీ నాగరిక సహాయకుడు. నేను ప్రభుత్వ సేవలను కనుగొనడం, పథకాల కోసం అర్హతను తనిఖీ చేయడం లేదా అవసరమైన పత్రాల జాబితాను చేయడంలో సహాయం చేయగలను. నేను మీకు ఏమి సహాయం చేయగలను?',
      reset: 'సెషన్ రీసెట్. అన్ని తాత్కాలిక డేటా తొలగించబడింది. నేను కొత్తగా ఎలా సహాయం చేయగలను?',
      passportText: 'కొత్త పాస్‌పోర్ట్‌గె అర్జి సల్లిసలు, నీవు పాస్‌పోర్ట్ సేవా పోర్టల్‌నల్లి నోందణి మాడబేకు. ఇల్లి కడ్డాయ దాఖలెగివె:',
      aadhaarText: 'ఆధార్ కార్డ్‌గె అర్జి సల్లిసలు, UIDAI వెబ్‌సైట్ అథవా నోందణి కేంద్రానికి భేటి నీడి. ఇల్లి అగత్య దాఖలెగివె:',
      panText: 'PAN కార్డ్‌గె అర్జి సల్లిసలు, NSDL అథవా UTIITSL పోర్టల్ అన్ను బళసి. ఇల్లి అగత్య దాఖలెగివె:',
      drivingText: 'డ్రైవింగ్ లైసెన్స్ పడెయలు, పరివహణ సేవా పోర్టల్ మూలక అర్జి సల్లిసి. ఇల్లి అగత్య దాఖలెగివె:',
      schemeText: 'నేను ప్రభుత్వ పథకాలలో సహాయం చేయగలను. యోజనలను హుడుకలు మత్తు అర్హతను పరిశీలించడానికి https://www.india.gov.in/my-government/schemes/search గె భేటి నీడి. ఇల్లి కొన్ని ప్రసిద్ధవైనవి ఉన్నాయి:',
      pmkisanText: 'PM-Kisan రైతులకు ఆదాయ సహాయం అందిస్తుంది. అర్హత: చిన్న మరియు మార్జినల్ రైతులు భూమి కలిగి ఉండటం. వివరాల కోసం https://www.india.gov.in/my-government/schemes/search గె భేటి నీడి.',
      pmayText: 'PMAY సరసమైన గృహాలను అందించే లక్ష్యం కలిగి ఉంది. అర్హత: తక్కువ మరియు మధ్యస్థ ఆదాయ కుటుంబాలు. వివరాల కోసం https://www.india.gov.in/my-government/schemes/search గె భేటి నీడి.',
      ayushmanText: 'ఆయుష్మాన్ భారత్ ఆరోగ్య కవరేజ్ అందిస్తుంది. అర్హత: బడతన రేఖ కంటే తక్కువ కుటుంబాలు. వివరాల కోసం https://www.india.gov.in/my-government/schemes/search గె భేటి నీడి.',
      eligibilityStart: '{scheme} గె నిమ్మ అర్హతను పరిశీలించడానికి, దయచేసి మీ పేరు అందించండి.',
      eligibilityAge: 'దయచేసి మీ వయస్సు అందించండి.',
      eligibilityLocation: 'దయచేసి మీ స్థానం (నగరం/రాష్ట్రం) అందించండి.',
      eligibilityIncome: 'దయచేసి మీ వార్షిక ఆదాయం (రూపాయలలో) అందించండి.',
      eligible: 'అందించిన సమాచారం ఆధారంగా (పేరు: {name}, వయస్సు: {age}, స్థానం: {location}, ఆదాయం: {income}), మీరు {scheme} గె అర్హులైనట్టు అనిపిస్తుంది. దయచేసి అంతిమ నిర్ధారణక్కాగి అధికారిక పోర్టల్‌గె భేటి నీడి.',
      notEligible: 'అందించిన సమాచారం ఆధారంగా, మీరు {scheme} గె అర్హులు కాకపోవచ్చు. {reason} దయచేసి అధికారిక వెబ్‌సైట్‌లో పరిశీలించి.',
      default: 'నేను అదర బగ్గె యోచిస్తున్నానె. దయచేసి మీ రాష్ట్రం అథవా నిర్దిష్ట ఇలాఖెయన్ను సూచించి?',
      docsTitle: 'అగత్య దాఖలాతి',
      schemesTitle: 'ప్రభుత్వ పథకాలు',
      checkEligibility: 'అర్హత పరిశీలించి',
      dataPrivacy: 'డేటా గౌప్యత రక్షించబడింది',
      officialLinks: 'అధికారిక పోర్టల్ లింక్‌గా మాత్ర'
    },
    kannada: {
      welcome: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ನಾಗರಿಕ ಸಹಾಯಕ. ನಾನು ಸರ್ಕಾರಿ ಸೇವೆಗಳನ್ನು ಹುಡುಕಲು, ಯೋಜನೆಗಳಿಗೆ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು ಅಥವಾ ಅಗತ್ಯ ದಾಖಲೆಗಳ ಪಟ್ಟಿಯನ್ನು ಮಾಡಲು ಸಹಾಯ ಮಾಡಬಹುದು. ನಾನು ನಿಮಗೆ ಏನು ಸಹಾಯ ಮಾಡಬಹುದು?',
      reset: 'ಸೆಷನ್ ಮರುಹೊಂದಿಸಿ. ಎಲ್ಲಾ ತಾತ್ಕಾಲಿಕ ಡೇಟಾ ತೆರವುಗೊಳಿಸಲಾಗಿದೆ. ನಾನು ಹೊಸದಾಗಿ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
      passportText: 'ಹೊಸ ಪಾಸ್‌ಪೋರ್ಟ್‌ಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು, ನೀವು ಪಾಸ್‌ಪೋರ್ಟ್ ಸೇವಾ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಣಿ ಮಾಡಬೇಕು. ಇಲ್ಲಿ ಕಡ್ಡಾಯ ದಾಖಲೆಗಳಿವೆ:',
      aadhaarText: 'ಆಧಾರ್ ಕಾರ್ಡ್‌ಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು, UIDAI ವೆಬ್‌ಸೈಟ್ ಅಥವಾ ನೋಂದಣಿ ಕೇಂದ್ರಕ್ಕೆ ಭೇಟಿ ನೀಡಿ. ಇಲ್ಲಿ ಅಗತ್ಯ ದಾಖಲೆಗಳಿವೆ:',
      panText: 'PAN ಕಾರ್ಡ್‌ಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು, NSDL ಅಥವಾ UTIITSL ಪೋರ್ಟಲ್ ಅನ್ನು ಬಳಸಿ. ಇಲ್ಲಿ ಅಗತ್ಯ ದಾಖಲೆಗಳಿವೆ:',
      drivingText: 'ಡ್ರೈವಿಂಗ್ ಲೈಸೆನ್ಸ್ ಪಡೆಯಲು, ಪರಿವಹಣ ಸೇವಾ ಪೋರ್ಟಲ್ ಮೂಲಕ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ. ಇಲ್ಲಿ ಅಗತ್ಯ ದಾಖಲೆಗಳಿವೆ:',
      schemeText: 'ನಾನು ಸರ್ಕಾರಿ ಯೋಜನೆಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡಬಹುದು. ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಲು ಮತ್ತು ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು https://www.india.gov.in/my-government/schemes/search ಗೆ ಭೇಟಿ ನೀಡಿ. ಇಲ್ಲಿ ಕೆಲವು ಜನಪ್ರಿಯವಾದವುಗಳಿವೆ:',
      pmkisanText: 'PM-Kisan ರೈತರಿಗೆ ಆದಾಯ ಸಹಾಯವನ್ನು ನೀಡುತ್ತದೆ. ಅರ್ಹತೆ: ಸಣ್ಣ ಮತ್ತು ಅಂಚೆ ರೈತರು ಭೂಮಿ ಹೊಂದಿರುವುದು. ವಿವರಗಳಿಗಾಗಿ https://www.india.gov.in/my-government/schemes/search ಗೆ ಭೇಟಿ ನೀಡಿ.',
      pmayText: 'PMAY ಕೈಗೆಟುಕುವ ಮನೆಗಳನ್ನು ನೀಡುವ ಉದ್ದೇಶವನ್ನು ಹೊಂದಿದೆ. ಅರ್ಹತೆ: ಕಡಿಮೆ ಮತ್ತು ಮಧ್ಯಮ ಆದಾಯ ಕುಟುಂಬಗಳು. ವಿವರಗಳಿಗಾಗಿ https://www.india.gov.in/my-government/schemes/search ಗೆ ಭೇಟಿ ನೀಡಿ.',
      ayushmanText: 'ಆಯುಷ್ಮಾನ್ ಭಾರತ ಆರೋಗ್ಯ ಕವರೇಜ್ ನೀಡುತ್ತದೆ. ಅರ್ಹತೆ: ಬಡತನ ರೇಖೆಯ ಕೆಳಗಿನ ಕುಟುಂಬಗಳು. ವಿವರಗಳಿಗಾಗಿ https://www.india.gov.in/my-government/schemes/search ಗೆ ಭೇಟಿ ನೀಡಿ.',
      eligibilityStart: '{scheme} ಗೆ ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು, ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನೀಡಿ.',
      eligibilityAge: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಯಸ್ಸನ್ನು ನೀಡಿ.',
      eligibilityLocation: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸ್ಥಾನವನ್ನು (ನಗರ/ರಾಷ್ಟ್ರಂ) ನೀಡಿ.',
      eligibilityIncome: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಾರ್ಷಿಕ ಆದಾಯವನ್ನು (ರೂಪಾಯಿಗಳಲ್ಲಿ) ನೀಡಿ.',
      eligible: 'ನೀಡಿದ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ (ಹೆಸರು: {name}, ವಯಸ್ಸು: {age}, ಸ್ಥಾನ: {location}, ಆದಾಯ: {income}), ನೀವು {scheme} ಗೆ ಅರ್ಹರಾಗಿರುವಂತೆ ಕಾಣುತ್ತದೆ. ದಯವಿಟ್ಟು ಅಂತಿಮ ದೃಢೀಕರಣಕ್ಕಾಗಿ ಅಧಿಕೃತ ಪೋರ್ಟಲ್‌ಗೆ ಭೇಟಿ ನೀಡಿ.',
      notEligible: 'ನೀಡಿದ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ, ನೀವು {scheme} ಗೆ ಅರ್ಹರಾಗಿರದಿರಬಹುದು. {reason} ದಯವಿಟ್ಟು ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.',
      default: 'ನಾನು ಅದರ ಬಗ್ಗೆ ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ರಾಷ್ಟ್ರಂ ಅಥವಾ ನಿರ್ದಿಷ್ಟ ಇಲಾಖೆಯನ್ನು ಸೂಚಿಸಿ?',
      docsTitle: 'ಅಗತ್ಯ ದಾಖಲಾತಿ',
      schemesTitle: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
      checkEligibility: 'ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಿ',
      dataPrivacy: 'ಡೇಟಾ ಗೌಪ್ಯತೆ ರಕ್ಷಿಸಲಾಗಿದೆ',
      officialLinks: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಲಿಂಕ್‌ಗಳು ಮಾತ್ರ'
    }
  };

  // Requirement 4: Session Management - Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Requirement 4.3: Reset Session
  const resetSession = () => {
    setMessages([{ 
      id: Date.now(), 
      type: 'bot', 
      text: translations[language].reset 
    }]);
    setEligibilityMode({ active: false, scheme: '', step: 0, data: {} });
  };

  const handleQuickAction = (service) => {
    const queries = {
      aadhaar: 'How to apply for Aadhaar card?',
      passport: 'How to apply for passport?',
      pan: 'How to apply for PAN card?',
      driving: 'How to get a driving license?',
      pmkisan: 'Tell me about PM-Kisan scheme',
      pmay: 'Tell me about PMAY scheme',
      ayushman: 'Tell me about Ayushman Bharat scheme'
    };
    setInput(queries[service]);
    handleSend({ preventDefault: () => {} });
  };

  const startEligibilityCheck = (scheme) => {
    setEligibilityMode({ active: true, scheme, step: 0, data: {} });
    setMessages((prev) => [
      ...prev,
      { 
        id: Date.now(), 
        type: 'bot', 
        text: translations[language].eligibilityStart.replace('{scheme}', scheme) 
      }
    ]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = { text: translations[language].default };

      if (eligibilityMode.active) {
        const answer = input.trim();
        const newData = { ...eligibilityMode.data };
        const steps = ['name', 'age', 'location', 'income'];
        newData[steps[eligibilityMode.step]] = answer;
        const newStep = eligibilityMode.step + 1;

        if (newStep < 4) {
          const questions = [
            translations[language].eligibilityAge,
            translations[language].eligibilityLocation,
            translations[language].eligibilityIncome
          ];
          botResponse = { text: questions[newStep - 1] };
          setEligibilityMode({ ...eligibilityMode, step: newStep, data: newData });
        } else {
          const { name, age, location, income } = newData;
          let eligible = false;
          let reason = '';

          if (eligibilityMode.scheme === 'PM-Kisan') {
            if (parseInt(age) >= 18 && parseInt(income) < 600000 && location.toLowerCase().includes('rural')) {
              eligible = true;
            } else {
              reason = 'You may not qualify if you are under 18, have high income, or live in urban areas.';
            }
          } else if (eligibilityMode.scheme === 'PMAY') {
            if (parseInt(income) < 300000) {
              eligible = true;
            } else {
              reason = 'Income exceeds the limit for PMAY.';
            }
          } else if (eligibilityMode.scheme === 'Ayushman Bharat') {
            if (parseInt(income) < 500000) {
              eligible = true;
            } else {
              reason = 'Income exceeds the limit for Ayushman Bharat.';
            }
          } else {
            eligible = true;
          }

          botResponse = { 
            text: eligible 
              ? translations[language].eligible.replace('{name}', name).replace('{age}', age).replace('{location}', location).replace('{income}', income).replace('{scheme}', eligibilityMode.scheme)
              : translations[language].notEligible.replace('{scheme}', eligibilityMode.scheme).replace('{reason}', reason)
          };
          setEligibilityMode({ active: false, scheme: '', step: 0, data: {} });
        }
      } else {
        const query = input.toLowerCase();
        if (query.includes('passport')) {
          botResponse = {
            text: translations[language].passportText,
            docs: [
              { name: "Aadhaar Card", status: "Mandatory", desc: "Proof of Identity & Address", link: "https://uidai.gov.in", upload: true },
              { name: "Birth Certificate", status: "Mandatory", desc: "Proof of Date of Birth", link: "#", upload: true },
              { name: "Electricity Bill", status: "Conditional", desc: "Required if Aadhaar address is old", link: "#", upload: true }
            ]
          };
        } else if (query.includes('aadhaar')) {
          botResponse = {
            text: translations[language].aadhaarText,
            docs: [
              { name: "Proof of Identity", status: "Mandatory", desc: "e.g., Birth Certificate, PAN Card", link: "https://uidai.gov.in", upload: true },
              { name: "Proof of Address", status: "Mandatory", desc: "e.g., Electricity Bill, Bank Statement", link: "https://uidai.gov.in", upload: true },
              { name: "Photograph", status: "Mandatory", desc: "Recent passport-size photo", link: "#", upload: true }
            ]
          };
        } else if (query.includes('pan')) {
          botResponse = {
            text: translations[language].panText,
            docs: [
              { name: "Proof of Identity", status: "Mandatory", desc: "e.g., Aadhaar Card, Passport", link: "https://www.onlineservices.nsdl.com", upload: true },
              { name: "Proof of Address", status: "Mandatory", desc: "e.g., Aadhaar Card, Electricity Bill", link: "https://www.onlineservices.nsdl.com", upload: true },
              { name: "Date of Birth Proof", status: "Mandatory", desc: "e.g., Birth Certificate, School Leaving Certificate", link: "#", upload: true }
            ]
          };
        } else if (query.includes('driving') || query.includes('license')) {
          botResponse = {
            text: translations[language].drivingText,
            docs: [
              { name: "Proof of Identity", status: "Mandatory", desc: "e.g., Aadhaar Card, Passport", link: "https://parivahan.gov.in", upload: true },
              { name: "Proof of Address", status: "Mandatory", desc: "e.g., Aadhaar Card, Electricity Bill", link: "https://parivahan.gov.in", upload: true },
              { name: "Medical Certificate", status: "Mandatory", desc: "From a registered medical practitioner", link: "#", upload: true },
              { name: "Learner's License", status: "Mandatory", desc: "If applying for permanent license", link: "#", upload: true }
            ]
          };
        } else if (query.includes('scheme') || query.includes('eligible')) {
          botResponse = {
            text: translations[language].schemeText,
            schemes: [
              { name: "PM-Kisan", desc: "Financial assistance to farmers", link: "https://www.india.gov.in/my-government/schemes/search" },
              { name: "PMAY", desc: "Pradhan Mantri Awas Yojana for housing", link: "https://www.india.gov.in/my-government/schemes/search" },
              { name: "Ayushman Bharat", desc: "Health insurance scheme", link: "https://www.india.gov.in/my-government/schemes/search" },
              { name: "Swachh Bharat Mission", desc: "Clean India initiative", link: "https://www.india.gov.in/my-government/schemes/search" }
            ]
          };
        } else if (query.includes('pm-kisan')) {
          botResponse = {
            text: translations[language].pmkisanText,
            link: "https://www.india.gov.in/my-government/schemes/search"
          };
        } else if (query.includes('pmay')) {
          botResponse = {
            text: translations[language].pmayText,
            link: "https://www.india.gov.in/my-government/schemes/search"
          };
        } else if (query.includes('ayushman')) {
          botResponse = {
            text: translations[language].ayushmanText,
            link: "https://www.india.gov.in/my-government/schemes/search"
          };
        }
      }

      setMessages((prev) => [...prev, { id: Date.now() + 1, type: 'bot', ...botResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full max-w-4xl mx-auto bg-slate-50 md:h-[92vh] md:my-4 md:rounded-3xl md:shadow-2xl overflow-hidden border border-slate-200 font-sans">
      
      {/* HEADER: Requirement 5 (Accessibility/Language) */}
      <header className="bg-indigo-700 text-white p-4 md:p-6 flex justify-between items-center shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-xl">
            <Globe className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-xl tracking-tight leading-none">GovAssistant</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-[10px] md:text-xs font-medium opacity-80 uppercase">Official Support Active</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-white/10 text-white border border-white/20 rounded px-2 py-1 text-sm"
          >
            <option value="english">English</option>
            <option value="hindi">हिंदी</option>
            <option value="telugu">తెలుగు</option>
            <option value="kannada">ಕನ್ನಡ</option>
          </select>
          <button 
            onClick={resetSession}
            className="flex items-center gap-2 text-xs font-bold bg-white/10 hover:bg-white/25 px-4 py-2 rounded-full border border-white/20 transition-all active:scale-95"
          >
            <RotateCcw size={14} /> <span className="hidden sm:inline">RESET SESSION</span>
          </button>
        </div>
      </header>

      {/* CHAT AREA: Responsive & Scannable */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-slate-50 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-3 duration-500`}>
            {/* Avatar Icons */}
            <div className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm ${msg.type === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-400 border border-slate-200'}`}>
              {msg.type === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>

            {/* Bubble */}
            <div className={`relative max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm ${
              msg.type === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
            }`}>
              <p className="text-sm md:text-base leading-relaxed font-medium">{msg.text}</p>

              {/* Requirement 3: Structured Document Lists */}
              {msg.docs && (
                <div className="mt-4 space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">{translations[language].docsTitle}</p>
                  {msg.docs.map((doc, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                      <div className="pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{doc.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded ${doc.status === 'Mandatory' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                            {doc.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{doc.desc}</p>
                      </div>
                      <div className="flex gap-2">
                        {doc.upload && (
                          <label className="shrink-0 p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer">
                            <Upload size={16} />
                            <input type="file" accept="image/*" className="hidden" />
                          </label>
                        )}
                        {doc.link && doc.link !== "#" && (
                          <a href={doc.link} target="_blank" rel="noreferrer" className="shrink-0 p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors">
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Government Schemes List */}
              {msg.schemes && (
                <div className="mt-4 space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">{translations[language].schemesTitle}</p>
                  {msg.schemes.map((scheme, i) => (
                    <div key={i} className="group flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                      <div className="pr-4">
                        <span className="text-xs font-bold text-slate-900">{scheme.name}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{scheme.desc}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startEligibilityCheck(scheme.name)} className="shrink-0 p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                          <CheckCircle size={16} />
                        </button>
                        <a href={scheme.link} target="_blank" rel="noreferrer" className="shrink-0 p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors">
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Single Link for Schemes */}
              {msg.link && (
                <div className="mt-4">
                  <a href={msg.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium">
                    <ExternalLink size={16} /> {translations[language].checkEligibility}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center animate-pulse">
              <Bot size={16} />
            </div>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </main>

      {/* FOOTER: Accessible Input Area */}
      <footer className="p-4 md:p-6 bg-white border-t border-slate-200 shrink-0">
        {/* Quick Action Buttons */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          <button onClick={() => handleQuickAction('aadhaar')} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
            Aadhaar Card
          </button>
          <button onClick={() => handleQuickAction('passport')} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
            Passport
          </button>
          <button onClick={() => handleQuickAction('pan')} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
            PAN Card
          </button>
          <button onClick={() => handleQuickAction('driving')} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
            Driving License
          </button>
          <button onClick={() => handleQuickAction('pmkisan')} className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
            PM-Kisan
          </button>
          <button onClick={() => handleQuickAction('pmay')} className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
            PMAY
          </button>
          <button onClick={() => handleQuickAction('ayushman')} className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
            Ayushman Bharat
          </button>
        </div>
        <form onSubmit={handleSend} className="flex gap-3 max-w-3xl mx-auto">
          <div className="relative flex-1">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can I help you today?"
              className="w-full bg-slate-100 border-2 border-transparent rounded-2xl px-5 py-3.5 text-sm md:text-base focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-400"
              aria-label="Government query input"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hidden md:block">
              <ShieldCheck size={20} />
            </div>
          </div>
          <button 
            type="submit"
            disabled={!input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-5 md:px-7 rounded-2xl shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center"
          >
            <Send size={20} className={input.trim() ? "animate-pulse" : ""} />
          </button>
        </form>
        <div className="mt-4 flex justify-center items-center gap-6 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>{translations[language].dataPrivacy}</span>
          <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
          <span>{translations[language].officialLinks}</span>
        </div>
      </footer>
    </div>
  );
}
