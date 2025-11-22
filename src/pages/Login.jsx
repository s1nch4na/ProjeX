import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="bg-white rounded-xl p-8 shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-3">Sign in / Sign up</h2>
        <p className="text-sm text-gray-500 mb-6">Choose your role to continue</p>

        <div className="flex flex-col gap-4">
          <Link to="/student" className="px-4 py-3 bg-[#7c3aed] text-white rounded-md text-center">Continue as Student</Link>
          <Link to="/investor" className="px-4 py-3 border rounded-md text-center">Continue as Investor</Link>
        </div>
      </div>
    </div>
  );
}
