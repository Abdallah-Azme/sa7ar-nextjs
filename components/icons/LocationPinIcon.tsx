import type { SVGProps } from "react";
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export default function LocationPinIcon({ size = 16, ...props }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 14 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M13.125 5.025C12.3375 1.56 9.31501 0 6.66001 0C6.66001 0 6.66001 0 6.65251 0C4.00498 0 0.974984 1.5525 0.187484 5.0175C-0.690016 8.8875 1.67998 12.165 3.82498 14.2275C4.61998 14.9925 5.64001 15.375 6.66001 15.375C7.68001 15.375 8.70001 14.9925 9.48751 14.2275C11.6325 12.165 14.0025 8.895 13.125 5.025ZM6.66001 8.7825C5.35501 8.7825 4.29748 7.725 4.29748 6.42C4.29748 5.115 5.35501 4.0575 6.66001 4.0575C7.96501 4.0575 9.02251 5.115 9.02251 6.42C9.02251 7.725 7.96501 8.7825 6.66001 8.7825Z"
				fill="currentColor"
			/>
		</svg>
	);
}
