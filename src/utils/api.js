// src/utils/api.js

const API_URL = "https://projex-ap2m.onrender.com";

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

    localStorage.setItem(
      "projex_user",
      JSON.stringify(data.user)
    );

    window.dispatchEvent(new Event("projex-auth-change"));

    return data.user;
  } catch (err) {
    console.error("Backend login error:", err);

    alert(
      "Could not connect to the backend server. Please try again."
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

    localStorage.setItem(
      "projex_user",
      JSON.stringify(data.user)
    );

    window.dispatchEvent(new Event("projex-auth-change"));

    return data.user;
  } catch (err) {
    console.error("Backend signup error:", err);

    alert(
      "Could not connect to the backend server. Please try again."
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

    if (data.user) {
      localStorage.setItem(
        "projex_user",
        JSON.stringify(data.user)
      );

      window.dispatchEvent(
        new Event("projex-auth-change")
      );
    }

    return data;
  } catch (error) {
    console.error("Profile onboarding error:", error);

    alert(
      error.message ||
      "Something went wrong while completing your profile."
    );

    return null;
  }
}


// ==========================================
// 4. GET CREATOR PROFILE
// ==========================================

export async function getProfile(id) {
  try {
    const response = await fetch(
      `${API_URL}/api/profile/${id}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Profile not found"
      );
    }

    return data;
  } catch (error) {
    console.error("Get profile error:", error);
    throw error;
  }
}


// ==========================================
// 5. UPDATE PROFILE
// ==========================================

export async function updateProfile(id, profileData) {
  try {
    const response = await fetch(
      `${API_URL}/api/profile/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      }
    );

    const text = await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("❌ Backend returned non-JSON:", text);
      throw new Error(
        "Backend returned an invalid response. Check the deployed backend URL."
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || "Failed to update profile."
      );
    }

    if (data.user) {
      localStorage.setItem(
        "projex_user",
        JSON.stringify(data.user)
      );

      window.dispatchEvent(
        new Event("projex-auth-change")
      );
    }

    return data;

  } catch (error) {
    console.error("❌ Update profile error:", error);
    throw error;
  }
}