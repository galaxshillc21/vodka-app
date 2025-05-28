"use client";

import Link from "next/link";

export default function News() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">News</h1>
      <p className="mb-4">Stay updated with the latest news about Blat Vodka.</p>
      <Link href="/" className="text-primary underline">
        Go back to Home
      </Link>
    </main>
  );
}
