import { CheckCircle2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SuccessViewProps {
  pointsEarned: number;
  onReset: () => void;
}

export function SuccessView({ pointsEarned, onReset }: SuccessViewProps) {
  return (
    <Card className="border-green-500/30 bg-green-500/5">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15">
          <CheckCircle2 className="text-green-500" size={34} strokeWidth={1.5} />
        </div>

        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Report Submitted</h2>
          <p className="text-sm text-muted-foreground">
            Thanks for helping keep the environment clean.
          </p>
        </div>

        <Separator className="w-1/2 opacity-50" />

        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
          <Sparkles size={16} />
          <span className="text-2xl font-bold tabular-nums">+{pointsEarned}</span>
          <span className="text-sm font-medium">points earned</span>
        </div>

        <Button
          onClick={onReset}
          variant="outline"
          className="mt-2 gap-2"
        >
          <RefreshCw size={14} />
          Report Another
        </Button>
      </CardContent>
    </Card>
  );
}