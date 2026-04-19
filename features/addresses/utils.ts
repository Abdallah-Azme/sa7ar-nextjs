import type { Address } from "./types";

/**
 * Backend may send is_default as 1/0, true/false, or "1"/"0" strings.
 */
export function isAddressDefault(address: Address): boolean {
	const v = address.is_default as unknown;
	if (v === true || v === 1) return true;
	if (v === false || v === 0 || v == null || v === "") return false;
	if (typeof v === "string") {
		const s = v.trim().toLowerCase();
		return s === "1" || s === "true";
	}
	return Boolean(v);
}
