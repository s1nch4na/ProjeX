import React from "react";
import { PROFESSIONAL_CATEGORIES } from "../utils/profileCategories";

export default function ProfessionalCategoryChips({
  selected = [],
  onChange,
  readOnly = false,
}) {
  const toggleCategory = (category) => {
    if (readOnly) return;

    onChange(
      selected.includes(category)
        ? selected.filter((item) => item !== category)
        : [...selected, category]
    );
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {PROFESSIONAL_CATEGORIES.map((category) => {
          const isSelected = selected.includes(category);

          return (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              aria-pressed={isSelected}
              disabled={readOnly}
              className={`rounded-full border px-3 py-2 text-xs transition ${
                isSelected
                  ? "border-black bg-black text-white"
                  : "border-neutral-300 bg-white text-neutral-700 hover:border-black"
              } ${readOnly ? "cursor-default" : "cursor-pointer"}`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <p className="mt-3 text-sm text-neutral-500">
          No professional categories selected yet.
        </p>
      )}
    </div>
  );
}
