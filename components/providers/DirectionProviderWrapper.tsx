"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import { ReactNode } from "react";

export default function DirectionProviderWrapper({ 
  children, 
  dir 
}: { 
  children: ReactNode; 
  dir: "ltr" | "rtl"; 
}) {
  return <DirectionProvider dir={dir}>{children}</DirectionProvider>;
}
