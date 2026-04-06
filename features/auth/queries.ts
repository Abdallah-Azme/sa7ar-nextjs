import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Profile, ResponseResult } from "@/types";

/**
 * Server-side Auth Check
 * Fetches user profile from server using server-side cookies
 */
export async function getServerAuth() {
	const cookieStore = await cookies();
	const token = cookieStore.get("token")?.value;

	if (!token) return null;

	const API_BASE = process.env.VITE_API_URI || "https://saharapi.subcodeco.com/api";

	try {
        // We call the API directly from server side for best performance
		const res = await fetch(`${API_BASE}/get-profile`, {
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
			},
		});

		if (!res.ok) return null;

		const profileRes: ResponseResult<Profile> = await res.json();
		return profileRes.data;
	} catch (error) {
		console.error("Server Auth Error:", error);
		return null;
	}
}

/**
 * Middleware style check to ensure user is authenticated
 */
export async function requireAuth() {
	const user = await getServerAuth();
	if (!user) {
		redirect("/auth/login");
	}
	return user;
}
