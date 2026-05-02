import { LangCode, Translations, LANGUAGES } from "./types";
import { en } from "./en";
import { hi } from "./hi";
import { bn } from "./bn";
import { te } from "./te";

const translations: Record<LangCode, Translations> = {
  en, hi, bn, te,
  // These use Hindi as base with minor overrides (Devanagari script languages)
  mr: { ...hi, nav_home: "मुख्यपृष्ठ", hero_title_2: "भारताच्या निवडणुका", chat_welcome: "नमस्कार! 🙏 मी VoteWise आहे, भारताच्या निवडणूक प्रक्रियेसाठी तुमचा AI मार्गदर्शक.\n\nखालील प्रश्नांपैकी एक निवडा किंवा तुमचा स्वतःचा प्रश्न टाइप करा!" },
  gu: { ...hi, nav_home: "હોમ", hero_title_2: "ભારતની ચૂંટણીઓ", chat_welcome: "નમસ્તે! 🙏 હું VoteWise છું, ભારતની ચૂંટણી પ્રક્રિયા માટે તમારો AI માર્ગદર્શક.\n\nનીચેના પ્રશ્નોમાંથી એક પસંદ કરો અથવા તમારો પોતાનો પ્રશ્ન ટાઇપ કરો!" },
  kn: { ...hi, nav_home: "ಮುಖಪುಟ", hero_title_2: "ಭಾರತದ ಚುನಾವಣೆಗಳು", chat_welcome: "ನಮಸ್ಕಾರ! 🙏 ನಾನು VoteWise, ಭಾರತದ ಚುನಾವಣಾ ಪ್ರಕ್ರಿಯೆಗೆ ನಿಮ್ಮ AI ಮಾರ್ಗದರ್ಶಿ." },
  ml: { ...hi, nav_home: "ഹോം", hero_title_2: "ഇന്ത്യയുടെ തിരഞ്ഞെടുപ്പുകൾ", chat_welcome: "നമസ്കാരം! 🙏 ഞാൻ VoteWise ആണ്, ഇന്ത്യയുടെ തിരഞ്ഞെടുപ്പ് പ്രക്രിയയ്ക്കുള്ള നിങ്ങളുടെ AI ഗൈഡ്." },
  pa: { ...hi, nav_home: "ਹੋਮ", hero_title_2: "ਭਾਰਤ ਦੀਆਂ ਚੋਣਾਂ", chat_welcome: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! 🙏 ਮੈਂ VoteWise ਹਾਂ, ਭਾਰਤ ਦੀ ਚੋਣ ਪ੍ਰਕਿਰਿਆ ਲਈ ਤੁਹਾਡਾ AI ਗਾਈਡ." },
  ur: { ...hi, nav_home: "ہوم", hero_title_2: "ہندوستان کے انتخابات", chat_welcome: "آداب! 🙏 میں VoteWise ہوں، ہندوستان کے انتخابی عمل کے لیے آپ کا AI گائیڈ." },
  or: { ...hi, nav_home: "ହୋମ", hero_title_2: "ଭାରତର ନିର୍ବାଚନ", chat_welcome: "ନମସ୍କାର! 🙏 ମୁଁ VoteWise, ଭାରତର ନିର୍ବାଚନ ପ୍ରକ୍ରିୟା ପାଇଁ ଆପଣଙ୍କ AI ଗାଇଡ୍." },
  ta: { ...hi, nav_home: "முகப்பு", hero_title_2: "இந்தியாவின் தேர்தல்கள்", chat_welcome: "வணக்கம்! 🙏 நான் VoteWise, இந்தியாவின் தேர்தல் செயல்முறைக்கான உங்கள் AI வழிகாட்டி." },
  as: { ...hi, nav_home: "হোম", hero_title_2: "ভাৰতৰ নিৰ্বাচন", chat_welcome: "নমস্কাৰ! 🙏 মই VoteWise, ভাৰতৰ নিৰ্বাচন প্ৰক্ৰিয়াৰ বাবে আপোনাৰ AI গাইড." },
  mni: { ...hi, nav_home: "ꯍꯣꯝ", hero_title_2: "ꯏꯟꯗꯤꯌꯥꯒꯤ ꯃꯤꯈꯜꯁꯤꯡ", chat_welcome: "ꯈꯨꯔꯨꯃꯖꯔꯤ! 🙏 ꯑꯩꯍꯥꯛ ꯚꯣꯠꯋꯥꯏꯁꯅꯤ, ꯏꯟꯗꯤꯌꯥꯒꯤ ꯃꯤꯈꯜꯒꯤ ꯊꯧꯑꯣꯡꯒꯤꯗꯃꯛ ꯅꯍꯥꯛꯀꯤ AI ꯂꯃꯖꯤꯡꯕꯅꯤ." },
};

export function getTranslations(lang: LangCode): Translations {
  return translations[lang] || en;
}

export function t(lang: LangCode, key: keyof Translations): string {
  const tr = translations[lang] || en;
  return tr[key] || en[key] || key;
}

export { LANGUAGES };
export type { LangCode, Translations };
