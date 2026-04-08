import { getGlobalSettings, getSocialLinks } from "@/features/settings/queries";
import AppStore from "@/components/icons/AppStore";
import GoogleStore from "@/components/icons/GoogleStore";
import { Button } from "@/components/ui/button";
import Logo from "../Logo";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

/**
 * Footer - RSC (Server Component)
 */
export default async function Footer() {
    const tFooter = await getTranslations("footer");
    const tNav = await getTranslations("nav");
    const tCommon = await getTranslations("common");

	const setting = await getGlobalSettings();
	const socialMediaLinks = getSocialLinks(setting);
	const year = new Date().getFullYear();

	const links = [
		{
			title: tFooter("titles.quickLinks"),
			items: [
				{ label: tNav("home"), link: "/" },
				{ label: tNav("products"), link: "/products" },
				{ label: tNav("about"), link: "/about" },
				{ label: tNav("blog"), link: "/blogs" },
			],
		},
		{
			title: tFooter("titles.help"),
			items: [
				{ label: tNav("faq"), link: "/faq" },
				{ label: tNav("contact"), link: "/contact" },
			],
		},
		{
			title: tFooter("titles.contact"),
			items: [
				{ label: setting?.email, link: `mailto:${setting?.email}` },
				{
					label: setting?.whatsapp,
					link: `https://wa.me/${setting?.whatsapp}`,
				},
			],
		},
	];

	if (!setting) return null;

	return (
		<footer className="container">
			<div className="grid grid-cols-1 gap-10 border-t border-b py-10 md:grid-cols-12 md:justify-items-center">
				{/* Brand column */}
				<div className="space-y-3 min-w-0 md:col-span-3">
					<Logo />

					<p className="font-light text-xl text-gray md:text-lg lg:text-xl wrap-break-word">
						{setting.footer_text}
					</p>

					<b className="block font-extrabold text-lg md:text-base lg:text-lg">
						{tFooter("followUs")}
					</b>

					<div className="flex flex-wrap items-center gap-2">
						{socialMediaLinks.map(
							(item) =>
								item.url && (
									<Link
										key={item.id}
										href={item.url}
										aria-label="Social Link"
										className="flex text-white *:size-5 hover:scale-110 transition-transform duration-300 items-center justify-center size-10 rounded-full bg-accent"
									>
										<item.Icon />
									</Link>
								),
						)}
					</div>
				</div>

				{/* Link columns */}
				{links.map((link, i) => (
					<div key={i} className="space-y-5 min-w-0 md:col-span-2">
						<div>
							<p className="font-medium text-xl md:text-lg lg:text-xl">
								{link.title}
							</p>
							<p className="bg-primary h-1 w-10 rounded-xl mt-2" />
						</div>

						<div className="gap-y-4 flex flex-col">
							{link.items.map((item, i) => (
								<Link
									key={i}
									href={item.link ?? "#"}
									className="text-gray font-light md:text-sm lg:text-base wrap-break-word"
								>
									{item.label}
								</Link>
							))}
						</div>
					</div>
				))}

				{/* Store download column */}
				<div className="flex flex-col items-center gap-5 min-w-0 md:col-span-3 md:items-end">
					<div>
						<p className="font-medium text-xl md:text-lg lg:text-xl">
							{tFooter("downloadNow")}
						</p>
						<p className="bg-primary h-1 w-10 rounded-xl mt-2" />
					</div>

					<p className="text-gray-500 text-sm text-end font-bold md:text-start md:text-xs lg:text-sm">
						{tFooter("storeLine")}
					</p>

					<div className="gap-y-5 flex flex-col">
						<Button
							variant={"secondary"}
							className="flex gap-2 w-full items-center rounded-[24px]"
							asChild
						>
							<a href={setting.google_play_link ?? "#"}>
								<div>
									<p className="text-[8px]">{tCommon("downloadOn")}</p>
									<b className="text-sm md:text-xs lg:text-sm">
										{tCommon("stores.google")}
									</b>
								</div>
								<GoogleStore />
							</a>
						</Button>
						<Button
							asChild
							className="flex w-full lg:w-46 gap-2 bg-black hover:bg-black/90 items-center rounded-[24px]"
						>
							<a href={setting.apple_store_link ?? "#"}>
								<div>
									<p className="text-[8px]">{tCommon("downloadOn")}</p>
									<b className="text-sm md:text-xs lg:text-sm">
										{tCommon("stores.apple")}
									</b>
								</div>
								<AppStore className="text-white" />
							</a>
						</Button>
					</div>
				</div>
			</div>

			{/* Copyright bar */}
			<div className="my-12 flex flex-col gap-4 text-center font-bold text-sm text-gray md:flex-row md:items-center md:justify-between md:text-start md:text-xs lg:text-sm">
				<span>
					{tFooter("copyright", { year })}
				</span>
				<span className="flex items-center justify-center gap-2 md:justify-end">
					<Link href="/terms">{tCommon("links.terms")}</Link>
					<span aria-hidden>·</span>
					<Link href="/privacy">{tCommon("links.privacy")}</Link>
				</span>
			</div>
		</footer>
	);
}
