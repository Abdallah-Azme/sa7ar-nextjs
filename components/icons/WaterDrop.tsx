import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export default function WaterDrop({ size = 16, ...props }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 13 17"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M9.25008 9.5386C9.25008 10.4566 8.8945 11.3371 8.26158 11.9862C7.90225 12.3548 7.47018 12.6318 7 12.8023M11.5 9.76922C11.5 4.83653 6.25 1 6.25 1C6.25 1 1 4.83653 1 9.76922C1 11.2228 1.55313 12.617 2.53769 13.6449C3.52226 14.6727 4.8577 15.2495 6.25008 15.2495C7.64245 15.2495 8.97775 14.6723 9.96228 13.6445C10.9469 12.6167 11.5 11.2228 11.5 9.76922Z"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
