import React, { useState } from "react";

export default function PostProject() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Backend integration hook point
      // await fetch('/api/projects', { method: 'POST', body: JSON.stringify(formData) });
      console.log("Posting project to backend:", formData);
      
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert("Project posted successfully!");
      setFormData({ title: "", description: "", budget: "", deadline: "" });
    } catch (err) {
      console.error("Error posting project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans px-6 md:px-12 py-10 selection:bg-black selection:text-white">
      <div className="max-w-3xl mx-auto bg-white border border-black p-8">
        
        <div className="mb-6 pb-4 border-b border-black flex justify-between items-end">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">Registry System</span>
            <h3 className="text-2xl font-bold tracking-tight uppercase mt-1">Create a Project</h3>
          </div>
          <span className="text-xs font-mono uppercase tracking-widest px-2 py-1 bg-neutral-100 border border-neutral-300">
            Secure Form
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Title"
              className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">Description & Scope</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe the project"
              className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black resize-none"
              rows={6}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">Budget</label>
              <input
                type="text"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                required
                placeholder="Budget (₹)"
                className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">Target Deadline</label>
              <input
                type="text"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
                placeholder="Deadline"
                className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors rounded-none disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Posting..." : "Post →"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}