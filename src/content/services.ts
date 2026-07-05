import {
  Code2,
  Network,
  Palette,
  Smartphone,
  Cloud,
  type LucideIcon,
} from "lucide-react";

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  keywords: string[];
};

export const services: Service[] = [
  {
    icon: Code2,
    title: "Custom Web Applications",
    description:
      "Bespoke software built for complexity, not just functionality. From multi-tenant SaaS platforms to high-throughput data workflows and seamless third-party integrations that consolidate your tech stack into a single operational truth.",
    keywords: ["SaaS Development", "Enterprise Platforms", "PWAs", "Cloud Native"],
  },
  {
    icon: Network,
    title: "Business System Design & Transformation",
    description:
      "We architect the systems that run your organization — ERP/CRM solutions, workflow automation, and custom management portals tailored to your specific processes rather than off-the-shelf templates. We specialize in legacy modernization without service disruption.",
    keywords: [
      "Digital Strategy",
      "Process Automation",
      "BI",
      "Legacy Modernization",
    ],
  },
  {
    icon: Palette,
    title: "Web Experiences & Brand Authority",
    description:
      "Conversion-driven design meets enterprise architecture. Corporate websites, e-commerce platforms and digital brand experiences that elevate market authority while maintaining peak performance across every device.",
    keywords: ["Corporate Websites", "E-Commerce", "UX/UI Design Systems"],
  },
  {
    icon: Smartphone,
    title: "Mobile Application Development",
    description:
      "Native and cross-platform mobile applications built for reliability. From concept through App Store deployment with ongoing support, we deliver seamless iOS and Android experiences that keep your business accessible in the palm of your hand.",
    keywords: ["iOS", "Android", "React Native", "Cross-Platform"],
  },
  {
    icon: Cloud,
    title: "Digital Infrastructure & Cloud Engineering",
    description:
      "The foundation for everything you build — scalable cloud architecture, API design, microservices frameworks, and DevOps pipelines engineered to ensure performance at scale while keeping costs predictable.",
    keywords: ["Cloud Architecture", "Microservices", "API Design", "DevOps"],
  },
];
