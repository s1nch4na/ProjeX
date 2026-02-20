// simple mock data helpers. Replace with real API calls.
import mockTalents from "../data/mockTalents";

export async function fetchProjects() {
  return [
    {
      id: 1,
      title: "Brand Identity Design",
      meta: "Logo · Branding",
      price: 2000,
      deadline: "2025-12-01"
    },
    {
      id: 2,
      title: "Landing Page UI",
      meta: "Web · UI/UX",
      price: 3500,
      deadline: "2025-11-20"
    }
  ];
}

export async function fetchProfiles() {
  return mockTalents;
}
