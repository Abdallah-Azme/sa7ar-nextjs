import { redirect } from "next/navigation";

/**
 * Redirect: /account/profile → /account/details
 * Preserves old URLs while routing to the correct React-matching path.
 */
export default function ProfileRedirect() {
	redirect("/account/details");
}
