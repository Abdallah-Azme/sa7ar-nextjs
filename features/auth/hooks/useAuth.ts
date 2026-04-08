"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authKeys, postLogin, postRegister, postLogout, fetchProfile, postEditProfile, postDeleteAccount, type LoginPayload, type RegisterPayload } from "../services/authService";
import { useRouter } from "next/navigation";
import { loginAction, logoutAction } from "@/features/auth/actions";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await postLogin(payload);
      // Synchronize with server cookies
      await loginAction(res.data.token);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.profile(), data.user);
      setUser(data.user);
      toast.success("تم تسجيل الدخول بنجاح");
      router.push("/");
      router.refresh();
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err?.message || "خطأ في تسجيل الدخول");
    }
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useAuth();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const res = await postRegister(payload);
      await loginAction(res.data.token);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.profile(), data.user);
      setUser(data.user);
      toast.success("تم إنشاء الحساب بنجاح");
      router.push("/");
      router.refresh();
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err?.message || "خطأ في إنشاء الحساب");
    }
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout: contextLogout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      await postLogout();
      await logoutAction();
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      contextLogout();
      toast.success("تم تسجيل الخروج");
      router.push("/auth/login");
      router.refresh();
    }
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postEditProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      toast.success("تم تحديث الملف الشخصي بنجاح");
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err?.message || "حدث خطأ أثناء تحديث الملف الشخصي");
    }
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  const { logout: contextLogout } = useAuth();

  return useMutation({
    mutationFn: postDeleteAccount,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      contextLogout();
      toast.success("تم حذف الحساب بنجاح");
    },
    onError: (error: unknown) => {
        const err = error as { message?: string };
        toast.error(err?.message || "حدث خطأ أثناء حذف الحساب");
    }
  });
}
