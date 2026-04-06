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
	is_default: number;
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
