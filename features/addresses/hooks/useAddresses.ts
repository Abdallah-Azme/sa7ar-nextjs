"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { addressKeys, fetchAddresses, deleteAddress, setDefaultAddress } from "../services/addressService";
import { toast } from "sonner";

export function useAddressesQuery() {
  return useQuery({
    queryKey: addressKeys.list(),
    queryFn: fetchAddresses,
  });
}

export function useDeleteAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success("تم حذف العنوان بجدارة");
    },
    onError: () => {
      toast.error("خطأ في الحذف");
    }
  });
}

export function useSetDefaultAddressMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("account.addressesList.messages");

  return useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      toast.success(t("setDefaultSuccess"));
    },
    onError: () => {
      toast.error(t("setDefaultFailed"));
    },
  });
}
