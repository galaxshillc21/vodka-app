// app/api/geo/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const q = searchParams.get("q");

	if (!q) {
		return NextResponse.json({ error: "Missing 'q'" }, { status: 400 });
	}

	try {
		const res = await fetch(
			`https://nominatim.openstreetmap.org/search?q=${q}&format=json&addressdetails=1&countrycodes=ES`,
			{
				headers: {
					"User-Agent": "YourAppName (your@email.com)", // required by Nominatim usage policy
				},
			}
		);

		if (!res.ok) {
			throw new Error("Failed to fetch from nominatim");
		}

		const data = await res.json();
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
