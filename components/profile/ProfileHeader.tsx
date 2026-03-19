import { Settings } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function ProfileHeader() {
  return (
    <div className="bg-white dark:bg-card px-6 pt-8 pb-5 shadow-sm sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-foreground">
          Profile
        </h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            aria-label="Settings"
            className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
          >
            <Settings size={20} className="text-blue-700 dark:text-blue-400" />
          </button>
        </div>
      </div>
    </div>
  );
}