import React, { useEffect, useState } from "react";
import { fetchProfiles } from "../utils/api";

export default function Home() {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles().then(setProfiles);
  }, []);

  return (
    <div className="px-12 py-10 bg-[#F5F7FA] text-[#1C1E21] min-h-screen">

      {/* Popular Creators */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Popular Creators this week</h2>
          <a href="#" className="text-purple-600 font-medium text-sm hover:underline">
            View all →
          </a>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <div className="flex space-x-6">

            {profiles.length === 0 && (
              <p className="text-gray-500 text-sm">Loading creators…</p>
            )}

            {profiles.map((user) => (
              <div
                key={user.id}
                className="min-w-[180px] bg-white rounded-xl p-4 shadow-sm 
                border border-gray-200 hover:shadow-md transition"
              >
                <div className="w-full h-28 bg-gray-100 rounded-lg"></div>

                <p className="mt-3 font-medium text-sm">{user.name}</p>

                <p className="text-xs text-gray-500">
                  {user.skills.join(", ")}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* The rest of your sections remain unchanged... */}

    </div>
  );
}
