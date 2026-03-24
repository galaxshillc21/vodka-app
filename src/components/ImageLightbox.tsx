"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect } from "react";

interface ImageLightboxProps {
  alt: string;
  imageUrl: string;
  onClose: () => void;
}

export default function ImageLightbox({ alt, imageUrl, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[99999] bg-white/30 px-4 py-8 sm:px-8 sm:py-10 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={alt}>
      <button type="button" onClick={onClose} className="absolute right-4 top-4 z-[999999] inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60" aria-label="Close image">
        <X className="h-6 w-6" />
      </button>
      <div className="relative flex h-full w-full items-center justify-center">
        <Image src={imageUrl} alt={alt} width={1600} height={1600} sizes="100vw" priority onClick={(event) => event.stopPropagation()} className="block h-auto max-h-[82vh] w-auto max-w-full object-contain" />
      </div>
    </div>
  );
}
