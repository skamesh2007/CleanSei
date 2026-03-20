import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface IdlePromptProps {
  onStart: () => void;
  error: string | null;
}

export function IdlePrompt({ onStart, error }: IdlePromptProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="items-center pb-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mb-2">
          <Camera className="text-primary" size={26} />
        </div>
        <CardTitle className="text-base">Capture Waste</CardTitle>
        <CardDescription className="text-sm">
          Take a photo of the waste to log your report
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-3 pt-0">
        {error && (
          <Alert variant="destructive" className="text-sm">
            <AlertCircle size={14} />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={onStart} className="w-full" size="lg">
          <Camera size={16} className="mr-2" />
          Open Camera
        </Button>
      </CardContent>
    </Card>
  );
}