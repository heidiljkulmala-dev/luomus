"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { Camera, X, SwitchCamera, Circle } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Props = {
  onCapture: (file: File, previewUrl: string) => void;
  onClose: () => void;
};

export function CameraCapture({ onCapture, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facing, setFacing] = useState<"environment" | "user">("environment");
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const startCamera = useCallback(async () => {
    setError(null);
    setReady(false);
    streamRef.current?.getTracks().forEach((t) => t.stop());

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setReady(true);
      }
    } catch {
      setError("Camera access denied or unavailable. Try uploading a photo instead.");
    }
  }, [facing]);

  useEffect(() => {
    startCamera();
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [startCamera]);

  function takePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !ready) return;

    const size = Math.min(video.videoWidth, video.videoHeight, 1200);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "bead-scan.jpg", { type: "image/jpeg" });
        const url = URL.createObjectURL(blob);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        onCapture(file, url);
      },
      "image/jpeg",
      0.92
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-purple/95 flex flex-col">
      <div className="flex items-center justify-between p-4 text-white">
        <h2 className="font-display text-lg font-semibold flex items-center gap-2">
          <Camera className="h-5 w-5" /> Take a photo
        </h2>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10" aria-label="Close camera">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden bg-black">
          {error ? (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-white/80 text-sm">
              {error}
            </div>
          ) : (
            <>
              <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
              <div className="absolute inset-6 border-2 border-dashed border-white/40 rounded-xl pointer-events-none" />
              <p className="absolute bottom-3 left-0 right-0 text-center text-xs text-white/70">
                Center your bead or jewelry in the frame
              </p>
            </>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      <div className="p-6 flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-purple-dark/35"
          onClick={() => setFacing((f) => (f === "environment" ? "user" : "environment"))}
        >
          <SwitchCamera className="h-4 w-4" /> Flip
        </Button>
        <button
          onClick={takePhoto}
          disabled={!ready || !!error}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg disabled:opacity-40 hover:scale-105 transition-transform"
          aria-label="Capture photo"
        >
          <Circle className="h-8 w-8 text-accent fill-accent" />
        </button>
        <div className="w-20" />
      </div>
    </div>
  );
}
