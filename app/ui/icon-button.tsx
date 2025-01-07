"use client";

import Link from "next/link";
import { cn } from "@/app/lib/utils";

export default function IconButton({
  text,
  icon,
  size = 5,
  className,
  href,
  onClick,
}: {
  text?: string;
  icon?: any; // eslint-disable-line
  size?: number;
  className?: string;
  href?: string;
  onClick?: any; // eslint-disable-line
}) {
  const IconComponent = icon;
  if (href) {
    return (
      <Link
        href={href}
        className={cn(`flex gap-1 items-center rounded-md ${className}`)}
      >
        {icon && <IconComponent className={`size-${size}`} />}
        {text}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={cn(`flex gap-1 items-center rounded-md ${className}`)}
      >
        {icon && <IconComponent className={`size-${size}`} />}
        {text}
      </button>
    );
  }
  return (
    <div className={cn(`flex gap-1 items-center rounded-md ${className}`)}>
      {icon && <IconComponent className={`size-${size}`} />}
      {text}
    </div>
  );
}
