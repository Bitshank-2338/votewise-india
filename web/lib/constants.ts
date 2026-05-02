/* Indian Election Process — Timeline Phases & Constants */

export const ELECTION_PHASES = [
  {
    id: "announcement",
    icon: "📢",
    title: "Election Announcement",
    subtitle: "Model Code of Conduct",
    description:
      "The Election Commission of India (ECI) announces election dates. The Model Code of Conduct comes into effect immediately, restricting the ruling party from making policy announcements or using government resources for campaigning.",
    details: [
      "ECI announces schedule for all phases",
      "Model Code of Conduct enforced immediately",
      "No new government schemes or announcements",
      "All political advertising must be pre-certified",
    ],
  },
  {
    id: "nomination",
    icon: "📋",
    title: "Nomination & Scrutiny",
    subtitle: "Candidate Filing",
    description:
      "Candidates file nomination papers with the Returning Officer. Each nomination is scrutinized for eligibility — age (25+ for Lok Sabha), citizenship, no criminal disqualification, and valid party ticket or independent status.",
    details: [
      "Candidates file nomination papers",
      "Security deposit: ₹25,000 (General) / ₹12,500 (SC/ST)",
      "Scrutiny of nominations by Returning Officer",
      "Withdrawal period for candidates",
    ],
  },
  {
    id: "campaigning",
    icon: "🗣️",
    title: "Campaigning",
    subtitle: "Public Outreach",
    description:
      "Parties and candidates conduct rallies, door-to-door canvassing, and media campaigns. There are strict spending limits — ₹95 lakh for Lok Sabha and ₹40 lakh for Vidhan Sabha candidates. Campaigning must stop 48 hours before polling.",
    details: [
      "Rallies, roadshows, and public meetings",
      "Expenditure limits enforced by ECI",
      "Social media and advertising regulations",
      "Campaign silence period: 48 hours before polling",
    ],
  },
  {
    id: "voter-prep",
    icon: "🪪",
    title: "Voter Preparation",
    subtitle: "EPIC Card & Enrollment",
    description:
      "Citizens must register on the electoral roll and obtain their EPIC (Electors Photo Identity Card). You can verify your registration on the NVSP portal or Voter Helpline 1950. Voter slips are distributed by Booth Level Officers.",
    details: [
      "Check enrollment on NVSP (nvsp.in)",
      "Carry EPIC card or 12 approved photo IDs",
      "Know your polling booth via Voter Helpline App",
      "Special provisions for PwD, senior citizens, NRIs",
    ],
  },
  {
    id: "polling",
    icon: "🗳️",
    title: "Polling Day",
    subtitle: "Cast Your Vote",
    description:
      "Voting happens using Electronic Voting Machines (EVMs) with a Voter Verified Paper Audit Trail (VVPAT). Polling is held from 7 AM to 6 PM typically. NOTA (None Of The Above) is also an option on the ballot.",
    details: [
      "Voting via EVM + VVPAT system",
      "Indelible ink mark on left index finger",
      "NOTA option available on every ballot",
      "Paid holiday for all employees on polling day",
      "No liquor sale during polling hours",
    ],
  },
  {
    id: "counting",
    icon: "📊",
    title: "Counting & Results",
    subtitle: "Vote Tallying",
    description:
      "After all phases complete, EVMs are stored in strongrooms under CCTV. On counting day, EVMs are opened in the presence of candidates/agents. VVPAT slips of 5 random booths per constituency are verified against EVM counts.",
    details: [
      "EVMs stored in sealed strongrooms",
      "Counting under observation of candidates",
      "VVPAT verification of 5 random booths",
      "Results declared constituency by constituency",
      "ECI website shows real-time trends",
    ],
  },
  {
    id: "formation",
    icon: "🏛️",
    title: "Government Formation",
    subtitle: "Oath & Governance",
    description:
      "The party or coalition with majority (272+ seats in Lok Sabha) is invited by the President to form the government. The Prime Minister and Council of Ministers take oath. If no clear majority, the largest party may be asked to prove majority on the floor.",
    details: [
      "Majority mark: 272 seats in Lok Sabha (543 total)",
      "President invites majority party/coalition",
      "PM and Cabinet take oath of office",
      "Floor test if majority is contested",
      "Opposition leader recognized",
    ],
  },
];

export const QUICK_QUESTIONS = [
  "How does voting work in India?",
  "What is an EVM and VVPAT?",
  "How do I register to vote?",
  "What documents do I need to vote?",
  "Explain the Model Code of Conduct",
  "What is NOTA?",
  "How are Lok Sabha seats allocated?",
  "What is the role of ECI?",
];

export const STATS = [
  { value: "96.8 Cr", label: "Registered Voters" },
  { value: "543", label: "Lok Sabha Seats" },
  { value: "10.5 L+", label: "Polling Stations" },
  { value: "7", label: "Election Phases" },
];
