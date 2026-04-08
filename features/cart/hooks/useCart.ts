"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartKeys, fetchCart, postAddToCart, postUpdateCart, postApplyCoupon } from "../services/cartService";
import { toast } from "sonner";

import { useTranslations } from "next-intl";

export function useCartQuery(enabled = true) {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: fetchCart,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useAddToCartMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("cart.messages");

  return useMutation({
    mutationFn: postAddToCart,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success(res?.message || t("added"));
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err?.message || t("addError"));
    }
  });
}

export function useUpdateCartMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("cart.messages");

  return useMutation({
    mutationFn: postUpdateCart,
    onSuccess: (res: any) => {
      queryClient.setQueryData(cartKeys.all, (old: any) => ({
        ...old,
        ...res.data,
      }));
      toast.success(res?.message || t("updated"));
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err?.message || t("updateError"));
    }
  });
}

export function useApplyCouponMutation() {
  const queryClient = useQueryClient();
  const t = useTranslations("cart.messages");

  return useMutation({
    mutationFn: postApplyCoupon,
    onSuccess: (res: any) => {
      queryClient.setQueryData(cartKeys.all, (old: any) => ({
        ...old,
        ...res.data,
      }));
      toast.success(res?.message || t("couponApplied"));
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err?.message || t("couponInvalid"));
    }
  });
}
