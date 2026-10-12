
import React, { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialForm = {
  title: "",
  description: "",
  budget: "",
  deadline: "",
  project_type: "Technology",
};

export default function PostProject() {
  const [formData, setFormData] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleInputChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    setError("");
    setImageFile(null);

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Choose a JPEG, PNG, or WebP image.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Your image must be 5 MB or smaller.");
      e.target.value = "";
      return;
    }

    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const storedUser = JSON.parse(
      localStorage.getItem("projex_user") || "null"
    );

    const userId = storedUser?.id ?? storedUser?.user?.id;

    if (!userId) {
      setError("Your login session was not found. Please log in again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();

      payload.append("user_id", String(userId));
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description.trim());
      payload.append("budget", formData.budget);
      payload.append("deadline", formData.deadline);
      payload.append("project_type", formData.project_type);

      if (imageFile) {
        payload.append("image", imageFile);
      }

      const response = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        body: payload,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Could not post the project.");
      }

      setFormData(initialForm);
      setImageFile(null);

      const imageInput = document.getElementById("project-cover");
      if (imageInput) imageInput.value = "";

      setSuccess("Project posted successfully!");
    } catch (err) {
      console.error("Project submission error:", err);
      setError(
        err.message ||
          "Something went wrong while posting your project."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans px-6 md:px-12 py-10 selection:bg-black selection:text-white">
      <div className="max-w-3xl mx-auto bg-white border border-black p-8">
        <div className="mb-6 pb-4 border-b border-black flex justify-between items-end gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-neutral-500">
              Registry System
            </span>
            <h3 className="text-2xl font-bold tracking-tight uppercase mt-1">
              Create a Project
            </h3>
          </div>

          <span className="text-xs font-mono uppercase tracking-widest px-2 py-1 bg-neutral-100 border border-neutral-300">
            Secure Form
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">
              Project Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              maxLength={200}
              placeholder="Title"
              className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">
              Description &amp; Scope
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              maxLength={10000}
              placeholder="Describe the project, goals, and expected outcome"
              rows={6}
              className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">
              Project Category
            </label>
            <select
              name="project_type"
              value={formData.project_type}
              onChange={handleInputChange}
              required
              className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option>Technology</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Business</option>
              <option>Research</option>
              <option>Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">
                Budget (INR)
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="e.g. 5000"
                className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1">
                Target Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
                min={new Date().toLocaleDateString("en-CA")}
                className="w-full border border-black p-3 bg-[#F3F3EF] text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="project-cover"
              className="block text-xs font-mono uppercase tracking-wider text-neutral-600 mb-1"
            >
              Project Cover (Optional)
            </label>

            <p className="text-xs text-neutral-500 mb-2">
              Upload a project image if you have one. Leave this empty
              to use an automatic category-based cover.
            </p>

            <input
              id="project-cover"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="w-full border border-black p-3 bg-[#F3F3EF] text-sm file:mr-3 file:border file:border-black file:bg-white file:px-3 file:py-1 file:text-xs file:font-mono file:uppercase"
            />

            {imagePreview && (
              <div className="mt-3">
                <p className="text-xs font-mono uppercase mb-2">
                  Image Preview
                </p>
                <img
                  src={imagePreview}
                  alt="Selected project cover preview"
                  className="w-full max-h-64 object-cover border border-black"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    const input = document.getElementById("project-cover");
                    if (input) input.value = "";
                  }}
                  className="mt-2 text-xs underline"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          {error && (
            <p role="alert" className="border border-red-600 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p role="status" className="border border-black p-3 text-sm">
              {success}
            </p>
          )}

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