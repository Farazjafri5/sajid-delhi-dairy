export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string[];
}

export const services: ServiceItem[] = [
  {
    id: "01",
    title: "SOCIAL MEDIA MANAGEMENT",
    description: "Instagram strategy, content calendars, publishing, community engagement, and organic growth solutions.",
    details: [
      "Dynamic Content Scheduling",
      "Feed Layout Curation & Grid Design",
      "Daily Engagement & Community Management",
      "Monthly Analytics, Audits & Growth Strategy"
    ]
  },
  {
    id: "02",
    title: "REELS & SHORT-FORM CONTENT",
    description: "End-to-end concept development, scripting, shooting, trend editing, and native publishing for high virality.",
    details: [
      "Scriptwriting & Hook Development",
      "On-Location Shoots (Delhi NCR)",
      "Dynamic Editing (Transitions, Text Pop-ups, Captions)",
      "Audio Selection & Trend Forecasting"
    ]
  },
  {
    id: "03",
    title: "CONTENT PRODUCTION",
    description: "High-end editorial lifestyle videography and professional food and product photography for premium digital impact.",
    details: [
      "Professional Camera & Lighting Setup",
      "Art Direction & Prop Styling",
      "High-Resolution Edited Image Packs",
      "Cinematic Brand Videos & Sound Design"
    ]
  },
  {
    id: "04",
    title: "BRAND COLLABORATIONS",
    description: "Curated creator partnerships, local influencer outreach, and custom-tailored brand collaborations.",
    details: [
      "Influencer Outreach & Sourcing",
      "Negotiation & Contract Management",
      "Creative Brief Design for Creators",
      "ROI Tracking & Campaign Reports"
    ]
  },
  {
    id: "05",
    title: "CONTENT STRATEGY",
    description: "Detailed brand story architecture, thematic content pillars, monthly planning guides, and audience persona insights.",
    details: [
      "Content Pillar Architecture",
      "Competitor Social Audits",
      "Interactive Moodboard Creation",
      "Platform-specific Funnel Design"
    ]
  },
  {
    id: "06",
    title: "ON-GROUND SHOOTS",
    description: "We show up with a full creative crew at your restaurant, cafe, store, or event to shoot social-native content.",
    details: [
      "Monthly Content Shoots (Half/Full Day)",
      "Real-time Behind-the-Scenes (BTS) Capture",
      "Quick-turnaround Reel Capture",
      "Director & Content Creator On-Site"
    ]
  }
];
