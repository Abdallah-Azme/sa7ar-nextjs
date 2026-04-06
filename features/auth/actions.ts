"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server Actions for Auth
 * Handles token persistency through server-side cookies
 */

export async function loginAction(token: string) {
	const cookieStore = await cookies();

	cookieStore.set("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
		maxAge: 60 * 60 * 24 * 30, // 30 days
	});

	// Return success but let client handle the redirect to ensure state updates
	return { success: true };
}

export async function logoutAction() {
	const cookieStore = await cookies();
	cookieStore.delete("token");

	// Redirect is managed here for complete server-side navigation
	redirect("/");
}
