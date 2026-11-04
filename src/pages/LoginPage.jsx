import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../utils/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSignUp, setIsSignUp] = useState(
    location.state?.authMode === "signup"
  );
  const [role, setRole] = useState(
    location.state?.authRole === "investor" ? "investor" : "student"
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const googleButtonRef = useRef(null);
  const googleAuthInFlightRef = useRef(false);

  const finishAuthentication = useCallback((user) => {
    localStorage.setItem("projex_user", JSON.stringify(user));
    window.dispatchEvent(new Event("projex-auth-change"));

    const profileComplete =
      user.is_profile_complete === true ||
      user.is_profile_complete === "true";

    if (!profileComplete) {
      navigate("/profile-onboarding", {
        state: { user, returnTo: location.state?.returnTo },
      });
      return;
    }

    navigate(
      location.state?.returnTo ||
        (user.role === "investor" ? "/project-owner" : "/student")
    );
  }, [location.state?.returnTo, navigate]);

  const handleGoogleCredential = useCallback(async (response) => {
    const credential = response?.credential;

    if (!credential) {
      console.error("Google Sign-In returned no credential.");
      setError("Google Sign-In did not return a credential. Please try again.");
      return;
    }

    if (googleAuthInFlightRef.current) {
      return;
    }

    googleAuthInFlightRef.current = true;
    setError("");
    setLoading(true);

    try {
      const user = await loginWithGoogle(
        credential,
        isSignUp ? role : undefined
      );
      console.info("Google authentication completed.");
      finishAuthentication(user);
    } catch (googleError) {
      console.error("Google authentication request failed:", googleError);
      setError(
        googleError.message ||
          "Google authentication failed. Please try again."
      );
    } finally {
      googleAuthInFlightRef.current = false;
      setLoading(false);
    }
  }, [finishAuthentication, isSignUp, role]);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || !googleButtonRef.current) return undefined;

    const renderGoogleButton = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;
      googleButtonRef.current.replaceChildren();
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential,
      });
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 430,
        text: isSignUp ? "signup_with" : "signin_with",
      });
    };

    if (window.google?.accounts?.id) {
      renderGoogleButton();
      return undefined;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    script.onerror = () => setError("Google Sign-In could not be loaded.");
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [handleGoogleCredential, isSignUp]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      let user;

      // ================================
      // SIGN UP
      // ================================
      if (isSignUp) {
        setError("New accounts must be created with Google Sign-In.");
        return;

      // ================================
      // LOGIN
      // ================================
      } else {
        if (!formData.email.trim()) {
          setError("Please enter your email.");
          setLoading(false);
          return;
        }

        if (!formData.password) {
          setError("Please enter your password.");
          setLoading(false);
          return;
        }

        user = await loginUser({
          email: formData.email.trim(),
          password: formData.password,
        });
      }

      // ================================
      // AUTH FAILED
      // ================================
      if (!user) {
        setError(
          isSignUp
            ? "Unable to create your account."
            : "Invalid email or password."
        );
        setLoading(false);
        return;
      }

      console.log("🔥 AUTH USER:", user);
      console.log(
        "🔥 PROFILE COMPLETE:",
        user.is_profile_complete,
        typeof user.is_profile_complete
      );

      // ================================
      // SAVE CURRENT USER
      // ================================
      finishAuthentication(user);

    } catch (error) {
      console.error("Authentication error:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[50] overflow-hidden font-mono">

      {/* =========================================
          BLURRED BACKGROUND
      ========================================== */}

      <div className="absolute inset-0 bg-[#f3f2ee]">

        <div className="absolute inset-[-20px] bg-[url('/images/landing-bg.jpg')] bg-cover bg-center blur-[8px] scale-105" />

        <div className="absolute inset-0 bg-[#f3f2ee]/55" />

      </div>

      {/* =========================================
          DARK OVERLAY
      ========================================== */}

      <div className="absolute inset-0 bg-black/10" />

      {/* =========================================
          AUTH CARD
      ========================================== */}

      <div className="relative z-10 h-full flex items-center justify-center px-5">

        <div
          className="
            w-full
            max-w-[500px]
            max-h-[94vh]
            overflow-y-auto
            bg-[#f8f7f3]
            border-2
            border-black
            shadow-[6px_6px_0px_#000]
            px-8
            py-7
          "
        >

          {/* HEADER */}

          <div className="flex items-center justify-between mb-4">

            <div className="bg-black text-white px-3 py-1.5 text-xs tracking-wide">
              {role === "student"
              ? "STUDENT PORTAL"
              : "PROJECT OWNER PORTAL"}
            </div>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-xs underline hover:no-underline"
            >
              ← BACK
            </button>

          </div>

          {/* TITLE */}

          <h1 className="text-[21px] font-bold tracking-tight">
            {isSignUp
              ? "ACCOUNT REGISTRATION"
              : "ACCOUNT LOGIN"}
          </h1>

          {/* DIVIDER */}

          <div className="border-t-2 border-black mt-4 mb-5" />

          {/* ROLE */}

          {isSignUp && (
            <div className="mb-4">

              <label className="block text-xs font-bold mb-2">
                ACCOUNT TYPE
              </label>

              <div className="grid grid-cols-2 gap-2">

                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`border-2 border-black py-2 text-xs font-bold ${
                    role === "student"
                      ? "bg-black text-white"
                      : "bg-transparent hover:bg-black hover:text-white"
                  }`}
                >
                  STUDENT
                </button>

                <button
                  type="button"
                  onClick={() => setRole("investor")}
                  className={`border-2 border-black py-2 text-xs font-bold ${
                    role === "investor"
                      ? "bg-black text-white"
                      : "bg-transparent hover:bg-black hover:text-white"
                  }`}
                >
                  PROJECT OWNER
                </button>

              </div>

            </div>
          )}

          {isSignUp && (
            <p className="mb-4 border-2 border-black bg-[#f3f2ee] px-3 py-2 text-xs">
              New ProjeX accounts use verified Google Sign-In. Choose your account type, then continue with Google.
            </p>
          )}

          <div ref={googleButtonRef} className="mb-5 flex min-h-[44px] justify-center" />

          {/* FORM */}

          <form onSubmit={handleSubmit}>
            {!isSignUp && (
              <>
                {/* EMAIL */}
                <div className="mb-4">

              <label className="block text-xs font-bold mb-1.5">
                EMAIL
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                className="
                  w-full
                  h-[48px]
                  border-2
                  border-black
                  bg-[#f3f2ee]
                  px-3
                  text-sm
                  outline-none
                  placeholder:text-[#9aa5b5]
                  focus:bg-white
                "
              />

                </div>

                {/* PASSWORD */}
                <div className="mb-4">
                  <label className="block text-xs font-bold mb-1.5">
                    PASSWORD
                  </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="
                  w-full
                  h-[48px]
                  border-2
                  border-black
                  bg-[#f3f2ee]
                  px-3
                  text-sm
                  outline-none
                  placeholder:text-[#9aa5b5]
                  focus:bg-white
                "
              />

                </div>
              </>
            )}

            {/* ERROR */}

            {error && (
              <div className="border-2 border-black bg-[#f3f2ee] px-3 py-2 mb-4 text-xs font-bold">
                ERROR: {error}
              </div>
            )}

            {!isSignUp && (
              <button
                type="submit"
                disabled={loading}
                className="
                w-full
                h-[48px]
                bg-black
                text-white
                border-2
                border-black
                font-bold
                tracking-widest
                text-xs
                hover:bg-[#222]
                disabled:opacity-50
              "
              >
                {loading ? "PROCESSING..." : "LOGIN →"}
              </button>
            )}

          </form>

          {/* BOTTOM DIVIDER */}

          <div className="border-t-2 border-black mt-5 mb-4" />

          {/* SWITCH */}

          <div className="text-center text-xs">

            {isSignUp ? (
              <>
                Already have an account?

                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(false);
                    setError("");
                  }}
                  className="
                    ml-2
                    border-2
                    border-black
                    px-1
                    font-bold
                    underline
                    hover:bg-black
                    hover:text-white
                  "
                >
                  LOGIN
                </button>
              </>
            ) : (
              <>
                Don't have an account?

                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(true);
                    setError("");
                  }}
                  className="
                    ml-2
                    border-2
                    border-black
                    px-1
                    font-bold
                    underline
                    hover:bg-black
                    hover:text-white
                  "
                >
                  SIGN UP
                </button>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}