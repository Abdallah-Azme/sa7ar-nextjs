import type { SVGProps } from "react";
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export default function TwoLinesIcon({ size = 16, ...props }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 31 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M2 13.25H28.25M2 2H28.25"
				stroke="currentColor"
				strokeWidth="4"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
