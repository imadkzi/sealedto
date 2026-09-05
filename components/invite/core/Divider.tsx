"use client";

import { Separator, type SeparatorVariant } from "../decor";

interface Props {
  variant?: SeparatorVariant;
  width?: number;
  className?: string;
  align?: "center" | "left";
}

export function Divider({ variant = "diamond", width, className, align }: Props) {
  return (
    <Separator
      variant={variant}
      width={width}
      className={className}
      align={align}
    />
  );
}
