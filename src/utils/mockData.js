// src/utils/mockData.js
import p1 from "../assets/projects/1.jpg";
import p2 from "../assets/projects/2Portfolio.jpg";
import p3 from "../assets/projects/3.jpg";
import p4 from "../assets/projects/4.jpg";
import p5 from "../assets/projects/5.jpg";
import p6 from "../assets/projects/6.jpg";
import p7 from "../assets/projects/7.jpg";
import p8 from "../assets/projects/8.jpg";
import p9 from "../assets/projects/9.jpg";
import p10 from "../assets/projects/10.jpg";
import p11 from "../assets/projects/11.jpg";
import p12 from "../assets/projects/12.jpg";
import p13 from "../assets/projects/13.jpg";
import p14 from "../assets/projects/14.jpg";
import p15 from "../assets/projects/15.jpg";
import p16 from "../assets/projects/16.jpg";
import p17 from "../assets/projects/17.jpg";
import p18 from "../assets/projects/18.jpg";


export const projects = [
  { id: "p1", title: "Brand Identity for EcoKart", meta: "Branding · Logo · Poster", price: 5000, datePosted: "2025-01-12", image: p1, description: "Complete branding package with logo, poster, and visuals." },
  { id: "p2", title: "Portfolio Website for Dev", meta: "Web · UI/UX", price: 8000, datePosted: "2025-01-05", image: p2, description: "Clean and modern personal portfolio for a student." },
  { id: "p3", title: "Cafe Menu Redesign", meta: "Design · Print", price: 2500, datePosted: "2025-01-20", image: p3, description: "Refreshing the menu with aesthetic visuals." },
  { id: "p4", title: "Mobile App for Food Delivery", meta: "App · UI/UX", price: 12000, datePosted: "2025-01-02", image: p4, description: "A sleek UI redesign for a campus food delivery service." },
  { id: "p5", title: "YouTube Intro Animation", meta: "Motion · Branding", price: 1800, datePosted: "2025-01-18", image: p5, description: "5-second snappy intro animation for a new channel." },
  { id: "p6", title: "Poster Series for Tech Fest", meta: "Graphic Design", price: 4000, datePosted: "2025-01-10", image: p6, description: "Bold and vibey poster lineup for a college tech fest." },
  { id: "p7", title: "Landing Page for Startup", meta: "Web · SEO", price: 7000, datePosted: "2025-01-25", image: p7, description: "High-conversion landing page for a growth-mode startup." },
  { id: "p8", title: "3D Mascot for App", meta: "3D · Branding", price: 9500, datePosted: "2025-01-08", image: p8, description: "Cute but powerful 3D mascot design." },
  { id: "p9", title: "Social Media Ad Creatives", meta: "Marketing · Design", price: 3200, datePosted: "2025-01-15", image: p9, description: "Instagram-ready ads with scroll-stop effect." },
  { id: "p10", title: "E-commerce Product Gallery", meta: "Web · UI/UX", price: 6500, datePosted: "2025-01-14", image: p10, description: "Interactive gallery for a fashion e-commerce site." },
  { id: "p11", title: "Brand Guidelines Document", meta: "Branding · Documentation", price: 2800, datePosted: "2025-01-22", image: p11, description: "Complete brand guidelines for a new startup." },
  { id: "p12", title: "Animated Logo for Tech Startup", meta: "Motion · Branding", price: 4500, datePosted: "2025-01-30", image: p12, description: "Animated logo with smooth transitions and effects." },
  { id: "p13", title: "Mobile App Icon Set", meta: "App · UI/UX", price: 3800, datePosted: "2025-01-28", image: p13, description: "Set of app icons for a productivity app." },
  { id: "p14", title: "Print Ad Campaign Design", meta: "Print · Marketing", price: 7500, datePosted: "2025-01-31", image: p14, description: "Complete print ad campaign for a lifestyle brand." },
  { id:"p15" , title:"Digital Art Series" , meta:"Digital Art" , price:"4899" , datePosted:"2025-03-3" , image:p15 , description:"Collection of digital artworks for an online gallery."},
  { id:"p16" , title:"Corporate Identity Package" , meta:"Branding · Logo" , price:"9999" , datePosted:"2025-03-7" , image:p16 , description:"Complete corporate identity package with logo and branding elements."},
  { id:"p17" , title:"Website Redesign for E-commerce Store" , meta:"Web · UI/UX" , price:"8799" , datePosted:"2025-03-9" , image:p17 , description:"Modern website redesign for an online fashion store."},
  { id:"p18" , title:"Product Photography Session" , meta:"Photography · Branding" , price:"6799" , datePosted:"2025-03-4" , image:p18 , description:"Professional product photography session for a tech startup."},
];

export const profiles = [
  { id: "u1", name: "Ananya Verma", role: "UI/UX Designer", skills: ["Figma", "Illustrator"], image: "https://randomuser.me/api/portraits/women/32.jpg" },
  { id: "u2", name: "Rohan Gupta", role: "Web Developer", skills: ["React", "Node"], image: "https://randomuser.me/api/portraits/men/45.jpg" },
  { id: "u3", name: "Ishita Menon", role: "Motion Designer", skills: ["After Effects", "Blender"], image: "https://randomuser.me/api/portraits/women/12.jpg" },
  { id: "u4", name: "Arjun Nair", role: "Backend Engineer", skills: ["Node", "Postgres"], image: "https://randomuser.me/api/portraits/men/18.jpg" },
  { id: "u5", name: "Meera Shah", role: "Brand Strategist", skills: ["Branding", "Copy"], image: "https://randomuser.me/api/portraits/women/55.jpg" },
  { id: "u6", name: "Kabir Singh", role: "Mobile Developer", skills: ["Flutter", "Dart"], image: "https://randomuser.me/api/portraits/men/67.jpg" },
  { id: "u7", name: "Sara D’Souza", role: "Graphic Designer", skills: ["Canva", "Figma"], image: "https://randomuser.me/api/portraits/women/41.jpg" },
  { id: "u8", name: "Dev Patel", role: "AI/ML Engineer", skills: ["Python", "TensorFlow"], image: "https://randomuser.me/api/portraits/men/72.jpg" }
];


export const getAllProjects = () => projects;
export const getAllProfiles = () => profiles;
