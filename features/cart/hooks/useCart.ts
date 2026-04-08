"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartKeys, fetchCart, postAddToCart, postUpdateCart, postApplyCoupon } from "../services/cartService";
import { toast } from "sonner";

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

  return useMutation({
    mutationFn: postAddToCart,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      toast.success(res?.message || "تمت الإضافة للسلة");
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err?.message || "خطأ في الإضافة");
    }
  });
}

export function useUpdateCartMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postUpdateCart,
    onSuccess: (res: any) => {
      queryClient.setQueryData(cartKeys.all, (old: any) => ({
        ...old,
        ...res.data,
      }));
      toast.success("تم تحديث السلة");
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err?.message || "خطأ في التحديث");
    }
  });
}

export function useApplyCouponMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postApplyCoupon,
    onSuccess: (res: any) => {
      queryClient.setQueryData(cartKeys.all, (old: any) => ({
        ...old,
        ...res.data,
      }));
      toast.success("تم تطبيق الكوبون");
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err?.message || "الكوبون غير صالح");
    }
  });
}
