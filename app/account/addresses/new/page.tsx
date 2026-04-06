import AddressForm from "@/features/addresses/components/AddressForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Address | Sohar Water",
};

export default function AddAddressPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary">إضافة عنوان جديد</h1>
        <p className="text-gray-500 font-medium leading-relaxed">
            حدد موقعك بدقة على الخريطة لضمان توصيل طلباتك بسلاسة.
        </p>
      </header>

      <AddressForm />
    </div>
  );
}
