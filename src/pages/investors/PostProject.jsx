import React from "react";

export default function PostProject() {
  return (
    <div className="px-12 py-10">
      <div className="max-w-3xl bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3">Create a Project</h3>
        <input placeholder="Title" className="w-full border rounded p-2 mb-3" />
        <textarea placeholder="Describe the project" className="w-full border rounded p-2 mb-3" rows={6} />
        <div className="flex gap-3">
          <input placeholder="Budget (₹)" className="border rounded p-2" />
          <input placeholder="Deadline" className="border rounded p-2" />
        </div>
        <div className="mt-4">
          <button className="px-4 py-2 bg-[#7c3aed] text-white rounded-lg">Post</button>
        </div>
      </div>
    </div>
  );
}
