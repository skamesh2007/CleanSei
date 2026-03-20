import { Loader2, RotateCcw, Send, MapPinOff, ImageUp, DatabaseZap } from "lucide-react";
import { Button }    from "@/components/ui/button";
import { Textarea }  from "@/components/ui/textarea";
import { Label }     from "@/components/ui/label";
import { Badge }     from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { WASTE_TYPES, type WasteType } from "@/lib/report/types";
import type { PhotoData, Severity } from "@/lib/report/types";
import type { SubmitStep } from "@/lib/report/useReport";

// ─── Severity config ──────────────────────────────────────────────────────────

const SEVERITY_OPTIONS: {
  value:   Severity;
  label:   string;
  classes: string;
}[] = [
  {
    value:   "low",
    label:   "Low",
    classes:
      "data-[state=on]:bg-emerald-500/15 data-[state=on]:text-emerald-600 data-[state=on]:border-emerald-500/40 dark:data-[state=on]:text-emerald-400",
  },
  {
    value:   "medium",
    label:   "Medium",
    classes:
      "data-[state=on]:bg-amber-500/15 data-[state=on]:text-amber-600 data-[state=on]:border-amber-500/40 dark:data-[state=on]:text-amber-400",
  },
  {
    value:   "high",
    label:   "High",
    classes:
      "data-[state=on]:bg-red-500/15 data-[state=on]:text-red-600 data-[state=on]:border-red-500/40 dark:data-[state=on]:text-red-400",
  },
];

// ─── Submit step label ────────────────────────────────────────────────────────

function SubmitLabel({ step }: { step: SubmitStep }) {
  if (step === "uploading_image")
    return (
      <>
        <ImageUp size={14} className="animate-pulse" />
        Uploading image…
      </>
    );
  if (step === "saving_report")
    return (
      <>
        <DatabaseZap size={14} className="animate-pulse" />
        Saving report…
      </>
    );
  return (
    <>
      <Send size={14} />
      Submit
    </>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PhotoPreviewProps {
  photo:         PhotoData;
  note:          string;
  selectedType:  WasteType | null;
  severity:      Severity;
  loading:       boolean;
  step:          SubmitStep;
  error:         string | null;
  onNoteChange:  (note: string) => void;
  onTypeSelect:  (type: WasteType) => void;
  onSeverity:    (s: Severity) => void;
  onRetake:      () => void;
  onSubmit:      () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PhotoPreview({
  photo,
  note,
  selectedType,
  severity,
  loading,
  step,
  error,
  onNoteChange,
  onTypeSelect,
  onSeverity,
  onRetake,
  onSubmit,
}: PhotoPreviewProps) {
  return (
    <div className="space-y-4">

      {/* Photo thumbnail */}
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

      {/* No-location warning */}
      {!photo.lat && (
        <Alert className="border-yellow-500/40 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
          <MapPinOff size={14} />
          <AlertDescription className="text-xs">
            No location attached — report will still be submitted.
          </AlertDescription>
        </Alert>
      )}

      {/* Submit error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className="text-xs">{error}</AlertDescription>
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

      {/* Severity */}
      <div className="space-y-2">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          Severity
        </Label>
        <ToggleGroup
          type="single"
          value={severity}
          onValueChange={(val) => val && onSeverity(val as Severity)}
          className="flex gap-2 justify-start"
        >
          {SEVERITY_OPTIONS.map((opt) => (
            <ToggleGroupItem
              key={opt.value}
              value={opt.value}
              size="sm"
              className={`rounded-full border px-4 h-8 text-xs font-medium ${opt.classes}`}
            >
              {opt.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* Description */}
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
          disabled={loading}
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
          className="flex-1 gap-2"
          disabled={loading || !selectedType}
        >
          <SubmitLabel step={step} />
        </Button>
      </div>

    </div>
  );
}