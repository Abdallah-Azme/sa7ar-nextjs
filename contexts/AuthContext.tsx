"use client";

import { createContext, useContext, useEffect, useState, useTransition } from "react";
import type { Profile } from "@/types";
import { loginAction, logoutAction } from "@/features/auth/actions";

interface AuthContextType {
	user: Profile | null;
	setUser: (user: Profile | null) => void;
	isLoading: boolean;
	isAuthenticated: boolean;
	logout: () => Promise<void>;
    login: (token: string, user: Profile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * AuthProvider - Client Component
 * Manages the global authentication state synced with server cookies
 */
export function AuthProvider({ 
    children, 
    initialUser 
}: { 
    children: React.ReactNode; 
    initialUser: Profile | null 
}) {
	const [user, setUser] = useState<Profile | null>(initialUser);
	const [isPending, startTransition] = useTransition();

    // Sync auth state if initialUser changes (e.g. from server page navigation)
    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    const login = async (token: string, userData: Profile) => {
        // Sync token to httpOnly cookie via server action
        await loginAction(token);
        setUser(userData);
    };

	const logout = async () => {
		startTransition(async () => {
			await logoutAction();
            setUser(null);
		});
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				setUser,
				isLoading: isPending,
				isAuthenticated: !!user,
				logout,
                login,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

/**
 * useAuth Hook for client components
 */
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
