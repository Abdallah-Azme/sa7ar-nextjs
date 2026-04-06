import type { RequestAppInit, ResponseResult } from "@/types";

/**
 * Isomorphic Fetch Wrapper for Next.js
 * Solves CORS by ensuring client-side requests go through a Next.js API Route (Proxy)
 * and server-side requests call the API directly.
 */
export default async function apiClient<T = unknown>({
	route,
	isFormData = false,
	tokenRequire = false,
	...props
}: RequestAppInit): Promise<ResponseResult<T>> {
	const isServer = typeof window === "undefined";
	
	// Server-side: Direct API call
    // Client-side: Proxy through /api/proxy to avoid CORS
	const API_BASE = isServer 
        ? (process.env.VITE_API_URI || "https://saharapi.subcodeco.com/api")
        : "/api/proxy";
        
	const URI = isServer ? `${API_BASE}${route}` : `${API_BASE}?route=${encodeURIComponent(route)}`;

	const headersInit: HeadersInit = {
		"Accept-Language": "ar",
	};

	if (!isFormData) {
		headersInit["Accept"] = "application/json";
		headersInit["Content-Type"] = "application/json";
	}

	if (tokenRequire) {
		let token: string | null = null;

		if (isServer) {
            try {
                const { cookies } = await import("next/headers");
                const cookieStore = await cookies();
                token = cookieStore.get("token")?.value || null;
            } catch (e) {
                console.warn("apiClient: Failed to access cookies on server", e);
            }
		} else {
			token = localStorage.getItem("token");
		}

		if (token) {
			headersInit["Authorization"] = `Bearer ${token}`;
		}
	}

	const res = await fetch(URI, {
		headers: {
			...headersInit,
			...props.headers,
		},
		next: { revalidate: 3600 }, 
		...props,
	});

	if (!res.ok) {
        let errorData: any;
        try {
            errorData = await res.json();
        } catch {
            errorData = { message: "Internal Server Error" };
        }
		errorData.code = res.status;
		throw errorData;
	}

	const data: ResponseResult<T> = await res.json();
	data.code = res.status;
	return data;
}
