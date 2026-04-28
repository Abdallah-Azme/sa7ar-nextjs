import apiClient from "@/lib/apiClient";
import type { Profile } from "@/types";

export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

export type LoginPayload = { mobile: string; password: string };
export type RegisterPayload = { name: string; mobile: string; password: string; password_confirmation: string };

export async function fetchProfile(): Promise<Profile | null> {
  try {
    const data = await apiClient<{ data: Profile }>({
      route: "/get-profile",
      tokenRequire: true,
    });
    return (data as unknown as { data: Profile }).data ?? null;
  } catch {
    return null;
  }
}

export async function postLogin(payload: LoginPayload) {
  return apiClient<{ data: { token: string; user: Profile } }>({
    route: "/login",
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function postRegister(payload: RegisterPayload) {
  return apiClient<{ data: { token: string; user: Profile } }>({
    route: "/signup",
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function postLogout() {
  return apiClient({
    route: "/logout",
    method: "POST",
    tokenRequire: true,
  });
}

export async function postEditProfile(formData: FormData) {
  return apiClient<{ message: string; data: { old_mobile: string; new_mobile: string } }>({
    route: "/edit-profile",
    method: "POST",
    body: formData,
    isFormData: true,
    tokenRequire: true,
  });
}

export async function postDeleteAccount() {
  return apiClient({
    route: "/delete-account",
    method: "POST",
    tokenRequire: true,
  });
}
