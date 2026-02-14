import { useState } from "react";

export default function DefaultImage({
  src,
  alt = "",
  className = "w-full h-full",
  imgClassName = "w-full h-full object-cover",
  label = "No Image",
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`${className} relative overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100`}>
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-200/30" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-indigo-200/20" />
        <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-sky-200/20" />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-white/70 backdrop-blur-sm shadow-sm flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
          </div>
          {label && (
            <span className="text-xs font-medium text-slate-400 tracking-wide">
              {label}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={imgClassName}
      onError={() => setFailed(true)}
    />
  );
}
