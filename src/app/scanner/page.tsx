"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Upload, Scan, Camera, Gem, CircleDot, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CameraCapture } from "@/components/scanner/CameraCapture";
import { ScanResults } from "@/components/scanner/ScanResults";
import { analyzeImage } from "@/lib/scanner/analyze-image";
import { matchSupplies } from "@/lib/scanner/match-supplies";
import type { ScanResult } from "@/types";

type ScanMode = "jewelry" | "bead";

export default function ScannerPage() {
  const [scanMode, setScanMode] = useState<ScanMode>("jewelry");
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const runAnalysis = useCallback(async (file: File, url: string) => {
    setPreview(url);
    setResult(null);
    setScanError(null);
    setScanning(true);

    try {
      const analysis = await analyzeImage(url, scanMode);
      const matched = matchSupplies(analysis, scanMode);
      setResult(matched);
    } catch {
      setScanError("Could not analyze this image. Try a clearer photo with good lighting.");
    } finally {
      setScanning(false);
    }
  }, [scanMode]);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const url = URL.createObjectURL(file);
      runAnalysis(file, url);
    },
    [runAnalysis]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  function resetScan() {
    setPreview(null);
    setResult(null);
    setScanError(null);
  }

  return (
    <div className="min-h-screen craft-grid">
      {showCamera && (
        <CameraCapture
          onCapture={(file, url) => {
            setShowCamera(false);
            runAnalysis(file, url);
          }}
          onClose={() => setShowCamera(false)}
        />
      )}

      <div className="bg-gradient-to-b from-amber/15 to-transparent py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Badge variant="amber" className="mb-3">Photo · Camera · Smart matching</Badge>
          <h1 className="font-display text-4xl font-bold text-purple-dark">Material Matcher</h1>
          <p className="mt-2 text-muted max-w-2xl">
            Snap or upload a photo of a finished piece or a single material. craftopia analyzes the colors
            and suggests matching supplies, shops, tools, and steps to create something similar.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 lg:px-8 py-8">
        {/* Scan mode toggle */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setScanMode("jewelry"); resetScan(); }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              scanMode === "jewelry"
                ? "bg-purple text-white shadow-md"
                : "bg-white/80 text-muted hover:bg-purple/10"
            }`}
          >
            <Gem className="h-4 w-4" /> Full jewelry piece
          </button>
          <button
            onClick={() => { setScanMode("bead"); resetScan(); }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
              scanMode === "bead"
                ? "bg-purple text-white shadow-md"
                : "bg-white/80 text-muted hover:bg-purple/10"
            }`}
          >
            <CircleDot className="h-4 w-4" /> Single bead close-up
          </button>
        </div>

        {/* Capture actions */}
        {!preview && (
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <Button
              variant="secondary"
              size="lg"
              className="h-auto py-6 flex-col gap-2"
              onClick={() => setShowCamera(true)}
            >
              <Camera className="h-8 w-8" />
              <span>Take a photo</span>
              <span className="text-xs opacity-80 font-normal">Uses your device camera</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-auto py-6 flex-col gap-2 bg-white/80"
              onClick={() => uploadInputRef.current?.click()}
            >
              <Upload className="h-8 w-8" />
              <span>Upload from gallery</span>
              <span className="text-xs opacity-80 font-normal">PNG or JPG</span>
            </Button>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </div>
        )}

        {/* Drop zone / preview */}
        <div
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`relative rounded-2xl border-2 border-dashed transition-colors ${
            preview
              ? "border-purple/15 bg-white/60 p-6"
              : "border-purple/20 bg-white/60 p-12 text-center hover:border-accent/40 hover:bg-white/80"
          }`}
        >
          {preview ? (
            <div>
              <div className="relative mx-auto max-w-sm aspect-square rounded-xl overflow-hidden">
                <Image src={preview} alt="Your photo" fill className="object-cover" unoptimized />
                {scanning && (
                  <div className="absolute inset-0 bg-purple/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Scan className="h-10 w-10 mx-auto animate-pulse" />
                      <p className="mt-2 font-medium">Matching beads &amp; supplies...</p>
                    </div>
                  </div>
                )}
              </div>
              {!scanning && (
                <div className="flex justify-center gap-3 mt-4">
                  <Button variant="outline" size="sm" onClick={resetScan}>
                    <RotateCcw className="h-4 w-4" /> Scan another
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => setShowCamera(true)}>
                    <Camera className="h-4 w-4" /> Retake
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 mx-auto text-muted" />
              <p className="mt-4 font-medium text-purple-dark">Or drag a photo here</p>
              <p className="text-sm text-muted mt-1">
                {scanMode === "bead"
                  ? "Tip: fill the frame with one bead for the best match"
                  : "Tip: use natural light and show the full piece"}
              </p>
            </>
          )}
          {!preview && (
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          )}
        </div>

        {scanError && (
          <div className="mt-4 rounded-xl bg-accent/10 text-accent text-sm px-4 py-3">
            {scanError}
          </div>
        )}

        {result && preview && !scanning && (
          <ScanResults result={result} preview={preview} />
        )}
      </div>
    </div>
  );
}
