import { redirect } from "next/navigation";
import { generateAlternateMetadata } from "@/lib/seo";

export const metadata = generateAlternateMetadata("/account/profile");

/**
 * Redirect: /account/profile → /account/details
 * Preserves old URLs while routing to the correct React-matching path.
 */
export default function ProfileRedirect() {
	redirect("/account/details");
}
