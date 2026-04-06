"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckIcon, EditIcon, Trash2Icon, PlusIcon, MapPinIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LocationPinIcon from "@/components/icons/LocationPinIcon";
import EmptyCard from "@/components/shared/EmptyCard";
import type { Address } from "../types";

interface AddressListViewProps {
	addresses: Address[];
}

/**
 * AddressListView - Client Component
 * Interactive list of delivery addresses with actions for setting default, editing, or deleting.
 */
export default function AddressListView({ addresses }: AddressListViewProps) {
	const [selectedId, setSelectedId] = useState<number | null>(
        addresses.find(a => a.is_default === 1)?.id || null
    );

	return (
		<div className="space-y-10">
			<header className="flex items-center justify-between gap-6 flex-wrap">
				<h1 className="text-2xl font-extrabold text-primary">My Addresses</h1>
				<Button className="rounded-full bg-black hover:bg-black/90 px-8" asChild>
					<Link href="/account/addresses/new">
                        <PlusIcon size={18} className="me-2" />
                        Add New Address
                    </Link>
				</Button>
			</header>

			{/* List Section */}
			<div className="grid gap-6">
				{addresses.length === 0 ? (
					<div className="bg-white border rounded-4xl p-16 shadow-inner text-center">
						<EmptyCard
							title="No addresses found"
							description="You haven't added any delivery addresses yet. Add one to speed up your checkout process!"
						/>
					</div>
				) : (
					addresses.map((address) => {
                        const isDefault = address.is_default === 1;
                        return (
                            <div 
                                key={address.id}
                                className={cn(
                                    "p-6 rounded-4xl border transition-all relative overflow-hidden group",
                                    isDefault ? "bg-accent/5 border-accent ring-1 ring-accent" : "bg-white hover:bg-gray-50/50"
                                )}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    {/* Info */}
                                    <div className="flex items-start gap-4">
                                        <div className={cn(
                                            "size-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
                                            isDefault ? "bg-accent text-white" : "bg-accent/10 text-accent"
                                        )}>
                                            <LocationPinIcon size={20} />
                                        </div>
                                        <div className="text-start space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-extrabold text-primary text-lg">
                                                    {address.address_label || "Home Address"}
                                                </h3>
                                                {isDefault && (
                                                    <span className="px-2 py-0.5 bg-accent text-white text-[10px] font-bold rounded uppercase tracking-wider">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray leading-relaxed">
                                                {address.address_label ? address.location : address.detailed_address || address.location}
                                            </p>
                                            {address.notes && (
                                                <p className="text-xs text-gray/70 italic italic pt-1 flex items-center gap-1">
                                                    <span className="font-bold shrink-0">Note:</span> {address.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 self-end sm:self-center">
                                        {!isDefault && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="rounded-full h-9 px-4 text-xs font-bold border-accent/20 text-accent hover:bg-accent/5"
                                            >
                                                Set Default
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="icon" className="rounded-full size-10 hover:bg-primary/5" asChild>
                                            <Link href={`/account/addresses/${address.id}`}>
                                                <EditIcon size={16} />
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="rounded-full size-10 text-destructive hover:bg-destructive/5 hover:text-destructive">
                                            <Trash2Icon size={16} />
                                        </Button>
                                    </div>
                                </div>
                                
                                {isDefault && (
                                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                                        <div className="absolute transform rotate-45 bg-accent text-white text-[8px] font-bold py-1 px-10 right-[-30px] top-[10px] shadow-sm">
                                            ACTIVE
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
				)}
			</div>
		</div>
	);
}
