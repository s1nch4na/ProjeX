// src/utils/api.js

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export function getAuthToken() {
  return localStorage.getItem("projex_token");
}

export function saveAuthSession(user, token) {
  localStorage.setItem("projex_user", JSON.stringify(user));

  if (token) {
    localStorage.setItem("projex_token", token);
  }
}

export function clearAuthSession() {
  localStorage.removeItem("projex_user");
  localStorage.removeItem("projex_token");
  window.dispatchEvent(new Event("projex-auth-change"));
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getAuthToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearAuthSession();
  }

  return response;
}

async function parseApiResponse(response) {
  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      response.ok
        ? "The server returned an invalid response."
        : `Request failed with status ${response.status}.`
    );
  }

  return { response, data };
}

// ==========================================
// 1. LOGIN USER
// ==========================================

export async function loginUser(userData) {
  try {
    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const { data } = await parseApiResponse(response);

    if (!response.ok || !data.success || !data.token) {
      alert(data.error || "Login failed.");
      return null;
    }

    saveAuthSession(data.user, data.token);

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
    const response = await apiRequest("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const { data } = await parseApiResponse(response);

    if (!response.ok || !data.success || !data.token) {
      alert(data.error || "Signup failed.");
      return null;
    }

    saveAuthSession(data.user, data.token);

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
    const response = await apiRequest(
      "/api/profile/onboard",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      }
    );

    const { data } = await parseApiResponse(response);

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || "Failed to complete profile."
      );
    }

    if (data.user) {
      saveAuthSession(data.user, getAuthToken());

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
    const response = await apiRequest(`/api/profile/${id}`);

    const { data } = await parseApiResponse(response);

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
    const response = await apiRequest(
      `/api/profile/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      }
    );

    const { data } = await parseApiResponse(response);

    if (!response.ok || !data.success) {
      throw new Error(
        data.error || "Failed to update profile."
      );
    }

    if (data.user) {
      saveAuthSession(data.user, getAuthToken());

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

// =====================================================
// MESSAGING API
// =====================================================


export async function getMessageConversations(userId) {
  const response = await apiRequest(
    `/api/messages/conversations?userId=${encodeURIComponent(userId)}`
  );
  const { data } = await parseApiResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Could not load conversations.");
  }

  return data.conversations;
}

export async function startMessageConversation(userId, otherUserId) {
  const response = await apiRequest("/api/messages/conversations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, otherUserId }),
  });
  const { data } = await parseApiResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Could not start conversation.");
  }

  return data.conversation;
}

export async function getConversationMessages(conversationId, userId) {
  const response = await apiRequest(
    `/api/messages/conversations/${encodeURIComponent(conversationId)}?userId=${encodeURIComponent(userId)}`
  );
  const { data } = await parseApiResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Could not load messages.");
  }

  return data.messages;
}

export async function sendChatMessage(conversationId, senderId, body) {
  const response = await apiRequest("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId, senderId, body }),
  });
  const { data } = await parseApiResponse(response);

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Could not send message.");
  }

  return data.message;
}