import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

export default function GoogleStore({ size = 16, ...props }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 18 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<mask
				id="mask0_359_1221"
				style={{ maskType: "alpha" }}
				maskUnits="userSpaceOnUse"
				x={0}
				y={0}
				width={18}
				height={20}
			>
				<path
					d="M17.2863 8.5503C18.2379 9.07395 18.2379 10.4261 17.2863 10.9497L2.0672 19.3244C1.14039 19.8344 0 19.1726 0 18.1247V1.3753C0 0.327427 1.14039 -0.334388 2.0672 0.175612L17.2863 8.5503Z"
					fill="#C4C4C4"
				/>
			</mask>
			<g mask="url(#mask0_359_1221)">
				<path
					d="M0.476047 19.1599L9.96922 9.61342L0.632393 0.224121C0.259898 0.462906 0 0.875174 0 1.37542V18.1248C0 18.5516 0.189172 18.9143 0.476047 19.1599Z"
					fill="url(#paint0_linear_359_1221)"
				/>
				<path
					d="M17.286 8.55024C18.2377 9.07389 18.2377 10.4259 17.286 10.9496L13.4465 13.0624L9.96899 9.61314L13.2692 6.33984L17.286 8.55024Z"
					fill="url(#paint1_linear_359_1221)"
				/>
				<path
					d="M13.4469 13.0626L9.9693 9.6134L0.476074 19.1599C0.893539 19.5174 1.51791 19.6268 2.06726 19.3245L13.4469 13.0626Z"
					fill="url(#paint2_linear_359_1221)"
				/>
				<path
					d="M0.63208 0.223988L9.96893 9.61328L13.2692 6.33998L2.06687 0.175613C1.58252 -0.0909148 1.03985 -0.0374023 0.63208 0.223988Z"
					fill="url(#paint3_linear_359_1221)"
				/>
			</g>
			<defs>
				<linearGradient
					id="paint0_linear_359_1221"
					x1="6.50768"
					y1="5.9055"
					x2="0.0532949"
					y2="12.4129"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#00C3FF" />
					<stop offset={1} stopColor="#1BE2FA" />
				</linearGradient>
				<linearGradient
					id="paint1_linear_359_1221"
					x1="9.96899"
					y1="9.61322"
					x2="18.5536"
					y2="9.61322"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#FFCE00" />
					<stop offset={1} stopColor="#FFEA00" />
				</linearGradient>
				<linearGradient
					id="paint2_linear_359_1221"
					x1="0.276987"
					y1="20.3253"
					x2="11.6962"
					y2="11.1703"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#DE2453" />
					<stop offset={1} stopColor="#FE3944" />
				</linearGradient>
				<linearGradient
					id="paint3_linear_359_1221"
					x1="0.83044"
					y1="-0.823973"
					x2="11.6978"
					y2="8.05237"
					gradientUnits="userSpaceOnUse"
				>
					<stop stopColor="#11D574" />
					<stop offset={1} stopColor="#01F176" />
				</linearGradient>
			</defs>
		</svg>
	);
}
