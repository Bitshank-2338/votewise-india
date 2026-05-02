export type LangCode =
  | "en" | "hi" | "bn" | "te" | "ta"
  | "mr" | "gu" | "kn" | "ml" | "pa" | "ur" | "or" | "as" | "mni";

export interface Language {
  code: LangCode;
  name: string;        // English name
  nativeName: string;  // Name in its own script
  script: string;      // Script name
}

export const LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English", script: "Latin" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", script: "Devanagari" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", script: "Bengali" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", script: "Telugu" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", script: "Devanagari" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", script: "Tamil" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", script: "Gujarati" },
  { code: "ur", name: "Urdu", nativeName: "اردو", script: "Nastaliq" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", script: "Kannada" },
  { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ", script: "Odia" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", script: "Malayalam" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", script: "Gurmukhi" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া", script: "Assamese" },
  { code: "mni", name: "Manipuri", nativeName: "ꯃꯤꯇꯩꯂꯣꯟ", script: "Meitei Mayek" },
];

/** All translatable keys */
export interface Translations {
  // Nav
  nav_home: string;
  nav_ask_ai: string;
  nav_tools: string;
  nav_news: string;
  nav_timeline: string;

  // Hero
  hero_badge: string;
  hero_title_1: string;
  hero_title_2: string;
  hero_subtitle: string;
  hero_btn_ai: string;
  hero_btn_news: string;

  // Stats
  stat_voters: string;
  stat_seats: string;
  stat_booths: string;
  stat_phases: string;

  // Features
  feat_title: string;
  feat_subtitle: string;
  feat_ai_title: string;
  feat_ai_desc: string;
  feat_timeline_title: string;
  feat_timeline_desc: string;
  feat_news_title: string;
  feat_news_desc: string;
  feat_tools_title: string;
  feat_tools_desc: string;

  // Timeline
  tl_title: string;
  tl_subtitle: string;
  tl_phase: string;
  tl_p1_title: string; tl_p1_sub: string; tl_p1_desc: string;
  tl_p2_title: string; tl_p2_sub: string; tl_p2_desc: string;
  tl_p3_title: string; tl_p3_sub: string; tl_p3_desc: string;
  tl_p4_title: string; tl_p4_sub: string; tl_p4_desc: string;
  tl_p5_title: string; tl_p5_sub: string; tl_p5_desc: string;
  tl_p6_title: string; tl_p6_sub: string; tl_p6_desc: string;
  tl_p7_title: string; tl_p7_sub: string; tl_p7_desc: string;

  // FAQ
  faq_title: string;
  faq_subtitle: string;
  faq_q1: string; faq_a1: string;
  faq_q2: string; faq_a2: string;
  faq_q3: string; faq_a3: string;
  faq_q4: string; faq_a4: string;
  faq_q5: string; faq_a5: string;
  faq_q6: string; faq_a6: string;

  // Chat
  chat_header_title: string;
  chat_header_sub: string;
  chat_welcome: string;
  chat_placeholder: string;
  chat_disclaimer: string;
  chat_clear: string;
  chat_q1: string; chat_q2: string; chat_q3: string; chat_q4: string;
  chat_q5: string; chat_q6: string; chat_q7: string; chat_q8: string;

  // News
  news_title: string;
  news_subtitle: string;
  news_all: string;
  news_politics: string;
  news_tech: string;
  news_business: string;
  news_world: string;
  news_read_more: string;
  news_empty: string;
  news_show_all: string;

  // Tools
  tools_title: string;
  tools_subtitle: string;
  tools_check_reg: string; tools_check_reg_desc: string;
  tools_register: string; tools_register_desc: string;
  tools_find_booth: string; tools_find_booth_desc: string;
  tools_know_candidate: string; tools_know_candidate_desc: string;
  tools_helpline_app: string; tools_helpline_app_desc: string;
  tools_contact_eci: string; tools_contact_eci_desc: string;
  tools_docs_title: string;
  tools_docs_subtitle: string;

  // CTA
  cta_title: string;
  cta_subtitle: string;
  cta_btn: string;
  cta_timeline_title: string;
  cta_timeline_sub: string;
  cta_tools_title: string;
  cta_tools_sub: string;

  // Footer
  footer_text: string;
  footer_disclaimer: string;

  // 404
  not_found_title: string;
  not_found_msg: string;
  not_found_home: string;
  not_found_ai: string;
  not_found_tools: string;

  // Ticker
  ticker_1: string;
  ticker_2: string;
  ticker_3: string;
  ticker_4: string;

  // Fact-Check (Optional for non-primary langs)
  nav_factcheck?: string;
  fc_title?: string;
  fc_subtitle?: string;
  fc_placeholder?: string;
  fc_btn?: string;
  fc_disclaimer?: string;
  feat_fc_title?: string;
  feat_fc_desc?: string;
}
