import { MapPin, Loader2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { LocationStatus } from "@/lib/report/types";

interface LocationBarProps {
  label: string;
  status: LocationStatus;
}

export function LocationBar({ label, status }: LocationBarProps) {
  const isPending = status.state === "pending";
  const isGranted = status.state === "granted";
  const isDenied = status.state === "denied" || status.state === "unavailable";

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={isGranted ? "secondary" : isDenied ? "destructive" : "outline"}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium"
      >
        {isPending && <Loader2 size={11} className="animate-spin" />}
        {isGranted && <MapPin size={11} />}
        {isDenied && <AlertTriangle size={11} />}
        <span>{label}</span>
      </Badge>
    </div>
  );
}