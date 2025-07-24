"use client";
// https://www.reactbits.dev/components/spotlight-card
import React, { useRef, useEffect } from "react";
import "@/components/css/SpotlightCard.css"; // Ensure this path is correct based on your project structure

// interface Position {
// 	x: number;
// 	y: number;
// }

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className = "", spotlightColor = "rgba(255, 255, 255, 0.25)" }) => {
  const divRef = useRef<HTMLDivElement>(null);

  const setCenterSpotlight = () => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };

  // Set spotlight to center on mobile/small screens on mount
  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      setCenterSpotlight();
    }
    // Optionally, update on resize
    const handleResize = () => {
      if (window.innerWidth <= 768) setCenterSpotlight();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line
  }, [spotlightColor]);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    divRef.current.style.setProperty("--mouse-x", `${x}px`);
    divRef.current.style.setProperty("--mouse-y", `${y}px`);
    divRef.current.style.setProperty("--spotlight-color", spotlightColor);
  };

  return (
    <div ref={divRef} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`}>
      {children}
    </div>
  );
};

export default SpotlightCard;
