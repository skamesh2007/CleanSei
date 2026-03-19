"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  Camera,
  ShoppingCart,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/community", label: "Community", icon: MessageCircle },
  { href: "/report", label: "Report", icon: Camera },
  { href: "/store", label: "Store", icon: ShoppingCart },
  { href: "/profile", label: "Profile", icon: User },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="w-full max-w-md rounded-2xl border bg-background shadow-lg px-2 py-1.5">
        <ul className="flex items-center justify-between">
          {tabs.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className="relative flex flex-col items-center justify-center rounded-xl px-3 py-2 transition-all duration-200 active:scale-95"
                >
                  {/* ACTIVE BACKGROUND */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-xl transition-all duration-200",
                      isActive
                        ? "bg-emerald-500/10"
                        : "opacity-0"
                    )}
                  />

                  {/* ICON */}
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.4 : 1.8}
                    className={cn(
                      "relative z-10 transition-all",
                      isActive
                        ? "text-emerald-500 scale-110"
                        : "text-muted-foreground"
                    )}
                  />

                  {/* LABEL */}
                  <span
                    className={cn(
                      "relative z-10 mt-1 text-[11px] font-semibold",
                      isActive
                        ? "text-emerald-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}