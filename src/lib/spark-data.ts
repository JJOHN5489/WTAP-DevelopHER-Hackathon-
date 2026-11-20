export const user = {
  name: "Alex Carter",
  initials: "AC",
  title: "Early Talent Intern — Capital Markets",
  school: "Western University, Class of 2028",
  email: "alex.carter@rbc.com",
  area: "RBC Capital Markets",
  funFact: "I once climbed Mount Kilimanjaro!",
};

export type Mentor = { name: string; years: number; area: string };
export type Role = {
  title: string;
  lob: string;
  skills: string[];
  workshops: string[];
  resources: string[];
  mentors: Mentor[];
  intermediate: string;
};

export const roles: Role[] = [
  { title: "Senior Software Engineer", lob: "Technology & Operations", intermediate: "Software Developer II",
    skills: ["System design", "TypeScript / Java", "Cloud (Azure)", "Code review leadership"],
    workshops: ["RBC Tech Academy: Distributed Systems", "Secure Coding Bootcamp"],
    resources: ["Internal Engineering Handbook", "Degreed: Cloud Architecture path"],
    mentors: [{ name: "Priya Raman", years: 7, area: "Technology & Operations" }, { name: "Daniel Okafor", years: 5, area: "RBCx" }] },
  { title: "Quantitative Risk Analyst", lob: "Capital Markets", intermediate: "Risk Analyst",
    skills: ["Python & pandas", "Stochastic calculus", "VaR modelling", "Regulatory (Basel III)"],
    workshops: ["Market Risk Fundamentals", "Python for Quants"],
    resources: ["Group Risk Management wiki", "CFA Level I prep"],
    mentors: [{ name: "Mei Lin Zhang", years: 6, area: "Group Risk Management" }, { name: "Marc Tremblay", years: 9, area: "Capital Markets" }] },
  { title: "Product Owner — RBCx", lob: "Technology & Operations", intermediate: "Associate Product Manager",
    skills: ["Agile / Scrum", "Roadmapping", "Stakeholder management", "Data-driven discovery"],
    workshops: ["Product Discovery Lab", "Certified Scrum PO prep"],
    resources: ["RBCx Venture Playbook", "Design Thinking toolkit"],
    mentors: [{ name: "Jordan Ellis", years: 4, area: "RBCx" }] },
  { title: "Data Scientist — Borealis AI", lob: "Technology & Operations", intermediate: "Data Analyst",
    skills: ["Machine learning", "SQL", "Experimentation", "Responsible AI"],
    workshops: ["Borealis AI Speaker Series", "ML in Production"],
    resources: ["Borealis research blog", "Internal Kaggle challenges"],
    mentors: [{ name: "Aisha Khan", years: 5, area: "Borealis AI" }] },
  { title: "Equity Research Associate", lob: "Capital Markets", intermediate: "Research Analyst",
    skills: ["Financial modelling", "Valuation", "Industry writing"],
    workshops: ["Modelling Masterclass"], resources: ["Capital Markets research portal"],
    mentors: [{ name: "Liam Chen", years: 3, area: "Capital Markets" }] },
  { title: "Wealth Advisor Associate", lob: "Wealth Management", intermediate: "Client Associate",
    skills: ["CSC certification", "Client relationships", "Portfolio basics"],
    workshops: ["Wealth Foundations"], resources: ["RBC Wealth learning hub"],
    mentors: [{ name: "Sofia Rossi", years: 8, area: "Wealth Management" }] },
  { title: "Commercial Account Manager", lob: "Personal & Commercial Banking", intermediate: "Credit Analyst",
    skills: ["Credit analysis", "Business development", "Negotiation"],
    workshops: ["Commercial Credit 101"], resources: ["P&CB onboarding library"],
    mentors: [{ name: "Ethan Brooks", years: 6, area: "Personal & Commercial Banking" }] },
];

export const lobs = [
  { name: "Technology & Operations", blurb: "Build the platforms powering 17M+ clients.", openings: 42 },
  { name: "Capital Markets", blurb: "Trading, research and global investment banking.", openings: 28 },
  { name: "Wealth Management", blurb: "Advise clients and grow generational wealth.", openings: 19 },
  { name: "Personal & Commercial Banking", blurb: "Serve everyday Canadians and businesses.", openings: 35 },
];

export const suggestionMap: Record<string, string[]> = {
  "AI / ML": ["Data Scientist — Borealis AI"],
  "Software Engineering": ["Senior Software Engineer"],
  "Product Management": ["Product Owner — RBCx"],
  "Capital Markets": ["Quantitative Risk Analyst", "Equity Research Associate"],
  Hackathons: ["Senior Software Engineer"],
};

export const buddy = {
  name: "Sarah Jenkins", initials: "SJ", area: "RBC Capital Markets",
  funFact: "I once climbed Mount Kilimanjaro!",
  shared: ["Running", "AI / ML"],
};

export const connections = [
  { group: "RBC Lines of Business", color: "gold", words: ["WEALTH", "MARKETS", "INSURANCE", "BANKING"] },
  { group: "Things in a stand-up", color: "blue", words: ["BLOCKER", "STANDUP", "SPRINT", "TICKET"] },
  { group: "___ Bull", color: "sky", words: ["RED", "PIT", "SITTING", "RAGING"] },
  { group: "Taylor Swift albums", color: "red", words: ["LOVER", "FEARLESS", "FOLKLORE", "REPUTATION"] },
] as const;

export const leaderboard = [
  { rank: 1, team: "Maya Patel & Kenji Watanabe", score: 520 },
  { rank: 2, team: "Omar Haddad & Chloe Martin", score: 480 },
  { rank: 3, team: "Noah Singh & Emma Leblanc", score: 450 },
];
