import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export default function ListLinesIcon({ size = 16, ...props }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 14 11"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M1 9.33333H7.66667M1 5.16667H12.6667M6 1H12.6667"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
