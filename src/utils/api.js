// src/utils/api.js
const API_URL = "http://localhost:5000"; // Base URL without /api

export async function loginUser(userData) {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem("projex_user", JSON.stringify(data.user));
      return data.user;
    } else {
      throw new Error(data.error || "Login failed");
    }
  } catch (err) {
    console.error("Backend login error:", err);
    alert("Could not connect to the backend server. Make sure node server.js is running!");
    return null;
  }
}

export async function completeOnboarding(onboardingData) {
  try {
    const response = await fetch(`${API_URL}/api/profile/onboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(onboardingData),
    });

    const data = await response.json();
    return data.success;
  } catch (err) {
    console.error("Onboarding error:", err);
    return false;
  }
}