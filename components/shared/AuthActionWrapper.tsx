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

import { useTranslations } from "next-intl";

export default function AuthActionWrapper({
	children,
}: AuthActionWrapperProps) {
	const t = useTranslations("auth.errors");
	const { isAuthenticated } = useAuth();

	if (isAuthenticated || !isValidElement(children)) {
		return children;
	}

	const onUnauthorizedClick = (event: MouseEvent<HTMLElement>) => {
		event.preventDefault();
		event.stopPropagation();
		toast.error(t("unauthenticated"));
	};

	return cloneElement(children as ReactElement<AuthClickableChildProps>, {
		onClick: onUnauthorizedClick,
		title: t("unauthenticated"),
	});
}
