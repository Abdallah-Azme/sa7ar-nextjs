import { UserRoundIcon, ListMinusIcon } from "lucide-react";
import BagIcon from "@/components/icons/BagIcon"; // Need to port this
import { TargetIcon } from "lucide-react";

export const accountLinks = [
	{
		name: "Profile", 
		to: "/account/details",
		Icon: UserRoundIcon,
	},
	{ name: "My Orders", to: "/account/orders", Icon: ListMinusIcon },
	{ name: "Shopping Cart", to: "/cart", Icon: BagIcon },
	{
		name: "Addresses",
		to: "/account/addresses",
		Icon: TargetIcon,
	},
];
