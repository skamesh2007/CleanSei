import { RefObject } from "react";
import { X, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CameraViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onCapture: () => void;
  onClose: () => void;
}

export function CameraView({
  videoRef,
  canvasRef,
  onCapture,
  onClose,
}: CameraViewProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-black">
      <video
        ref={videoRef}
        className="w-full rounded-xl object-cover aspect-[4/3]"
        playsInline
        muted
      />
      <canvas ref={canvasRef} className="hidden" />

      {/* Close */}
      <Button
        variant="secondary"
        size="icon"
        onClick={onClose}
        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm"
      >
        <X size={15} />
      </Button>

      {/* Shutter */}
      <button
        onClick={onCapture}
        aria-label="Take photo"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center justify-center w-16 h-16 rounded-full bg-white border-4 border-white/40 shadow-lg active:scale-95 transition-transform"
      >
        <Circle size={28} className="text-black fill-black" />
      </button>
    </div>
  );
}