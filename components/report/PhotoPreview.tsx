import { Loader2, RotateCcw, Send, MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { WASTE_TYPES, type WasteType } from "@/lib/report/types";
import type { PhotoData } from "@/lib/report/types";

interface PhotoPreviewProps {
  photo: PhotoData;
  note: string;
  selectedType: WasteType | null;
  loading: boolean;
  onNoteChange: (note: string) => void;
  onTypeSelect: (type: WasteType) => void;
  onRetake: () => void;
  onSubmit: () => void;
}

export function PhotoPreview({
  photo,
  note,
  selectedType,
  loading,
  onNoteChange,
  onTypeSelect,
  onRetake,
  onSubmit,
}: PhotoPreviewProps) {
  return (
    <div className="space-y-4">
      {/* Photo */}
      <div className="relative overflow-hidden rounded-xl border bg-muted">
        <img
          src={photo.uri}
          alt="Captured waste"
          className="w-full object-cover max-h-64"
        />
        {photo.timestamp && (
          <Badge
            variant="secondary"
            className="absolute bottom-2 right-2 text-xs backdrop-blur-sm bg-background/70"
          >
            {new Date(photo.timestamp).toLocaleTimeString()}
          </Badge>
        )}
      </div>

      {!photo.lat && (
        <Alert variant="default" className="border-yellow-500/40 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
          <MapPinOff size={14} />
          <AlertDescription className="text-xs">
            No location attached — report will still be submitted.
          </AlertDescription>
        </Alert>
      )}

      <Separator />

      {/* Waste type */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Waste Type
        </Label>
        <ToggleGroup
          type="single"
          value={selectedType ?? ""}
          onValueChange={(val) => val && onTypeSelect(val as WasteType)}
          className="flex flex-wrap gap-2 justify-start"
        >
          {WASTE_TYPES.map(({ label, icon: Icon }) => (
            <ToggleGroupItem
              key={label}
              value={label}
              size="sm"
              className="flex items-center gap-1.5 rounded-full border px-3 h-8 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Icon size={12} />
              {label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="report-note" className="text-xs uppercase tracking-wide text-muted-foreground">
          Description
        </Label>
        <Textarea
          id="report-note"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          placeholder="Add any details about the waste or location…"
          className="resize-none min-h-[80px] text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button
          onClick={onRetake}
          variant="outline"
          className="flex-1"
          disabled={loading}
        >
          <RotateCcw size={14} className="mr-2" />
          Retake
        </Button>
        <Button
          onClick={onSubmit}
          className="flex-1"
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={14} className="animate-spin mr-2" />
          ) : (
            <Send size={14} className="mr-2" />
          )}
          {loading ? "Submitting…" : "Submit"}
        </Button>
      </div>
    </div>
  );
}