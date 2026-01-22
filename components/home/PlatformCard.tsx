"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PlatformCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  comingSoon?: boolean;
}

export function PlatformCard({
  title,
  description,
  icon,
  href,
  comingSoon = false,
}: PlatformCardProps) {
  const CardContent = (
    <div
      className={cn(
        "relative h-full rounded-xl border-2 bg-white p-8 shadow-md transition-all duration-300",
        "hover:shadow-xl hover:scale-105 hover:border-blue-400",
        "dark:bg-gray-900 dark:border-gray-700 dark:hover:border-blue-500",
        comingSoon && "opacity-75 cursor-not-allowed hover:scale-100"
      )}
    >
      {comingSoon && (
        <div className="absolute top-4 right-4">
          <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
            Coming Soon
          </span>
        </div>
      )}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="rounded-full bg-blue-100 p-6 dark:bg-blue-900">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );

  if (comingSoon) {
    return <div className="h-full">{CardContent}</div>;
  }

  return (
    <Link href={href} className="h-full block">
      {CardContent}
    </Link>
  );
}
