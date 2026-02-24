// src/pages/students/StudentDashboard.jsx
import React, { useMemo, useState } from "react";
import ProjectCard from "../../components/ProjectCard";
import HorizontalScroller from "../../components/HorizontalScroller";
import { getAllProjects } from "../../utils/mockData";

export default function StudentDashboard() {
  const all = getAllProjects();
  const [projects, setProjects] = useState(all);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("newest"); // newest | deadline | price

  // derived and memoized list
  const visible = useMemo(() => {
    let list = [...projects];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.meta || "").toLowerCase().includes(q)
      );
    }

    if (sort === "newest") {
      list.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    } else if (sort === "price") {
      list.sort((a, b) => b.price - a.price);
    } // deadline can be added if you have deadlines

    return list;
  }, [projects, query, sort]);

  return (
    <div className="px-12 py-8">
      <h2 className="text-2xl font-semibold mb-4">Open Projects</h2>

      {/* Controls */}
      <div className="flex gap-3 mb-6 items-center">
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-lg px-3 py-2 bg-white border"
        >
          <option value="newest">Sort: Newest</option>
          <option value="price">Highest price</option>
        </select>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-3 py-2 rounded-lg border flex-1"
          placeholder="Search by keyword or city"
        />
      </div>

      {/* Featured horizontal */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Featured</h3>
        <HorizontalScroller>
          {projects.slice(0, 18).map((p) => (
            <div key={p.id} className="min-w-[320px]">
              <ProjectCard {...p} />
            </div>
          ))}
        </HorizontalScroller>
      </div>

      {/* Grid list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visible.map((p) => (
          <ProjectCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
