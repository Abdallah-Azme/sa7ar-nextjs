import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy API Route
 * Resolves CORS issues for client-side fetching by forwarding requests from server.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://saharapi.subcodeco.com/api";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const route = searchParams.get("route");

  if (!route) {
    return NextResponse.json({ message: "Route parameter is missing" }, { status: 400 });
  }

  const url = `${API_BASE}${route}`;

  try {
    const res = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Authorization": req.headers.get("Authorization") || "",
        "Accept-Language": "ar",
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ message: "Failed to proxy request" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    // Basic implementation for POST if needed by client
    const searchParams = req.nextUrl.searchParams;
    const route = searchParams.get("route");
    if (!route) return NextResponse.json({ message: "Route missing" }, { status: 400 });

    const body = await req.json();

    const res = await fetch(`${API_BASE}${route}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": req.headers.get("Authorization") || "",
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}
