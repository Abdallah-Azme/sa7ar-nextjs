"use client";

import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
	Suspense,
	useEffect,
} from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/routing";
import AuthDialog from "@/components/dialogs/AuthDialog";

type DialogMode = "login" | "signup";

interface AuthDialogContextValue {
	openAuth: (mode?: DialogMode) => void;
}

const AuthDialogContext = createContext<AuthDialogContextValue | null>(null);

function AuthRequiredWatcher({ onOpen }: { onOpen: (mode: DialogMode) => void }) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (searchParams.get("auth_required") === "1") {
			setTimeout(() => {
				onOpen("login");
				router.replace(pathname, { scroll: false });
			}, 0);
		}
	}, [searchParams, pathname, router, onOpen]);

	return null;
}

export function AuthDialogProvider({ children }: { children: ReactNode }) {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<DialogMode>("login");

	const openAuth = useCallback((nextMode: DialogMode = "login") => {
		setMode(nextMode);
		setOpen(true);
	}, []);

	return (
		<AuthDialogContext.Provider value={{ openAuth }}>
			<Suspense fallback={null}>
				<AuthRequiredWatcher onOpen={openAuth} />
			</Suspense>
			{children}
			<AuthDialog open={open} onOpenChange={setOpen} mode={mode} />
		</AuthDialogContext.Provider>
	);
}

export function useAuthDialog() {
	const ctx = useContext(AuthDialogContext);
	if (!ctx) {
		throw new Error("useAuthDialog must be used within AuthDialogProvider");
	}
	return ctx;
}
