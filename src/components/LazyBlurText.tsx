"use client";

import dynamic from "next/dynamic";

// Lazy load BlurText with properly typed loading placeholder
const BlurText = dynamic(() => import("@/components/BlurText"), {
  loading: () => {
    // Render a generic placeholder while loading
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded-md mb-2 w-full" />
        <div className="h-8 bg-gray-200 rounded-md mb-2 w-3/4" />
      </div>
    );
  },
  ssr: false,
});

export default BlurText;
