import React, { useState } from "react";
import { completeOnboarding } from "../utils/api";

export default function OnboardingModal({ user, onComplete }) {
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Send onboarding data to backend
    const success = await completeOnboarding({
      email: user.email,
      bio,
      skills
    });

    setLoading(false);
    if (success) {
      onComplete(); // Close modal and proceed to dashboard
    } else {
      alert("Failed to save profile details.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono">
      <div className="bg-white border-2 border-black p-8 max-w-md w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
          <div>
            <span className="text-xs uppercase bg-black text-white px-2 py-0.5">Setup Required</span>
            <h2 className="text-xl font-bold uppercase mt-2">Complete Your Profile</h2>
          </div>
          {/* LOOK AROUND / SKIP BUTTON */}
          <button 
            onClick={onComplete}
            className="text-xs uppercase underline cursor-pointer text-neutral-500 hover:text-black"
          >
            Skip & Look Around →
          </button>
        </div>

        <p className="text-xs text-neutral-600 mb-6">
          Tell us a bit about yourself so investors and peers can discover your projects on ProjeX.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold mb-1">Short Bio</label>
            <textarea 
              rows="3"
              placeholder="e.g. CS student building full-stack apps in React & Node."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border-2 border-black p-3 text-sm bg-[#f4f4f0] focus:outline-none focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-bold mb-1">Key Skills / Tech Stack</label>
            <input 
              type="text"
              placeholder="e.g. React, Node.js, Python, PostgreSQL"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full border-2 border-black p-3 text-sm bg-[#f4f4f0] focus:outline-none focus:bg-white"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest font-bold border-2 border-black hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Continue →"}
          </button>
        </form>

      </div>
    </div>
  );
}