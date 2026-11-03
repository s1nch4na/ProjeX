import React from "react";

export default function TalentProfiles() {
  return (
    <div className="min-h-[60vh] bg-[#F3F3EF] px-6 md:px-12 py-10">
      <div className="border-b border-black pb-4 mb-8">
        <p className="text-xs uppercase tracking-widest font-mono text-neutral-500">
          Project Owner / Directory
        </p>
        <h1 className="text-3xl font-bold uppercase tracking-tight mt-1">
          Student Talent
        </h1>
      </div>
      <div className="border border-black bg-white p-6 max-w-2xl">
        <p className="text-sm leading-relaxed">
          A public student directory is not available yet. Student profiles
          are visible from authenticated project and messaging workflows.
        </p>
      </div>
    </div>
  );
}
