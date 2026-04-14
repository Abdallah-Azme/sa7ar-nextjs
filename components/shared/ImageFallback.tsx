"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageFallbackProps {
	src?: string | null;
	alt?: string;
	width?: number;
	height?: number;
	className?: string;
	fill?: boolean;
	priority?: boolean;
	fetchPriority?: "high" | "low" | "auto";
	sizes?: string;
}

const FALLBACK_SRC = "/images/logo.svg";

function normalizeImageSrc(src?: string | null): string {
	if (!src || src.trim() === "") return FALLBACK_SRC;
	const value = src.trim();
	// Keep remote, data URI, and root-absolute paths untouched
	if (
		value.startsWith("http://") ||
		value.startsWith("https://") ||
		value.startsWith("data:") ||
		value.startsWith("/")
	) {
		return value;
	}
	// Convert relative asset paths (e.g. images/logo.svg) to root-absolute
	return `/${value}`;
}

/**
 * ImageFallback - Client Component
 * Uses next/image for optimization with automatic fallback to logo on error.
 * Matches React's ImageFallback behavior.
 */
export default function ImageFallback({
	src,
	alt = "Image",
	width,
	height,
	className,
	fill = false,
	priority = false,
	fetchPriority,
	sizes,
}: ImageFallbackProps) {
	const [imgSrc, setImgSrc] = useState<string>(normalizeImageSrc(src));

	useEffect(() => {
		setImgSrc(normalizeImageSrc(src));
	}, [src]);

	const handleError = () => setImgSrc(FALLBACK_SRC);

	// Use fill mode when no explicit dimensions
	if (fill || (!width && !height)) {
		return (
			<Image
				src={imgSrc}
				alt={alt}
				fill
				sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
				className={className}
				onError={handleError}
				priority={priority}
				fetchPriority={fetchPriority}
				unoptimized={imgSrc.endsWith(".svg") || imgSrc.endsWith(".gif")}
			/>
		);
	}

	return (
		<Image
			src={imgSrc}
			alt={alt}
			width={width ?? 400}
			height={height ?? 300}
			sizes={sizes}
			className={className}
			onError={handleError}
			priority={priority}
			fetchPriority={fetchPriority}
			unoptimized={imgSrc.endsWith(".svg") || imgSrc.endsWith(".gif")}
		/>
	);
}
