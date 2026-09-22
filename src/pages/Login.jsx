import React, { useState } from "react";
import { loginUser } from "../utils/api";

export default function LoginPage() {
  // Step 1: null means selection view (Student vs Investor), 'student' or 'investor' means the form view
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (isSignUp && !formData.name)) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    const payload = {
      email: formData.email,
      name: isSignUp ? formData.name : formData.email.split("@")[0],
      google_id: `manual_${Date.now()}`,
      role: selectedRole
    };

    const user = await loginUser(payload);
    setLoading(false);

    if (user) {
      if (!user.is_profile_complete) {
        alert(`Success! Redirecting to Onboarding...`);
        // window.location.href = '/onboarding';
      } else {
        alert(`Welcome back! Redirecting to Dashboard...`);
        // window.location.href = '/dashboard';
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black font-mono flex items-center justify-center p-6">
      <div className="w-full max-w-md border-2 border-black p-8 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

        {/* SCREEN 1: CHOOSE ROLE (Student vs Investor) */}
        {!selectedRole ? (
          <div>
            <div className="mb-6 border-b-2 border-black pb-4">
              <span className="text-xs uppercase tracking-widest bg-black text-white px-2 py-1">
                ProjeX Network
              </span>
              <h1 className="text-2xl font-bold uppercase tracking-tight mt-3">
                Select Portal
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                Choose your path to enter the platform.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setSelectedRole("student")}
                className="w-full text-left p-4 border-2 border-black bg-[#f4f4f0] hover:bg-black hover:text-white transition group cursor-pointer"
              >
                <div className="text-sm font-bold uppercase tracking-wider">For Student →</div>
                <div className="text-xs text-neutral-500 group-hover:text-neutral-300 mt-1">
                  Access student portfolio & project builder.
                </div>
              </button>

              <button
                onClick={() => setSelectedRole("investor")}
                className="w-full text-left p-4 border-2 border-black bg-[#f4f4f0] hover:bg-black hover:text-white transition group cursor-pointer"
              >
                <div className="text-sm font-bold uppercase tracking-wider">For Investor →</div>
                <div className="text-xs text-neutral-500 group-hover:text-neutral-300 mt-1">
                  Evaluate market pipelines & student listings.
                </div>
              </button>
            </div>
          </div>
        ) : (

          /* SCREEN 2: EMAIL, PASSWORD & SIGNUP/LOGIN FORM */
          <div>
            <div className="mb-6 border-b-2 border-black pb-4 flex justify-between items-center">
              <div>
                <span className="text-xs uppercase tracking-widest bg-black text-white px-2 py-1">
                  {selectedRole === "student" ? "Student Portal" : "Investor Portal"}
                </span>
                <h2 className="text-xl font-bold uppercase tracking-tight mt-2">
                  {isSignUp ? "Account Registration" : "Sign In"}
                </h2>
              </div>
              <button 
                onClick={() => setSelectedRole(null)}
                className="text-xs underline uppercase cursor-pointer hover:text-neutral-600"
              >
                ← Back
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs uppercase font-bold mb-1">Full Name</label>
                  <input 
                    type="text"
                    name="name"
                    placeholder="e.g. Alex Rivera"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border-2 border-black p-3 text-sm bg-[#f4f4f0] focus:outline-none focus:bg-white transition"
                    required={isSignUp}
                  />
                </div>
              )}

              <div>
                <label className="block text-xs uppercase font-bold mb-1">Email</label>
                <input 
                  type="email"
                  name="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-3 text-sm bg-[#f4f4f0] focus:outline-none focus:bg-white transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold mb-1">Password</label>
                <input 
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border-2 border-black p-3 text-sm bg-[#f4f4f0] focus:outline-none focus:bg-white transition"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest font-bold border-2 border-black hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? "Processing..." : isSignUp ? "Sign Up →" : "Login →"}
              </button>
            </form>

            <div className="mt-6 text-center border-t-2 border-black pt-4">
              <p className="text-xs text-neutral-600">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-bold underline uppercase cursor-pointer hover:text-black ml-1"
                >
                  {isSignUp ? "Login" : "Sign up"}
                </button>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}