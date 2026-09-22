import React from "react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#F3F3EF] text-[#0A0A0A] font-sans px-6 md:px-12 py-16 selection:bg-black selection:text-white">
      
      {/* Header Section */}
      <div className="border-b border-black pb-12 mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-neutral-200 border border-black rounded-none flex items-center justify-center font-mono text-xs uppercase text-neutral-500">
            [ Avatar ]
          </div>

          <div>
            <div className="inline-block border border-black px-2 py-0.5 text-[10px] uppercase tracking-widest font-mono mb-2">
              Verified Creator
            </div>
            <h1 className="text-4xl font-bold tracking-tight uppercase">Your Profile</h1>
            <p className="text-sm font-mono text-neutral-600 mt-1 uppercase tracking-wider">
              Designer // Editor // Creative Freelancer
            </p>
          </div>
        </div>

        <button className="px-6 py-3 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-neutral-800 transition-colors rounded-none">
          Edit Profile →
        </button>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

        {/* Resume */}
        <div className="border border-black bg-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200 font-mono text-xs">
              <span className="uppercase text-neutral-500">Document Registry</span>
              <span>PDF / ATTACHED</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight uppercase mb-2">Resume / Credentials</h2>
            <p className="text-xs text-neutral-600 leading-relaxed mb-6">
              Primary deployment record tracking academic background, technical proficiencies, and past production history.
            </p>
          </div>
          <button className="w-full py-2.5 border border-black text-xs font-mono uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
            Download / View Document →
          </button>
        </div>

        {/* Testimonials */}
        <div className="border border-black bg-white p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200 font-mono text-xs">
              <span className="uppercase text-neutral-500">Peer Feedback</span>
              <span>RATING: 4.9/5.0</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight uppercase mb-2">Testimonials</h2>
            <p className="text-xs text-neutral-600 leading-relaxed mb-6">
              "Delivered production code and design systems ahead of the milestone schedule. Absolute asset to the team."
            </p>
          </div>
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
            — Verified Startup Founder
          </div>
        </div>

      </div>

      {/* Submissions */}
      <div className="mb-16">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold tracking-tight uppercase">Your Submissions</h2>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">[ 3 Active ]</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-black bg-white p-5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-500 border border-neutral-300 px-2 py-0.5 inline-block mb-3">
                  Submission #0{item}
                </span>
                <h3 className="font-bold text-base tracking-tight mb-1">Project Artifact v{item}.0</h3>
                <p className="text-xs text-neutral-600 mb-6">Pending final review by project lead.</p>
              </div>
              <span className="text-xs font-mono text-black underline underline-offset-4 cursor-pointer hover:text-neutral-600">
                Inspect File →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Deals */}
      <div className="border border-black bg-white p-8">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-black">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Ledger</span>
            <h2 className="text-2xl font-bold tracking-tight uppercase mt-1">Completed Deals</h2>
          </div>
          <span className="text-xs font-mono uppercase tracking-widest px-3 py-1 bg-black text-white">
            Status: Settled
          </span>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-neutral-200 text-sm">
            <div>
              <span className="font-bold">EcoKart Brand Identity System</span>
              <p className="text-xs text-neutral-600 font-mono">Client: Riya Sharma — Completed August 2026</p>
            </div>
            <span className="font-mono font-bold mt-2 sm:mt-0">₹5,000 Settled</span>
          </div>
        </div>
      </div>

    </div>
  );
}