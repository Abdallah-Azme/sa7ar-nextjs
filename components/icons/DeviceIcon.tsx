import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export default function DeviceIcon({ size = 16, ...props }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 12 17"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M11.255 12.375V4.125C11.3021 3.28024 11.0132 2.45115 10.451 1.81879C9.88892 1.18643 9.09947 0.802185 8.25497 0.75H3.75498C2.91053 0.802185 2.12103 1.18643 1.55894 1.81879C0.996834 2.45115 0.707799 3.28024 0.754989 4.125V12.375C0.707799 13.2197 0.996834 14.0488 1.55894 14.6811C2.12103 15.3135 2.91053 15.6977 3.75498 15.7499H8.25497C9.09947 15.6977 9.88892 15.3135 10.451 14.6811C11.0132 14.0488 11.3021 13.2197 11.255 12.375Z"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M7.50586 3H4.50586"
				stroke="currentColor"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
