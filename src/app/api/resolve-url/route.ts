import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 });
  }

  try {
    // Fetch the URL and follow redirects
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
    });

    // Return the final URL after redirects
    return NextResponse.json({ resolvedUrl: response.url });
  } catch (error) {
    console.error("Error resolving URL:", error);
    return NextResponse.json({ error: "Failed to resolve URL" }, { status: 500 });
  }
}
