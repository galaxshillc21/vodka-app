"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      <p className="mb-4">The best</p>
      <Link href="/search" className="text-primary underline">
        Go Search
      </Link>
    </main>
  );
}
