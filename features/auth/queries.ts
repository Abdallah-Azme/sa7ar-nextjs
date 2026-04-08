export * from "./services/authService";
import { fetchProfile } from "./services/authService";
import { redirect } from "next/navigation";

/**
 * Server-side Auth Check
 * Fetches user profile from server using server-side cookies
 */
export async function getServerAuth() {
    return fetchProfile();
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
