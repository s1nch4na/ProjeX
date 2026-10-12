
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const FALLBACK_IMAGES = {
  technology:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  design:
    "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
  marketing:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  business:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",
  default:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
};

function getFallbackImage(meta = "") {
  const category = String(meta || "").toLowerCase();

  if (/tech|software|developer|ai|data|web|app|engineer/.test(category)) {
    return FALLBACK_IMAGES.technology;
  }

  if (/design|creative|ui|ux|graphic|illustrat/.test(category)) {
    return FALLBACK_IMAGES.design;
  }

  if (/marketing|social media|advertis|brand|content/.test(category)) {
    return FALLBACK_IMAGES.marketing;
  }

  if (/business|finance|management|startup|consult/.test(category)) {
    return FALLBACK_IMAGES.business;
  }

  return FALLBACK_IMAGES.default;
}

export default function ProjectCard({
  id,
  title,
  meta = "",
  price,
  image,
  onApply,
}) {
  const location = useLocation();
  const fallbackImage = getFallbackImage(meta);

  const [imageSrc, setImageSrc] = useState(image || fallbackImage);

  useEffect(() => {
    setImageSrc(image || fallbackImage);
  }, [image, fallbackImage]);

  const handleImageError = () => {
    setImageSrc((currentImage) =>
      currentImage === fallbackImage
        ? ""
        : fallbackImage
    );
  };

  return (
    <div className="bg-white p-4 border border-black rounded-none shadow-none flex flex-col justify-between">
      <Link
        to={`/projects/${id}`}
        state={{ background: location }}
        className="block"
      >
        <div className="w-full h-40 bg-[#F3F3EF] border border-black mb-3 overflow-hidden">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={title || "Project cover"}
              onError={handleImageError}
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4 text-center">
              <span className="font-mono text-xs uppercase tracking-widest">
                ProjeX / Project
              </span>
            </div>
          )}
        </div>

        <h3 className="font-bold text-[#0A0A0A] uppercase tracking-tight">
          {title}
        </h3>

        <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mt-0.5">
          {meta}
        </p>
      </Link>

      <div className="mt-4 pt-3 border-t border-neutral-200 flex justify-between items-center">
        <span className="text-xs font-mono font-bold text-black uppercase">
          {price == null || price === ""
            ? "Budget —"
            : `₹${price}`}
        </span>

        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => onApply?.({ id, title })}
            className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 bg-white border border-black text-black hover:bg-black hover:text-white transition cursor-pointer"
          >
            Apply →
          </button>

          <Link
            to={`/projects/${id}`}
            state={{ background: location }}
            className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 bg-black text-white"
          >
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}

