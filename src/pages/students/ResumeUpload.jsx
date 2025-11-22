import React from "react";

export default function ResumeUpload() {
  return (
    <div className="px-12 py-10">
      <div className="max-w-2xl bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3">Upload Resume / Portfolio</h3>
        <p className="text-sm text-gray-600 mb-4">Drag & drop PDF or link to Google Drive</p>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
          <input type="file" className="mb-3" />
          <div className="text-sm text-gray-500">Upload file (PDF / images). Demo only.</div>
        </div>
      </div>
    </div>
  );
}
