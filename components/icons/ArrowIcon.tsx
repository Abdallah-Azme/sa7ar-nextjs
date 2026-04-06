import type { SVGProps } from "react";
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export default function ArrowIcon({
	size = 16,
	...props
}: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 15 13"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M1.16504 6.16504H13.165M13.165 6.16504L8.16504 11.165M13.165 6.16504L8.16504 1.16504"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
