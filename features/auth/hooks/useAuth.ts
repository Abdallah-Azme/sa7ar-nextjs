"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authKeys, postLogin, postRegister, postLogout, fetchProfile, postEditProfile, postDeleteAccount, type LoginPayload, type RegisterPayload } from "../services/authService";
import { useRouter } from "@/i18n/routing";
import { loginAction, logoutAction } from "@/features/auth/actions";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

import { useTranslations } from "next-intl";

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
  const t = useTranslations("auth");

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
      toast.success(t("messages.loginSuccess"));
      router.push("/");
      router.refresh();
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err?.message || t("errors.errorLoggingIn"));
    }
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser } = useAuth();
  const t = useTranslations("auth");

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const res = await postRegister(payload);
      await loginAction(res.data.token);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.profile(), data.user);
      setUser(data.user);
      toast.success(t("messages.signupSuccess"));
      router.push("/");
      router.refresh();
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err?.message || t("errors.errorSigningUp"));
    }
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout: contextLogout } = useAuth();
  const t = useTranslations("auth.messages");

  return useMutation({
    mutationFn: async () => {
      await postLogout();
      await logoutAction();
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      contextLogout();
      toast.success(t("logoutSuccess"));
      router.push("/");
      router.refresh();
    }
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postEditProfile,
    /** ProfileForm shows API message; skip global MutationCache error toast too */
    meta: { skipGlobalMutationError: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
  });
}

export function useDeleteAccountMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { logout: contextLogout } = useAuth();
  const t = useTranslations("auth");

  return useMutation({
    mutationFn: postDeleteAccount,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: authKeys.all });
      contextLogout();
      toast.success(t("messages.accountDeleted"));
      router.push("/");
      router.refresh();
    },
    onError: (error: unknown) => {
        const err = error as { message?: string };
        toast.error(err?.message || t("errors.errorDeletingAccount"));
    }
  });
}
