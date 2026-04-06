"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { SearchIcon, StarIcon, Loader2Icon, AlertTriangleIcon, UserRoundIcon } from "lucide-react";
import { toast } from "sonner";
import AppInput from "@/components/forms/AppInput";
import AppMobileInput from "@/components/forms/AppMobileInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import apiClient from "@/lib/apiClient";

const DEFAULT_LAT = 23.5859;
const DEFAULT_LON = 58.4059; // Muscat

interface AddressInitialData {
	lat?: string | number;
	long?: string | number;
	location?: string;
	home_address?: string;
	building_number?: string;
	floor_number?: string;
	description?: string;
	contact_name?: string;
	contact_mobile?: string;
}

export default function AddressForm({ addressId, initialData }: { addressId?: string; initialData?: AddressInitialData }) {
	const router = useRouter();
	const isEditMode = Boolean(addressId);
	
    const [searchText, setSearchText] = useState("");
	const [searchResults, setSearchResults] = useState<{ lat: string; lon: string; display_name: string }[]>([]);
	const [isLocating, setIsLocating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);

	const [selectedLocation, setSelectedLocation] = useState({
		lat: initialData?.lat ? Number(initialData.lat) : DEFAULT_LAT,
		long: initialData?.long ? Number(initialData.long) : DEFAULT_LON,
		location: initialData?.location || "",
	});

	const [formValues, setFormValues] = useState({
		home_address: initialData?.home_address || "",
		building_number: initialData?.building_number || "",
		floor_number: initialData?.floor_number || "",
		description: initialData?.description || "",
		contact_name: initialData?.contact_name || "",
		contact_mobile: initialData?.contact_mobile || "",
	});

    useEffect(() => {
        if (initialData) {
            setSearchText(initialData.location || "");
        }
    }, [initialData]);

	const mapSrc = useMemo(() => {
		return `https://maps.google.com/maps?q=${selectedLocation.lat},${selectedLocation.long}&z=15&output=embed`;
	}, [selectedLocation.lat, selectedLocation.long]);

	const handleSearch = async (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!searchText.trim()) return;

		try {
			const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchText)}&format=json&limit=5`);
			const results = await res.json();
			setSearchResults(results);
			if (results.length === 1) applyLocation(results[0].lat, results[0].lon, results[0].display_name);
		} catch {
			toast.error("تعذّر البحث عن الموقع");
		}
	};

	const applyLocation = (lat: string, lon: string, name: string) => {
		setSelectedLocation({ lat: Number(lat), long: Number(lon), location: name });
		setSearchText(name);
		setSearchResults([]);
	};

	const handleGeoLocation = () => {
		if (!navigator.geolocation) {
			toast.error("المتصفح لا يدعم خاصية تحديد الموقع");
			return;
		}

		setIsLocating(true);
		navigator.geolocation.getCurrentPosition(
			async (position) => {
				const { latitude, longitude } = position.coords;
				try {
					const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
					const data = await res.json();
					applyLocation(String(latitude), String(longitude), data.display_name || `${latitude}, ${longitude}`);
				} catch {
					applyLocation(String(latitude), String(longitude), `${latitude}, ${longitude}`);
				} finally {
					setIsLocating(false);
				}
			},
			() => {
				toast.error("تعذّر تحديد موقعك الحالي");
				setIsLocating(false);
			}
		);
	};

	const onSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formValues.home_address.trim()) {
			toast.error("حقل العنوان مطلوب");
			return;
		}

		setIsSubmitting(true);
		try {
            const payload = {
                ...formValues,
                mobile_number: formValues.contact_mobile,
                full_name: formValues.contact_name,
                lat: String(selectedLocation.lat),
                long: String(selectedLocation.long),
                location: selectedLocation.location,
            };

            const route = isEditMode ? `/addresses/${addressId}` : "/addresses";
            
			await apiClient({
                route,
                method: isEditMode ? "PUT" : "POST",
                tokenRequire: true,
                body: JSON.stringify(payload)
            });

			toast.success("تم حفظ العنوان بنجاح");
			setDialogOpen(false);
			router.push("/account/addresses");
            router.refresh();
		} catch (err: unknown) {
			const error = err as { message?: string };
			toast.error(error?.message || "حدث خطأ أثناء حفظ العنوان");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-8">
			<div className="relative group/map rounded-[40px] overflow-hidden shadow-md">
                {/* Search Bar Overlay */}
				<div className="absolute top-8 left-8 right-8 z-10 flex flex-col md:flex-row gap-4">
					<form className="flex-1 relative" onSubmit={handleSearch}>
						<AppInput
							Icon={<SearchIcon className="text-gray-400 size-5" />}
							placeholder="Search for an area or landmark..."
							className="bg-white/95 backdrop-blur shadow-lg h-14 font-medium"
							value={searchText}
							onValueChange={setSearchText}
						/>
                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden max-h-48 z-20">
                                {searchResults.map((item, idx) => (
                                    <button
                                        type="button"
                                        key={idx}
                                        onClick={() => applyLocation(item.lat, item.lon, item.display_name)}
                                        className="w-full text-start px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                    >
                                        {item.display_name}
                                    </button>
                                ))}
                            </div>
                        )}
					</form>
					<Button
						className="h-14 rounded-full bg-accent hover:bg-accent/90 text-white font-bold shadow-lg shrink-0 px-6 gap-3"
						onClick={handleGeoLocation}
						disabled={isLocating}
					>
						{isLocating ? <Loader2Icon className="animate-spin size-5" /> : <StarIcon className="size-5" />}
						استخدام موقعي الحالي
					</Button>
				</div>

				<iframe
					src={mapSrc}
					width="100%"
					height="600"
					style={{ border: 0 }}
					allowFullScreen
					loading="lazy"
					title="Address Map"
                    className="w-full h-[600px] object-cover bg-gray-50"
				/>

                {/* Confirm Overlay */}
				<div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col md:flex-row items-center justify-between gap-4">
					<div className="bg-white/90 backdrop-blur rounded-2xl px-6 py-4 flex items-center gap-4 shadow-lg w-full md:w-auto">
						<div className="bg-primary/10 text-primary p-3 rounded-full shrink-0">
							<AlertTriangleIcon size={20} />
						</div>
						<p className="text-xs font-bold text-gray-700 leading-relaxed uppercase tracking-wide">
							تأكد من دقة موقعك على الخريطة قبل تأكيد الموقع.
						</p>
					</div>

					<Dialog open={dialogOpen} onOpenChange={(open) => {
                        if (open && !formValues.home_address) {
                            setFormValues(p => ({ ...p, home_address: selectedLocation.location }));
                        }
                        setDialogOpen(open);
                    }}>
						<DialogTrigger asChild>
							<Button className="h-14 rounded-full bg-white text-primary border-2 border-primary hover:bg-primary/5 font-extrabold shadow-lg shrink-0 px-8 w-full md:w-auto gap-3 text-sm transition-all duration-300">
								تأكيد الموقع
							</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-xl rounded-[40px] p-8 md:p-12 shadow-2xl bg-gray-50 border-none max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-extrabold text-primary">
                                    {isEditMode ? "تحديث عنوان التوصيل" : "حفظ عنوان التوصيل"}
                                </DialogTitle>
                            </DialogHeader>

							<form className="space-y-6 mt-6" onSubmit={onSubmit}>
								<div className="space-y-3">
									<label className="text-sm font-bold text-gray-700">Address Label / Home Address <span className="text-destructive">*</span></label>
									<AppInput
										placeholder="e.g. Al Khuwair South, Muscat"
                                        className="bg-white"
										value={formValues.home_address}
										onValueChange={(val) => setFormValues((p) => ({ ...p, home_address: val }))}
									/>
								</div>

								<div className="grid grid-cols-2 gap-6">
									<div className="space-y-3">
                                        <label className="text-sm font-bold text-gray-700">Building / Villa No.</label>
                                        <AppInput
                                            placeholder="e.g. 104"
                                            className="bg-white"
                                            value={formValues.building_number}
                                            onValueChange={(val) => setFormValues((p) => ({ ...p, building_number: val }))}
                                        />
                                    </div>
									<div className="space-y-3">
                                        <label className="text-sm font-bold text-gray-700">Floor / Apartment</label>
                                        <AppInput
                                            placeholder="e.g. Floor 2"
                                            className="bg-white"
                                            value={formValues.floor_number}
                                            onValueChange={(val) => setFormValues((p) => ({ ...p, floor_number: val }))}
                                        />
                                    </div>
								</div>

                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-gray-700">Additional Instructions</label>
                                    <Textarea
                                        className="bg-white min-h-[100px] border-none shadow-sm rounded-2xl p-4 font-medium"
                                        placeholder="Nearest landmark, delivery notes..."
                                        value={formValues.description}
                                        onChange={(e) => setFormValues((p) => ({ ...p, description: e.target.value }))}
                                    />
                                </div>

                                <div className="border-t border-gray-200 pt-6 space-y-6">
                                    <h3 className="font-extrabold text-primary">Receiver Details</h3>
                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-gray-700">Contact Person Name</label>
                                        <AppInput
                                            placeholder="e.g. Abdullah"
                                            Icon={<UserRoundIcon className="text-gray-400 size-5" />}
                                            className="bg-white"
                                            value={formValues.contact_name}
                                            onValueChange={(val) => setFormValues((p) => ({ ...p, contact_name: val }))}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <AppMobileInput
                                            value={formValues.contact_mobile}
                                            onValueChange={(val) => setFormValues((p) => ({ ...p, contact_mobile: val }))}
                                        />
                                    </div>
                                </div>

								<Button
									type="submit"
									disabled={isSubmitting}
									className="h-14 w-full rounded-full bg-primary hover:bg-accent text-white font-bold shadow-lg transition-transform hover:scale-[1.02] mt-4"
								>
									{isSubmitting ? "جارٍ الحفظ..." : isEditMode ? "تحديث العنوان" : "حفظ العنوان"}
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			</div>
		</div>
	);
}
