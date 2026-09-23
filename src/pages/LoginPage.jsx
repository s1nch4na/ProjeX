import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, signupUser } from "../utils/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState("student");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        if (!formData.name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }

        if (!formData.email.trim()) {
          setError("Please enter your email.");
          setLoading(false);
          return;
        }

        if (!formData.password) {
          setError("Please enter a password.");
          setLoading(false);
          return;
        }

        user = await signupUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role,
        });

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
      localStorage.setItem(
        "projex_user",
        JSON.stringify(user)
      );

      // Tell Navbar that auth state changed
      window.dispatchEvent(
        new Event("projex-auth-change")
      );

      // ================================
      // PROFILE NOT COMPLETE
      // ================================
      const profileComplete =
        user.is_profile_complete === true ||
        user.is_profile_complete === "true";

      if (!profileComplete) {
        navigate("/profile-onboarding", {
          state: { user },
        });

        return;
      }

      // ================================
      // PROFILE COMPLETE
      // ================================
      if (user.role === "investor") {
        navigate("/investor");
      } else {
        navigate("/student");
      }

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
                : "INVESTOR PORTAL"}
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
                  INVESTOR
                </button>

              </div>

            </div>
          )}

          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            {isSignUp && (
              <div className="mb-4">

                <label className="block text-xs font-bold mb-1.5">
                  FULL NAME
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Rivera"
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
            )}

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

            {/* ERROR */}

            {error && (
              <div className="border-2 border-black bg-[#f3f2ee] px-3 py-2 mb-4 text-xs font-bold">
                ERROR: {error}
              </div>
            )}

            {/* SUBMIT */}

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
              {loading
                ? "PROCESSING..."
                : isSignUp
                ? "SIGN UP →"
                : "LOGIN →"}
            </button>

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