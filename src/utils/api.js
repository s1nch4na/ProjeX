// src/utils/api.js

const API_URL = "http://localhost:5000";

// ==========================================
// 1. LOGIN USER
// ==========================================

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

    if (!response.ok || !data.success) {
      alert(data.error || "Login failed.");
      return null;
    }

    // Save logged-in user
    localStorage.setItem(
      "projex_user",
      JSON.stringify(data.user)
    );

    return data.user;

  } catch (err) {
    console.error("Backend login error:", err);

    alert(
      "Could not connect to the backend server. Make sure node server.js is running!"
    );

    return null;
  }
}


// ==========================================
// 2. SIGNUP USER
// ==========================================

export async function signupUser(userData) {
  try {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.error || "Signup failed.");
      return null;
    }

    // Save newly created user
    localStorage.setItem(
      "projex_user",
      JSON.stringify(data.user)
    );

    return data.user;

  } catch (err) {
    console.error("Backend signup error:", err);

    alert(
      "Could not connect to the backend server. Make sure node server.js is running!"
    );

    return null;
  }
}


// ==========================================
// 3. COMPLETE PROFILE
// ==========================================

export async function completeProfile(profileData) {
  try {
    const response = await fetch(
      `${API_URL}/api/profile/onboard`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(profileData),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || "Failed to complete profile."
      );
    }

    // Update stored user with the completed profile
    if (data.user) {
      localStorage.setItem(
        "projex_user",
        JSON.stringify(data.user)
      );
    }

    return data;

  } catch (error) {
    console.error(
      "Profile onboarding error:",
      error
    );

    alert(
      error.message ||
      "Something went wrong while completing your profile."
    );

    return null;
  }
}