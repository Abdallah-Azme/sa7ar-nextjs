"use client";

import { cloneElement, isValidElement } from "react";
import type { MouseEvent, MouseEventHandler, ReactElement } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type AuthClickableChildProps = {
	onClick?: MouseEventHandler<HTMLElement>;
	title?: string;
};

type AuthActionWrapperProps = {
	children: ReactElement<AuthClickableChildProps>;
};

/**
 * AuthActionWrapper - Client Component
 * Mirrors React's AuthActionWrapper:
 * If user is NOT authenticated, intercepts clicks and shows an error toast.
 * If authenticated, renders the child as-is (no interception).
 */
export default function AuthActionWrapper({
	children,
}: AuthActionWrapperProps) {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated || !isValidElement(children)) {
		return children;
	}

	const onUnauthorizedClick = (event: MouseEvent<HTMLElement>) => {
		event.preventDefault();
		event.stopPropagation();
		toast.error("يجب تسجيل الدخول أولاً للوصول إلى هذه الميزة");
	};

	return cloneElement(children as ReactElement<AuthClickableChildProps>, {
		onClick: onUnauthorizedClick,
		title: "يجب تسجيل الدخول أولاً",
	});
}
