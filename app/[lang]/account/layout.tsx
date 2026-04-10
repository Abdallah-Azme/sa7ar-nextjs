"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { ChevronLeftIcon, PanelLeftIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import GoogleStore from "@/components/icons/GoogleStore";
import AppStore from "@/components/icons/AppStore";
import CrownIcon from "@/components/icons/CrownIcon";
import DeviceIcon from "@/components/icons/DeviceIcon";
import UserRoundIcon from "@/components/icons/SocialIcons"; // Wait, I need to check UserRoundIcon
import ListLinesIcon from "@/components/icons/ListLinesIcon";
import BagIcon from "@/components/icons/BagIcon";
import TargetIcon from "@/components/icons/TargetIcon";
import { useProfile } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";
import { UserRound } from "lucide-react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const tSidebar = useTranslations("accountSidebar");
    const tCommon = useTranslations("common");
    const tAccount = useTranslations("account");
    const pathname = usePathname();
    const { data: userRaw, isLoading } = useProfile();
    const user = userRaw as any;

    const accountLinks = [
        {
            name: "links.profile",
            to: "/account/details",
            Icon: UserRound,
        },
        {
            name: "links.orders",
            to: "/account/orders",
            Icon: ListLinesIcon,
        },
        {
            name: "links.cart",
            to: "/cart",
            Icon: BagIcon,
        },
        {
            name: "links.addresses",
            to: "/account/addresses",
            Icon: TargetIcon,
        },
    ];

    return (
        <div className="bg-background-cu/20 pb-20 pt-10">
            <div className="container relative flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className={cn(
                    "transition-all duration-500 ease-in-out h-fit",
                    sidebarOpen ? "w-full md:w-[320px] lg:w-[380px] opacity-100" : "w-0 overflow-hidden opacity-0 invisible -ml-8"
                )}>
                    <div className="space-y-8">
                        {/* Links Box */}
                        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-black/5">
                            <h2 className="font-bold text-lg xl:text-xl text-primary mb-8 px-2">
                                {tSidebar("title")}
                            </h2>
                            <div className="flex flex-col gap-6">
                                {accountLinks.map((item) => {
                                    const isActive = pathname === item.to;
                                    return (
                                        <Link
                                            key={item.to}
                                            href={item.to}
                                            className={cn(
                                                "flex text-sm lg:text-base justify-between items-center gap-2 hover:text-accent transition-all group",
                                                isActive ? "text-accent font-bold" : "text-primary font-bold"
                                            )}
                                        >
                                            <div className="flex items-center">
                                                <item.Icon size={20} className={cn("inline-block me-3 transition-colors", isActive ? "text-accent" : "text-gray-400 group-hover:text-accent")} />
                                                <span>{tAccount(item.name)}</span>
                                            </div>
                                            <ChevronLeftIcon size={18} className={cn("transition-transform group-hover:translate-x-[-4px] rtl:group-hover:translate-x-[4px]", isActive ? "text-accent" : "text-gray-300")} />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Points & App Box */}
                        <div className="bg-white rounded-[40px] p-8 space-y-8 shadow-sm border border-black/5">
                            <div className="space-y-4">
                                <div className="flex gap-2.5 items-center">
                                    <CrownIcon size={22} className="text-[#D4AF37]" />
                                    <h2 className="font-bold text-lg xl:text-xl text-primary">
                                        {tSidebar("subscriptionSummary")}
                                    </h2>
                                </div>
                                <div className="rounded-3xl border border-gray-100 p-6 space-y-2 bg-gray-50/50">
                                    {isLoading ? (
                                        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-lg" />
                                    ) : (
                                        <p className="font-black text-2xl text-accent">
                                            {(user?.points || 0).toFixed(0)} <span className="text-sm ms-1 font-bold">{tAccount("points.label")}</span>
                                        </p>
                                    )}
                                    <p className="text-sm text-gray leading-6">
                                        {tSidebar("pointsUsageHint")}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex gap-2.5 items-center">
                                    <DeviceIcon size={22} className="text-primary" />
                                    <h2 className="font-bold text-lg xl:text-xl text-primary">
                                        {tSidebar("downloadApp")}
                                    </h2>
                                </div>
                                <div className="grid xl:grid-cols-2 gap-3">
                                    <Button
                                        variant="secondary"
                                        className="flex gap-2 w-full items-center h-14 rounded-[24px] bg-[#F3F4F6] hover:bg-gray-200 border-none justify-center px-4"
                                        asChild
                                    >
                                        <a href="#" target="_blank">
                                            <div className="text-start">
                                                <p className="text-[8px] uppercase font-bold text-gray-500 leading-tight">{tCommon("downloadOn")}</p>
                                                <b className="text-sm text-primary font-black uppercase">{tCommon("stores.google")}</b>
                                            </div>
                                            <GoogleStore className="size-5" />
                                        </a>
                                    </Button>
                                    <Button
                                        className="flex gap-2 w-full bg-black hover:bg-black/90 items-center h-14 rounded-[24px] justify-center px-4"
                                        asChild
                                    >
                                        <a href="#" target="_blank">
                                            <div className="text-start">
                                                <p className="text-[8px] uppercase font-bold text-gray-400 leading-tight">{tCommon("downloadOn")}</p>
                                                <b className="text-sm text-white font-black uppercase">{tCommon("stores.apple")}</b>
                                            </div>
                                            <AppStore className="size-5 text-white fill-white" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <section className="flex-1 w-full bg-white md:bg-background-cu p-6 sm:p-8 2xl:p-10 rounded-[40px] shadow-sm md:shadow-none border md:border-none border-black/5 min-h-[600px]">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="mb-8 p-3 hover:bg-white md:hover:bg-background-cu/50 rounded-2xl transition-all cursor-pointer text-primary shadow-sm bg-white"
                        title="Toggle Sidebar"
                    >
                        <PanelLeftIcon size={18} />
                    </button>
                    <div className="max-w-none">
                        {children}
                    </div>
                </section>
            </div>
        </div>
    );
}
