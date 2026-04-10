import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * SectionLabel - RSC (Server Component)
 * simple visual label used for section titles
 */
export default function SectionLabel({
  text,
  Icon,
  center = false,
  white = false,
}: {
  text: string;
  Icon?: ReactNode;
  center?: boolean;
  white?: boolean;
}) {
  return (
    <div
      className={cn(
        "bg-accent/10 font-bold w-fit text-sm text-accent p-2.5 rounded-4xl flex gap-1 items-center",
        center && "mx-auto",
        white && "bg-white",
      )}
    >
      {Icon && <div aria-hidden="true">{Icon}</div>}
      <span className="text-nowrap">{text}</span>
    </div>
  );
}
