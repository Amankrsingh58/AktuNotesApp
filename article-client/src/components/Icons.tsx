"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { HelpCircle } from "lucide-react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export default function Icon({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  strokeWidth = 2,
  ...props
}: IconProps) {
  // Access key of LucideIcons dynamically
  const IconComponent = (LucideIcons as any)?.[name];

  if (!IconComponent) {
    return (
      <HelpCircle
        size={size}
        color="gray"
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}
export { LucideIcons };
