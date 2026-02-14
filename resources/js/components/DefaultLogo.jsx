import { useState } from "react";

export default function DefaultLogo({
  src,
  alt = "",
  className = "w-full h-full",
  imgClassName = "w-full h-full object-cover",
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`${className} relative overflow-hidden bg-gradient-to-br from-primary/5 via-blue-50 to-primary/10`}>
        {/* Decorative ring */}
        <div className="absolute inset-1 rounded-full border-2 border-dashed border-primary/10" />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center">
            <svg className="w-5 h-5 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21"
              />
            </svg>
          </div>
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
