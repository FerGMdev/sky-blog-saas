"use client";

import { navLinks } from "@/app/dashboard/layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function DashboardItems() {
  const pathname = usePathname();
  return (
    <div>
      {navLinks.map((link) => (
        <Link
          href={link.href}
          key={link.label}
          className={cn(
            pathname === link.href
              ? "bg-muted text-primary"
              : "text-muted-foreground bg-none",
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary/70"
          )}
        >
          <link.icon className="size-4" />
          {link.label}
        </Link>
      ))}
    </div>
  );
}
