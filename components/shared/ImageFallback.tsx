"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageFallbackProps {
	src?: string | null;
	alt?: string;
	width?: number;
	height?: number;
	className?: string;
	fill?: boolean;
	priority?: boolean;
}

const FALLBACK_SRC = "/images/logo.svg";

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
}: ImageFallbackProps) {
	const [imgSrc, setImgSrc] = useState<string>(
		src && src.trim() !== "" ? src : FALLBACK_SRC,
	);

	const handleError = () => setImgSrc(FALLBACK_SRC);

	// Use fill mode when no explicit dimensions
	if (fill || (!width && !height)) {
		return (
			<Image
				src={imgSrc}
				alt={alt}
				fill
				className={className}
				onError={handleError}
				priority={priority}
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
			className={className}
			onError={handleError}
			priority={priority}
			unoptimized={imgSrc.endsWith(".svg") || imgSrc.endsWith(".gif")}
		/>
	);
}
