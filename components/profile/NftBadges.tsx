import { ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function NftBadges() {
  return (
    <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-foreground mb-3">
        🖼️ NFT Badges{" "}
        <span className="text-xs font-normal text-gray-400 dark:text-muted-foreground ml-1">
          (Coming Soon)
        </span>
      </h2>
      <Card className="rounded-2xl border border-dashed border-gray-300 dark:border-border bg-white dark:bg-card opacity-60">
        <CardContent className="p-5 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-muted flex items-center justify-center">
            <ImageIcon size={24} className="text-gray-400 dark:text-muted-foreground" />
          </div>
          <p className="text-base text-gray-500 dark:text-muted-foreground text-center">
            Collect unique digital badges for your contributions!
          </p>
        </CardContent>
      </Card>
    </section>
  );
}