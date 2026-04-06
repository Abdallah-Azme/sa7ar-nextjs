import Link from "next/link";
import ImageFallback from "./ImageFallback";
import { getGlobalSettings } from "@/features/settings/queries";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Logo - RSC (Server Component)
 * Fetches settings directly from server
 */
export default async function Logo() {
	const setting = await getGlobalSettings();

	if (!setting)
		return <Skeleton className="w-30 h-25 rounded-md bg-gray/30" />;

	return (
		<Link href="/">
			<ImageFallback
				src={setting.app_logo}
				width={120}
				height={100}
				alt="شعار سحر"
				className="max-w-30 shrink-0 max-h-25"
			/>
		</Link>
	);
}
