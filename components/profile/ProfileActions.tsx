import { Pencil, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onLogout: () => void;
  onEditProfile?: () => void;
};

export function ProfileActions({ onLogout, onEditProfile }: Props) {
  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500 pb-4">
      <Button
        onClick={onEditProfile}
        className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full py-3 text-base font-semibold transition-colors"
      >
        <Pencil size={20} />
        Edit Profile
      </Button>

      <Button
        variant="ghost"
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-950/60 text-red-500 dark:text-red-400 rounded-full py-3 text-base font-semibold transition-colors border border-red-100 dark:border-red-900/50"
      >
        <LogOut size={20} />
        Logout
      </Button>
    </div>
  );
}