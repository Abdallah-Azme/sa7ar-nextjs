/**
 * Global Loading Skeleton
 * Mirrors React's Loading.tsx (full-page centered spinner).
 * Next.js shows this while async RSC pages are loading.
 */
export default function Loading() {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="size-12 rounded-full border-4 border-accent border-t-transparent animate-spin" />
				<p className="text-sm text-gray font-medium">جارٍ التحميل...</p>
			</div>
		</div>
	);
}
