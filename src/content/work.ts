export type Project = {
  title: string;
  category: string;
  result: string;
  accent: string;
};

export const projects: Project[] = [
  {
    title: "Meridian Capital Platform",
    category: "Enterprise Web App",
    result: "Unified 12 legacy systems into one portal",
    accent: "#C9A24B",
  },
  {
    title: "Northwind ERP Suite",
    category: "Business Systems",
    result: "40% faster operational workflows",
    accent: "#3B5A96",
  },
  {
    title: "Aurora Commerce",
    category: "E-Commerce & Branding",
    result: "3.2x increase in conversion rate",
    accent: "#5E6AD2",
  },
  {
    title: "Helix Field Mobile",
    category: "Mobile Application",
    result: "Deployed across 50+ countries",
    accent: "#2C8C7C",
  },
];
