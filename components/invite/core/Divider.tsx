"use client";

import { Separator, type SeparatorVariant } from "../decor";

interface Props {
  variant?: SeparatorVariant;
  width?: number;
  className?: string;
}

export function Divider({ variant = "diamond", width, className }: Props) {
  return <Separator variant={variant} width={width} className={className} />;
}
