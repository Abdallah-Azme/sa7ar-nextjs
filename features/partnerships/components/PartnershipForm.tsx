"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { UserRoundIcon, ChevronDownIcon, BoxIcon, WifiIcon } from "lucide-react";
import AppInput from "@/components/forms/AppInput";
import AppMobileInput from "@/components/forms/AppMobileInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import apiClient from "@/lib/apiClient";
import { useMutation } from "@tanstack/react-query";
import { useInstitutionTypesQuery } from "../hooks/usePartnerships";
import type { InstitutionType } from "../queries";

import { useTranslations } from "next-intl";

interface PartnershipFormValues {
	name: string;
	company_name: string;
	number_of_employees: string;
}

export default function PartnershipForm({ types: initialTypes }: { types?: InstitutionType[] }) {
	const t = useTranslations("partnership");
	const [mobile, setMobile] = useState("");
	const [institutionTypeId, setInstitutionTypeId] = useState<string>("");
    
    const { data: queryTypes } = useInstitutionTypesQuery();
    const types = initialTypes || queryTypes || [];

	const { register, handleSubmit, formState: { errors }, reset } = useForm<PartnershipFormValues>({
		defaultValues: { name: "", company_name: "", number_of_employees: "" },
	});

    const { mutate: submitForm, isPending } = useMutation({
        mutationFn: async (values: PartnershipFormValues) => {
            return apiClient({
                route: "/business-partnerships",
                method: "POST",
                body: JSON.stringify({
                    ...values,
                    mobile: mobile.trim(),
                    institution_type_id: institutionTypeId,
                })
            });
        },
        onSuccess: () => {
            toast.success(t("successMessage"));
            reset();
            setMobile("");
            setInstitutionTypeId("");
        },
        onError: (err: { message?: string }) => {
            toast.error(err?.message || t("errors.submitError"));
        }
    });

	const onSubmit = (values: PartnershipFormValues) => {
		if (!mobile.trim() || !institutionTypeId) {
			toast.error(t("errors.fillAll"));
			return;
		}
        submitForm(values);
	};

	return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-[40px] p-8 md:p-16 space-y-8 w-full shadow-xl border border-black/5"
        >
            <div className="space-y-4">
                <Label htmlFor="name" className="text-gray-700 font-bold">
                    {t("fullName")} <span className="text-destructive">*</span>
                </Label>
                <AppInput
                    id="name"
                    placeholder={t("fullNamePlaceholder")}
                    Icon={<UserRoundIcon className="text-secondary" size={18} />}
                    {...register("name", { required: t("errors.required") })}
                />
                {errors.name && <p className="text-destructive text-xs font-bold ps-2">{errors.name.message}</p>}
            </div>

            <div className="pt-2">
                <AppMobileInput value={mobile} onValueChange={setMobile} />
            </div>

            <div className="space-y-4 pt-2">
                <Label htmlFor="type" className="text-gray-700 font-bold">
                    {t("institutionType")} <span className="text-destructive">*</span>
                </Label>
                <Select
                    value={institutionTypeId}
                    onValueChange={setInstitutionTypeId}
                >
                    <SelectTrigger
                        className="w-full h-12 sm:h-13 rounded-full bg-background-cu border-none shadow-sm focus:ring-2 focus:ring-accent/50 outline-none px-4"
                    >
                        <div className="flex items-center gap-3 w-full">
                            <BoxIcon className="text-primary" size={18} />
                            <span className="text-black/10">|</span>
                            <SelectValue placeholder={t("institutionTypePlaceholder")} />
                        </div>
                        <div className="bg-gray-200 size-8 sm:size-9 rounded-full flex justify-center items-center ms-auto shrink-0">
                            <ChevronDownIcon className="text-primary size-4" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-xl p-2 bg-white">
                        {types.map((item) => (
                            <SelectItem
                                className="h-12 mt-1 rounded-full text-primary hover:bg-accent/10 focus:bg-accent/10 cursor-pointer font-medium"
                                key={item.id}
                                value={String(item.id)}
                            >
                                {item.name_en || item.name || "-"}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-4 pt-2">
                <Label htmlFor="companyName" className="text-gray-700 font-bold">
                    {t("companyName")} <span className="text-destructive">*</span>
                </Label>
                <AppInput
                    id="companyName"
                    placeholder={t("companyNamePlaceholder")}
                    Icon={<WifiIcon className="text-primary" size={18} />}
                    {...register("company_name", { required: t("errors.companyName") })}
                />
                {errors.company_name && <p className="text-destructive text-xs font-bold ps-2">{errors.company_name.message}</p>}
            </div>

            <div className="space-y-4 pt-2">
                <Label htmlFor="numberOfEmployees" className="text-gray-700 font-bold">
                    {t("numberOfEmployees")} <span className="text-destructive">*</span>
                </Label>
                <AppInput
                    id="numberOfEmployees"
                    type="number"
                    min={1}
                    placeholder={t("numberOfEmployeesPlaceholder")}
                    {...register("number_of_employees", {
                        required: t("errors.required"),
                        pattern: { value: /^\d+$/, message: t("errors.numbersOnly") },
                    })}
                />
                {errors.number_of_employees && <p className="text-destructive text-xs font-bold ps-2">{errors.number_of_employees.message}</p>}
            </div>

            <Button
                type="submit"
                disabled={isPending}
                className="h-14 w-full rounded-full bg-primary text-white text-base font-bold hover:bg-accent hover:scale-[1.02] shadow-lg transition-all mt-8"
            >
                {isPending ? t("submitting") : t("submit")}
            </Button>
        </form>
	);
}
