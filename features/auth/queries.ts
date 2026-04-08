export * from "./services/authService";
import { fetchProfile } from "./services/authService";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Server-side Auth Check
 * Fetches user profile from server using server-side cookies
 */
export async function getServerAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
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
