"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { Moon, Pencil, LogOut } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditProfile?: () => void;
  onLogout: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function SettingsSheet({
  open,
  onOpenChange,
  onEditProfile,
  onLogout,
}: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-0 pb-10"
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-gray-200 dark:bg-muted rounded-full mx-auto mb-4" />

        <SheetHeader className="px-5 pb-4 border-b border-gray-100 dark:border-border">
          <SheetTitle className="text-base text-left">Settings</SheetTitle>
        </SheetHeader>

        <div className="mt-2 px-3 space-y-0.5">

          {/* ── Dark mode ── */}
          <div className="flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-muted/60 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
              <Moon size={15} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div className="flex-1">
              <Label
                htmlFor="dark-mode-toggle"
                className="text-sm font-medium text-gray-800 dark:text-foreground cursor-pointer"
              >
                Dark mode
              </Label>
              <p className="text-[11px] text-gray-400 dark:text-muted-foreground mt-0.5">
                {isDark ? "Currently dark" : "Currently light"}
              </p>
            </div>
            <Switch
              id="dark-mode-toggle"
              checked={isDark}
              onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
            />
          </div>

          {/* ── Edit profile ── */}
          <button
            onClick={() => {
              onOpenChange(false);
              onEditProfile?.();
            }}
            className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-gray-50 dark:hover:bg-muted/60 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <Pencil size={15} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800 dark:text-foreground">
                Edit profile
              </p>
              <p className="text-[11px] text-gray-400 dark:text-muted-foreground mt-0.5">
                Update your name and photo
              </p>
            </div>
          </button>

          <Separator className="my-1 mx-1" />

          {/* ── Logout with confirmation ── */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center gap-3 px-3 py-3.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left group">
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center flex-shrink-0">
                  <LogOut size={15} className="text-red-500 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-500 dark:text-red-400">
                    Sign out
                  </p>
                  <p className="text-[11px] text-red-300 dark:text-red-500 mt-0.5">
                    You can always sign back in
                  </p>
                </div>
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Sign out?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your progress and points are saved. You can sign back in any time.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    onOpenChange(false);
                    onLogout();
                  }}
                  className="rounded-xl bg-red-500 hover:bg-red-600 text-white"
                >
                  Sign out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </SheetContent>
    </Sheet>
  );
}
