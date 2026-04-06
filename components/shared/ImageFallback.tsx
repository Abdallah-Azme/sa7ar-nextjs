"use client";

import { useState, type ImgHTMLAttributes } from "react";

export default function ImageFallback({
	...props
}: ImgHTMLAttributes<HTMLImageElement>) {
	const [url, setUrl] = useState(props.src ?? "/images/logo.svg");

	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			{...props}
			loading="lazy"
			src={url}
			alt={props.alt ?? "Fallback image"}
			onError={() => setUrl("/images/logo.svg")}
		/>
	);
}
