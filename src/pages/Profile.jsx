import React from "react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-[#f5f7fc] px-10 py-10">
      
      {/* Header Section */}
      <div className="flex items-center space-x-6">
        <div className="w-28 h-28 bg-gray-300 rounded-full"></div>

        <div>
          <h1 className="text-3xl font-bold text-[#101624]">Your Profile</h1>
          <p className="text-gray-600 mt-1">Designer • Editor • Creative Freelancer</p>
        </div>
      </div>

      {/* Sections */}
      <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Resume */}
        <div>
          <h2 className="text-xl font-semibold text-[#101624] mb-3">Resume</h2>
          <div className="w-full h-40 bg-white rounded-xl shadow-md"></div>
        </div>

        {/* Testimonials */}
        <div>
          <h2 className="text-xl font-semibold text-[#101624] mb-3">Testimonials</h2>
          <div className="w-full h-40 bg-white rounded-xl shadow-md"></div>
        </div>

      </div>

      {/* Submissions */}
      <div className="mt-14">
        <h2 className="text-xl font-semibold text-[#101624] mb-3">Your Submissions</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-36 bg-white rounded-xl shadow-md"></div>
          <div className="h-36 bg-white rounded-xl shadow-md"></div>
          <div className="h-36 bg-white rounded-xl shadow-md"></div>
        </div>
      </div>

      {/* Completed Deals */}
      <div className="mt-14 mb-20">
        <h2 className="text-xl font-semibold text-[#101624] mb-3">Completed Deals</h2>
        <div className="w-full h-48 bg-white rounded-xl shadow-md"></div>
      </div>

    </div>
  );
}
