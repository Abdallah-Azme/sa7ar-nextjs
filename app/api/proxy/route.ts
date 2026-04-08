import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy API Route
 * Resolves CORS issues for client-side fetching by forwarding requests from server.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://saharapi.subcodeco.com/api";

function getAuthorizationHeader(req: NextRequest) {
  const explicitAuth = req.headers.get("Authorization");
  if (explicitAuth) return explicitAuth;

  const tokenFromCookie = req.cookies.get("token")?.value;
  return tokenFromCookie ? `Bearer ${tokenFromCookie}` : "";
}

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
        "Authorization": getAuthorizationHeader(req),
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
  const searchParams = req.nextUrl.searchParams;
  const route = searchParams.get("route");
  if (!route) return NextResponse.json({ message: "Route missing" }, { status: 400 });

  try {
    const contentType = req.headers.get("content-type") ?? "";
    const isMultipart = contentType.includes("multipart/form-data");

    const baseHeaders: Record<string, string> = {
      "Authorization": getAuthorizationHeader(req),
      "Accept-Language": "ar",
      "Accept": "application/json",
    };

    const fetchOptions: RequestInit = {
      method: "POST",
      headers: baseHeaders,
    };

    if (isMultipart) {
      const formData = await req.formData();
      fetchOptions.body = formData;
    } else {
      const body = await req.json();
      fetchOptions.body = JSON.stringify(body);
      baseHeaders["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE}${route}`, fetchOptions);

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ message: "Failed to proxy request" }, { status: 500 });
  }
}
