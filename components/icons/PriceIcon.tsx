import type { SVGProps } from "react";
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export default function PriceIcon({ size = 15, ...props }: IconProps) {
	return (
		<svg
			width={size}
			height={(8 / 15) * size}
			viewBox="0 0 15 8"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<g clipPath="url(#clip0_373_4769)">
				<path
					d="M1.52311 5.44287L2.38199 3.9392L5.31825 3.93248C5.28894 2.87797 5.69668 1.5908 6.41125 0.781299C7.28196 -0.20492 8.57958 0.279472 9.44654 0.998885C9.55589 1.08952 9.87532 1.36595 9.87081 1.488L9.29096 3.63007C8.6057 2.89341 7.72578 2.07773 6.60103 2.25936C6.38927 2.2935 6.10347 2.4882 5.99449 2.66547C5.72336 3.10591 6.28555 3.64043 6.5905 3.9323H14.8163L13.95 5.44268H8.12618C8.3759 5.64901 8.7299 5.8399 9.03335 5.9683C9.19231 6.03551 9.79997 6.26254 9.93432 6.26254H13.4797L12.6135 7.77292H0.183594L1.05412 6.26254H6.52342L5.89829 5.4425H1.52311V5.44287Z"
					fill="currentColor"
				/>
			</g>
			<defs>
				<clipPath id="clip0_373_4769">
					<rect width="15" height="8" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}
