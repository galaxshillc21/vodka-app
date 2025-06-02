"use client";

import Image from "next/image";

export default function BottleShow() {
  return (
    <section className="relative h-[200vh]">
      {/* Sticky text container */}
      <div className="sticky top-0 z-20 flex flex-col items-center justify-center h-screen">
        <h1 className="text-6xl font-bold mix-blend-difference text-center text-amber-600">
          BLAT VODKA LOGRA <br />
          LO QUE NINGUN OTRO <br />
          VODKA PREMIUM HA LOGRADO
        </h1>
      </div>
      {/* Bottle image coming from bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end h-full z-30">
        <Image src="/images/blatvodka-bottle-full.webp" alt="Blat Vodka Bottle" width={400} height={800} priority />
      </div>
    </section>
  );
}
