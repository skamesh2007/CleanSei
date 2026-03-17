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

// ─── Tab config — mirrors Expo Router <Tabs.Screen> definitions ───────────────

const tabs = [
  {
    href:  "/",
    label: "Home",
    icon:  Home,
  },
  {
    href:  "/community",
    label: "Community",
    icon:  MessageCircle,
  },
  {
    href:  "/report",
    label: "Report",
    icon:  Camera,
  },
  {
    href:  "/store",
    label: "Store",
    icon:  ShoppingCart,
  },
  {
    href:  "/profile",
    label: "Profile",
    icon:  User,
  },
] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function BottomNav() {
  const pathname = usePathname();

  return (
    // Mirrors tabBarStyle: fixed bottom bar, rounded top corners, white bg, border
    <nav
      className={[
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-white dark:bg-card",
        "border-t border-gray-200 dark:border-border",
        "rounded-tl-2xl rounded-tr-2xl",
        "shadow-[0_-2px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_16px_rgba(0,0,0,0.3)]",
        // height: 76, paddingBottom: 16, paddingTop: 8, paddingHorizontal: 12
        "h-[76px] px-3",
      ].join(" ")}
    >
      <ul className="flex items-start justify-around h-full pt-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={[
                  // tabBarItemStyle: marginHorizontal: 4, borderRadius: 12
                  "mx-1 rounded-xl",
                  "flex flex-col items-center justify-center gap-0.5",
                  "py-1.5 transition-all duration-150",
                  // Active bg tint (subtle, matches mobile feel)
                  isActive
                    ? "text-[#00A86B]"
                    : "text-gray-500 dark:text-muted-foreground hover:text-gray-700 dark:hover:text-foreground",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                {/* Icon — focused: 26px + scale-110, unfocused: 24px */}
                <span
                  className={[
                    "transition-transform duration-150",
                    isActive ? "scale-110" : "scale-100",
                  ].join(" ")}
                >
                  <Icon
                    size={isActive ? 26 : 24}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    // Fill the icon when active to mimic Ionicons filled variant
                    fill={isActive ? "currentColor" : "none"}
                  />
                </span>

                {/* Label — tabBarLabelStyle: fontSize 11, fontWeight 600, marginBottom 4 */}
                <span
                  className={[
                    "text-[11px] font-semibold leading-none mb-1 transition-colors",
                    isActive
                      ? "text-[#00A86B]"
                      : "text-gray-500 dark:text-muted-foreground",
                  ].join(" ")}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}