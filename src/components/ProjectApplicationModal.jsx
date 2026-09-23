import React, { useState } from "react";

export default function ProjectApplicationModal({ projectId, userEmail, onClose, onSuccess }) {
  const [applicationType, setApplicationType] = useState("solo");
  const [teamMembers, setTeamMembers] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // Track success state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/projects/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: projectId || null,
          user_email: userEmail,
          application_type: applicationType,
          team_members: applicationType === "team" ? teamMembers : null,
          cover_note: coverNote
        })
      });

      const data = await response.json();
      if (data.success) {
        setIsSubmitted(true); // Switch view to success state
        onSuccess?.();
      } else {
        alert(data.error || "Application failed.");
      }
    } catch (err) {
      console.error("Application error:", err);
      alert("Server error during application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 font-mono">
      <div className="bg-white border-2 border-black p-8 max-w-lg w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        
        <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-4">
          <h2 className="text-xl font-bold uppercase">Apply For Project</h2>
          <button onClick={onClose} className="text-xs uppercase font-bold underline cursor-pointer">Close ✕</button>
        </div>

        {isSubmitted ? (
          /* Success State View inside the modal */
          <div className="py-8 text-center space-y-4">
            <div className="inline-block bg-black text-white px-4 py-2 text-xs uppercase font-bold tracking-widest border-2 border-black">
              Status: Submitted
            </div>
            <p className="text-sm font-bold uppercase">Application Received!</p>
            <p className="text-xs text-neutral-600">
              The project owner will review your student profile, skills, and pitch. You'll be notified once they approve your application.
            </p>
            <button 
              onClick={onClose}
              className="mt-4 w-full bg-black text-white py-3 text-xs uppercase tracking-widest font-bold border-2 border-black hover:bg-neutral-800 transition cursor-pointer"
            >
              Done →
            </button>
          </div>
        ) : (
          /* Form View */
          <>
            <p className="text-xs text-neutral-600 mb-4">
              Submit your application. The project owner will review your student profile, skills, and pitch before approving you to begin work.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold mb-1">Applying As</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs uppercase cursor-pointer">
                    <input 
                      type="radio" 
                      name="appType" 
                      checked={applicationType === "solo"} 
                      onChange={() => setApplicationType("solo")} 
                    />
                    Solo Developer
                  </label>
                  <label className="flex items-center gap-2 text-xs uppercase cursor-pointer">
                    <input 
                      type="radio" 
                      name="appType" 
                      checked={applicationType === "team"} 
                      onChange={() => setApplicationType("team")} 
                    />
                    Team
                  </label>
                </div>
              </div>

              {applicationType === "team" && (
                <div>
                  <label className="block text-xs uppercase font-bold mb-1">Teammate Names / Emails</label>
                  <input 
                    type="text"
                    placeholder="e.g. Alex Smith, Sarah Lee"
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                    className="w-full border-2 border-black p-3 text-sm bg-[#f4f4f0] focus:outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs uppercase font-bold mb-1">Pitch / Cover Note</label>
                <textarea 
                  rows="4"
                  placeholder="Why are you a great fit? Mention your experience with the required tech stack..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="w-full border-2 border-black p-3 text-sm bg-[#f4f4f0] focus:outline-none focus:bg-white"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest font-bold border-2 border-black hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Send Application →"}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}