export interface Address {
	id: number;
	lat: string;
	long: string;
	location: string;
	address_label: string | null;
	address_details: string | null;
	neighbourhood: string | null;
	apartment_number: string | null;
	detailed_address: string | null;
	notes: string | null;
	/** API may return 0/1, false/true, or "0"/"1" strings */
	is_default?: number | boolean | string | null;
}

export interface AddressFormData {
    address_label: string;
    location: string;
    address_details?: string;
    neighbourhood?: string;
    apartment_number?: string;
    notes?: string;
    lat: string;
    long: string;
}
