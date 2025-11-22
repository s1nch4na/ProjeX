// src/utils/mockData.js
export const projects = [
  { id: "p1", title: "Brand Identity for EcoKart", meta: "Branding · Logo · Poster", price: 5000, datePosted: "2025-01-12", image: "https://placehold.co/600x400", description: "Complete branding package with logo, poster, and visuals." },
  { id: "p2", title: "Portfolio Website for Dev", meta: "Web · UI/UX", price: 8000, datePosted: "2025-01-05", image: "https://placehold.co/600x400", description: "Clean and modern personal portfolio for a student." },
  { id: "p3", title: "Cafe Menu Redesign", meta: "Design · Print", price: 2500, datePosted: "2025-01-20", image: "https://placehold.co/600x400", description: "Refreshing the menu with aesthetic visuals." },
  { id: "p4", title: "Mobile App for Food Delivery", meta: "App · UI/UX", price: 12000, datePosted: "2025-01-02", image: "https://placehold.co/600x400", description: "A sleek UI redesign for a campus food delivery service." },
  { id: "p5", title: "YouTube Intro Animation", meta: "Motion · Branding", price: 1800, datePosted: "2025-01-18", image: "https://placehold.co/600x400", description: "5-second snappy intro animation for a new channel." },
  { id: "p6", title: "Poster Series for Tech Fest", meta: "Graphic Design", price: 4000, datePosted: "2025-01-10", image: "https://placehold.co/600x400", description: "Bold and vibey poster lineup for a college tech fest." },
  { id: "p7", title: "Landing Page for Startup", meta: "Web · SEO", price: 7000, datePosted: "2025-01-25", image: "https://placehold.co/600x400", description: "High-conversion landing page for a growth-mode startup." },
  { id: "p8", title: "3D Mascot for App", meta: "3D · Branding", price: 9500, datePosted: "2025-01-08", image: "https://placehold.co/600x400", description: "Cute but powerful 3D mascot design." },
  { id: "p9", title: "Social Media Ad Creatives", meta: "Marketing · Design", price: 3200, datePosted: "2025-01-15", image: "https://placehold.co/600x400", description: "Instagram-ready ads with scroll-stop effect." },
  { id: "p10", title: "Data Dashboard for Sales Team", meta: "Analytics · Dashboard", price: 15000, datePosted: "2025-01-03", image: "https://placehold.co/600x400", description: "Interactive and efficient sales analytics dashboard." },
  { id: "p11", title: "Logo Revamp for NGO", meta: "Branding", price: 2000, datePosted: "2025-01-22", image: "https://placehold.co/600x400", description: "Giving a fresh identity to a social NGO." },
  { id: "p12", title: "College Event Aftermovie", meta: "Video", price: 5000, datePosted: "2025-01-09", image: "https://placehold.co/600x400", description: "Aesthetic and hype-filled aftermovie." },
  { id: "p13", title: "Blog Writing for EdTech", meta: "Content · SEO", price: 1200, datePosted: "2025-01-28", image: "https://placehold.co/600x400", description: "SEO-optimized blogs for student-focused platform." },
  { id: "p14", title: "App Icon Pack", meta: "Design · UI", price: 3000, datePosted: "2025-01-06", image: "https://placehold.co/600x400", description: "Minimal, clean, and symmetrical icon set." },
  { id: "p15", title: "AR Campus Navigation", meta: "AR · 3D", price: 18000, datePosted: "2025-01-27", image: "https://placehold.co/600x400", description: "Augmented reality system for campus maps." },
  { id: "p16", title: "Pitch Deck for Startup", meta: "Business · Design", price: 6000, datePosted: "2025-01-11", image: "https://placehold.co/600x400", description: "Investor-ready deck with clean storytelling." },
  { id: "p17", title: "Instagram Reels Editing", meta: "Content · Video", price: 1500, datePosted: "2025-01-24", image: "https://placehold.co/600x400", description: "Snappy, trend-ready reels for growth." },
  { id: "p18", title: "App UI Animation Pack", meta: "UI Motion", price: 5000, datePosted: "2025-01-19", image: "https://placehold.co/600x400", description: "Micro-interactions and UI flow animations." },
  { id: "p19", title: "Podcast Cover Art", meta: "Graphic Design", price: 1400, datePosted: "2025-01-14", image: "https://placehold.co/600x400", description: "Vibey cover art for a self-improvement podcast." },
  { id: "p20", title: "Full Branding for Cafe", meta: "Branding · Print · Logo", price: 11000, datePosted: "2025-01-07", image: "https://placehold.co/600x400", description: "Everything from logo to menu to packaging." }
];

export const profiles = [
  { id: "u1", name: "Ananya Verma", role: "UI/UX Designer", skills: ["Figma", "Illustrator"], image: "https://placehold.co/200" },
  { id: "u2", name: "Rohan Gupta", role: "Web Developer", skills: ["React", "Node"], image: "https://placehold.co/200" },
  { id: "u3", name: "Ishita Menon", role: "Motion Designer", skills: ["After Effects", "Blender"], image: "https://placehold.co/200" },
  { id: "u4", name: "Arjun Nair", role: "Backend Engineer", skills: ["Node", "Postgres"], image: "https://placehold.co/200" },
  { id: "u5", name: "Meera Shah", role: "Brand Strategist", skills: ["Branding", "Copy"], image: "https://placehold.co/200" },
  { id: "u6", name: "Kabir Singh", role: "Mobile Developer", skills: ["Flutter", "Dart"], image: "https://placehold.co/200" },
  { id: "u7", name: "Sara D’Souza", role: "Graphic Designer", skills: ["Canva", "Figma"], image: "https://placehold.co/200" },
  { id: "u8", name: "Dev Patel", role: "AI/ML Engineer", skills: ["Python", "TensorFlow"], image: "https://placehold.co/200" }
];

export const getAllProjects = () => projects;
export const getAllProfiles = () => profiles;
