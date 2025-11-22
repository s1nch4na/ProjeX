// simple mock data helpers. Replace with real API calls.
export async function fetchProjects() {
  // return an array of project objects
  return [...Array(8)].map((_,i)=>({
    id: i+1,
    title: `Project ${i+1}`,
    meta: "Poster · Branding",
    price: 1500 + i*250,
    deadline: "2025-12-01"
  }));
}

export async function fetchProfiles() {
  return [...Array(8)].map((_,i)=>({
    id: i+1,
    name: `Student ${i+1}`,
    role: "Designer",
    skills: ["Figma","Photoshop"]
  }));
}
