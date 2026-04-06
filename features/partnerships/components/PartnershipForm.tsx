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
import type { InstitutionType } from "../queries";

interface PartnershipFormValues {
	name: string;
	company_name: string;
	number_of_employees: string;
}

export default function PartnershipForm({ types }: { types: InstitutionType[] }) {
	const [mobile, setMobile] = useState("");
	const [institutionTypeId, setInstitutionTypeId] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { register, handleSubmit, formState: { errors }, reset } = useForm<PartnershipFormValues>({
		defaultValues: { name: "", company_name: "", number_of_employees: "" },
	});

	const onSubmit = async (values: PartnershipFormValues) => {
		if (!mobile.trim() || !institutionTypeId) {
			toast.error("يرجى تعبئة جميع الحقول المطلوبة");
			return;
		}

        setIsSubmitting(true);
        try {
            await apiClient({
                route: "/business-partnerships",
                method: "POST",
                body: JSON.stringify({
                    name: values.name,
                    mobile: mobile.trim(),
                    institution_type_id: institutionTypeId,
                    company_name: values.company_name,
                    number_of_employees: values.number_of_employees,
                })
            });

            toast.success("تم إرسال طلب الشراكة بنجاح. سنتواصل معك قريباً!");
            reset();
            setMobile("");
            setInstitutionTypeId("");
        } catch (err: unknown) {
            const error = err as { message?: string };
            toast.error(error?.message || "حدث خطأ أثناء إرسال الطلب");
        } finally {
            setIsSubmitting(false);
        }
	};

	return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-[40px] p-8 md:p-16 space-y-8 w-full shadow-xl border border-black/5"
        >
            <div className="space-y-4">
                <Label htmlFor="name" className="text-gray-700 font-bold">
                    الاسم الكامل <span className="text-destructive">*</span>
                </Label>
                <AppInput
                    id="name"
                    placeholder="مثال: محمد عبدالله"
                    Icon={<UserRoundIcon className="text-secondary" size={18} />}
                    {...register("name", { required: "هذا الحقل مطلوب" })}
                />
                {errors.name && <p className="text-destructive text-xs font-bold ps-2">{errors.name.message}</p>}
            </div>

            <div className="pt-2">
                <AppMobileInput value={mobile} onValueChange={setMobile} />
            </div>

            <div className="space-y-4 pt-2">
                <Label htmlFor="type" className="text-gray-700 font-bold">
                    نوع المؤسسة <span className="text-destructive">*</span>
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
                            <SelectValue placeholder="اختر نوع المؤسسة" />
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
                    اسم الشركة <span className="text-destructive">*</span>
                </Label>
                <AppInput
                    id="companyName"
                    placeholder="مثال: شركة النجوم"
                    Icon={<WifiIcon className="text-primary" size={18} />}
                    {...register("company_name", { required: "اسم الشركة مطلوب" })}
                />
                {errors.company_name && <p className="text-destructive text-xs font-bold ps-2">{errors.company_name.message}</p>}
            </div>

            <div className="space-y-4 pt-2">
                <Label htmlFor="numberOfEmployees" className="text-gray-700 font-bold">
                    عدد الموظفين <span className="text-destructive">*</span>
                </Label>
                <AppInput
                    id="numberOfEmployees"
                    type="number"
                    min={1}
                    placeholder="مثال: 50"
                    {...register("number_of_employees", {
                        required: "هذا الحقل مطلوب",
                        pattern: { value: /^\d+$/, message: "أرقام فقط" },
                    })}
                />
                {errors.number_of_employees && <p className="text-destructive text-xs font-bold ps-2">{errors.number_of_employees.message}</p>}
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="h-14 w-full rounded-full bg-primary text-white text-base font-bold hover:bg-accent hover:scale-[1.02] shadow-lg transition-all mt-8"
            >
                {isSubmitting ? "جارٍ الإرسال..." : "إرسال الطلب"}
            </Button>
        </form>
	);
}
