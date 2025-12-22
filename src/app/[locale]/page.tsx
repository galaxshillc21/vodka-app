// import { getTranslations } from "next-intl/server";
import { Hero } from "@/components/section/HeroSection";
import dynamic from "next/dynamic";

// Lazy load all below-the-fold sections with loading states
const MainEvent = dynamic(() => import("@/components/section/MainEventSection").then((mod) => ({ default: mod.MainEvent })), {
  loading: () => (
    <section className="w-full py-20">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-200 rounded-lg mx-auto w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded-lg mx-auto w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  ),
});

const BottleDesignParallax = dynamic(() => import("@/components/section/BottleDesignSection").then((mod) => ({ default: mod.BottleDesignParallax })), {
  loading: () => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg mx-auto w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </section>
  ),
});

const PuritySection = dynamic(() => import("@/components/section/PuritySection"), {
  loading: () => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-gray-200 rounded-lg mx-auto w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-6 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  ),
});

const About2 = dynamic(() => import("@/components/section/AboutSection").then((mod) => ({ default: mod.About2 })), {
  loading: () => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="animate-pulse flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-4 bg-gray-200 rounded-lg"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-4/6"></div>
          </div>
          <div className="flex-1 h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </section>
  ),
});

const Ciencia = dynamic(() => import("@/components/section/CienciaSection").then((mod) => ({ default: mod.Ciencia })), {
  loading: () => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h1>...LOADING</h1>
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg mx-auto w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </section>
  ),
});

const AISection = dynamic(() => import("@/components/section/AISection"), {
  loading: () => (
    <section className="py-20 bg-gradient-to-br from-sky-100 to-white">
      <div className="container mx-auto px-4">
        <div className="animate-pulse flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 h-96 bg-gray-200 rounded-lg"></div>
          <div className="flex-1 space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="h-4 bg-gray-200 rounded-lg"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
            <div className="h-10 bg-gray-200 rounded-full w-48"></div>
          </div>
        </div>
      </div>
    </section>
  ),
});

const Agua = dynamic(() => import("@/components/section/AguaSection"), {
  loading: () => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg mx-auto w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </section>
  ),
});

const BottleDesign2 = dynamic(() => import("@/components/section/BottleDesignSection").then((mod) => ({ default: mod.BottleDesign2 })), {
  loading: () => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg mx-auto w-1/2 mb-8"></div>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 h-64 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  ),
});

export default async function HomePage() {
  return (
    <>
      {/* Above the fold - keep eager loading */}
      <Hero />
      {/* Below the fold - lazy load everything */}
      <MainEvent />
      <BottleDesignParallax />
      <PuritySection />
      <About2 />
      <Ciencia />
      <AISection />
      <Agua />
      <BottleDesign2 />
    </>
  );
}
