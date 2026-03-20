"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// Filled + outline icon pairs
const HomeIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]">
    {filled ? (
      <path d="M3.5 10.5L12 3.5L20.5 10.5V20a.5.5 0 0 1-.5.5H15V15.5H9V20.5H4a.5.5 0 0 1-.5-.5V10.5Z"
        fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    ) : (
      <path d="M3.5 10.5L12 3.5L20.5 10.5V20a.5.5 0 0 1-.5.5H15V15.5H9V20.5H4a.5.5 0 0 1-.5-.5V10.5Z"
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    )}
  </svg>
);

const CommunityIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]">
    <path
      d="M12 3C7.03 3 3 6.58 3 11c0 2.1.93 4.02 2.46 5.46-.26 1.28-1 2.43-1.9 3.21 1.61.21 3.51-.23 4.94-1.33C9.6 18.76 10.77 19 12 19c4.97 0 9-3.58 9-8S16.97 3 12 3Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
    />
  </svg>
);

const ReportIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]">
    <path
      d="M9 3 7.17 5H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-3.17L15 3H9Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3.5"
      fill={filled ? "white" : "none"}
      stroke={filled ? "none" : "currentColor"} strokeWidth="1.5"
    />
  </svg>
);

const StoreIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]">
    <path d="M6 2 3 6v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V6L18 2H6Z"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"
    />
    <path d="M3 6h18" stroke={filled ? "rgba(255,255,255,0.35)" : "currentColor"} strokeWidth="1.5" />
    <path d="M16 10a4 4 0 0 1-8 0"
      stroke={filled ? "white" : "currentColor"} strokeWidth="1.8" strokeLinecap="round"
    />
  </svg>
);

const ProfileIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[22px] h-[22px]">
    {filled ? (
      <>
        <circle cx="12" cy="7.5" r="3.5" fill="currentColor" />
        <path
          d="M5 21c0-3.87 3.13-7 7-7s7 3.13 7 7H5Z"
          fill="currentColor"
        />
      </>
    ) : (
      <>
        <circle cx="12" cy="7.5" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M5 21c0-3.87 3.13-7 7-7s7 3.13 7 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </>
    )}
  </svg>
);

const tabs = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/community", label: "Community", Icon: CommunityIcon },
  { href: "/report", label: "Report", Icon: ReportIcon },
  { href: "/store", label: "Store", Icon: StoreIcon },
  { href: "/profile", label: "Profile", Icon: ProfileIcon },
] as const;

export default function BottomNav() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, ready: false });

  const activeIndex = tabs.findIndex(({ href }) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)
  );

  useEffect(() => {
    const nav = navRef.current;
    const item = itemRefs.current[activeIndex];
    if (!nav || !item) return;
    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    setPillStyle({ left: itemRect.left - navRect.left, width: itemRect.width, ready: true });
  }, [activeIndex]);

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        ref={navRef}
        className="relative w-full max-w-md rounded-[22px] border border-black/[0.06] bg-background/90 px-1.5 py-1.5 shadow-[0_4px_24px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:border-white/[0.06]"
      >
        {pillStyle.ready && (
          <div
            className="pointer-events-none absolute top-1.5 h-[calc(100%-12px)] rounded-2xl bg-white shadow-[0_1px_6px_rgba(0,0,0,0.10),0_0_0_0.5px_rgba(0,0,0,0.05)] transition-[left,width] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:bg-zinc-800"
            style={{ left: pillStyle.left, width: pillStyle.width }}
          />
        )}
        <ul className="flex items-center justify-between">
          {tabs.map(({ href, label, Icon }, i) => {
            const isActive = activeIndex === i;
            return (
              <li key={href} ref={(el) => { itemRefs.current[i] = el; }} className="flex-1">
                <Link
                  href={href}
                  className="relative flex flex-col items-center justify-center gap-[3px] rounded-2xl px-3 py-2 transition-transform duration-100 active:scale-90"
                >
                  <span className={cn(
                    "relative z-10 transition-all duration-200",
                    isActive ? "scale-110 -translate-y-px text-emerald-500" : "text-muted-foreground"
                  )}>
                    <Icon filled={isActive} />
                  </span>
                  <span className={cn(
                    "relative z-10 text-[10.5px] leading-none transition-colors duration-200",
                    isActive ? "font-semibold text-emerald-500" : "font-medium text-muted-foreground"
                  )}>
                    {label}
                  </span>
                  <span className={cn(
                    "absolute bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-emerald-500 transition-transform duration-200",
                    isActive ? "scale-100" : "scale-0"
                  )} />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}