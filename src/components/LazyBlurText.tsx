"use client";

import dynamic from "next/dynamic";
import { ComponentProps } from "react";

interface LazyBlurTextProps extends ComponentProps<any> {
  text: string;
  className?: string;
  delay?: number;
  animateBy?: "words" | "characters";
  direction?: "top" | "bottom" | "left" | "right";
  onAnimationComplete?: () => void;
}

// Lazy load BlurText with properly typed loading placeholder
const BlurText = dynamic(() => import("@/src/components/BlurText"), {
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
