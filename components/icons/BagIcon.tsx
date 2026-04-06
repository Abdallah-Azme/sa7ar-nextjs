import type { SVGProps } from "react";
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export default function BagIcon({ size = 16, ...props }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 15 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M9.91667 7.41667C9.91667 8.79742 8.79742 9.91667 7.41667 9.91667C6.03592 9.91667 4.91667 8.79742 4.91667 7.41667M14.0833 4.08333L12.4167 0.75H2.41667L0.75 4.08333M14.0833 4.08333H0.75M14.0833 4.08333V13.25C14.0833 14.1705 13.3372 14.9167 12.4167 14.9167H2.41667C1.49619 14.9167 0.75 14.1705 0.75 13.25V4.08333"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
