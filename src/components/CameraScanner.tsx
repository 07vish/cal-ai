import React, { useState, useRef, useEffect } from 'react';
import type { FoodItem, PresetFoodSample } from '../types';
import { PRESET_FOOD_SAMPLES, analyzeFoodImage } from '../services/foodRecognition';
import {
  Camera,
  RefreshCw,
  Zap,
  ZapOff,
  Grid,
  Image as ImageIcon,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CameraScannerProps {
  onFoodDetected: (food: FoodItem) => void;
  geminiApiKey?: string;
  isDarkMode?: boolean;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onFoodDetected,
  geminiApiKey,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flashOn, setFlashOn] = useState<boolean>(false);
  const [gridOn, setGridOn] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<string>('Align food inside the frame');
  const [selectedPreset, setSelectedPreset] = useState<PresetFoodSample | null>(null);

  // Initialize camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setCameraError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setStreamActive(true);
        }
      } catch (err: unknown) {
        console.warn('Camera stream could not start (normal in non-HTTPS / test environments):', err);
        setCameraError('Camera access unavailable. Use photo upload or test food samples below!');
        setStreamActive(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Flip camera
  const handleFlipCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Trigger Capture & Scan
  const handleCapture = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setScanStatus('Acquiring image & identifying macros...');

    try {
      if (streamActive && videoRef.current) {
        // Capture frame from video stream
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 480;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

          setScanStatus('Running neural vision & macro estimation...');
          setTimeout(async () => {
            const detected = await analyzeFoodImage(dataUrl, geminiApiKey);
            setIsAnalyzing(false);
            onFoodDetected(detected);
          }, 1200);
          return;
        }
      }

      // If no live webcam stream, use default or active preset sample
      const sample = selectedPreset || PRESET_FOOD_SAMPLES[0];
      setScanStatus(`Detecting ${sample.title}...`);
      setTimeout(async () => {
        const detected = await analyzeFoodImage(sample.imageUrl, geminiApiKey);
        setIsAnalyzing(false);
        onFoodDetected(detected);
      }, 1200);

    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
      setScanStatus('Detection error. Try again.');
    }
  };

  // Handle Photo Library Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setScanStatus('Reading image data...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setScanStatus('Analyzing food item & calculating calories...');
      setTimeout(async () => {
        const detected = await analyzeFoodImage(dataUrl, geminiApiKey);
        setIsAnalyzing(false);
        onFoodDetected(detected);
      }, 1200);
    };
    reader.readAsDataURL(file);
  };

  // Quick Preset Sample Selection
  const handleSelectPreset = (preset: PresetFoodSample) => {
    setSelectedPreset(preset);
    setIsAnalyzing(true);
    setScanStatus(`Scanning ${preset.foodData.name}...`);
    setTimeout(async () => {
      const detected = await analyzeFoodImage(preset.imageUrl, geminiApiKey);
      setIsAnalyzing(false);
      onFoodDetected(detected);
    }, 1100);
  };

  return (
    <div className="relative w-full h-[720px] bg-black text-white rounded-3xl overflow-hidden flex flex-col justify-between border border-white/10 shadow-2xl select-none">
      {/* Top Camera Controls Bar */}
      <div className="relative z-30 px-6 pt-5 pb-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`p-2.5 rounded-full transition-all ${
            flashOn ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/40' : 'bg-black/40 text-white backdrop-blur-md hover:bg-white/20'
          }`}
          title="Toggle Flash"
        >
          {flashOn ? <Zap className="w-5 h-5 fill-current" /> : <ZapOff className="w-5 h-5" />}
        </button>

        {/* Status Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium">
          {isAnalyzing ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-apple-green animate-spin" />
              <span className="text-apple-green font-semibold">{scanStatus}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-apple-ringProtein" />
              <span className="text-neutral-200">AI Vision Live</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setGridOn(!gridOn)}
            className={`p-2.5 rounded-full transition-all ${
              gridOn ? 'bg-white text-black' : 'bg-black/40 text-white backdrop-blur-md hover:bg-white/20'
            }`}
            title="Toggle Grid Overlay"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={handleFlipCamera}
            className="p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-white/20 transition-all"
            title="Flip Camera"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder Area */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Flash Simulation Overlay */}
        {flashOn && (
          <div className="absolute inset-0 bg-white/20 pointer-events-none z-20" />
        )}

        {/* Live Video Feed OR Mock Fallback Viewfinder */}
        {streamActive ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-neutral-950">
            {selectedPreset ? (
              <img
                src={selectedPreset.imageUrl}
                alt={selectedPreset.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop"
                alt="Delicious meal"
                className="absolute inset-0 w-full h-full object-cover opacity-75"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />

            {cameraError && (
              <div className="relative z-10 max-w-xs mb-32 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 text-xs text-neutral-300 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="text-left leading-relaxed">
                  Ready to detect food! Tap <strong>Shutter</strong>, choose a preset food item below, or upload a photo from your library.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Apple 3x3 Grid Overlay */}
        {gridOn && (
          <div className="absolute inset-0 pointer-events-none z-10 grid grid-cols-3 grid-rows-3 border border-white/10">
            <div className="border-r border-b border-white/10" />
            <div className="border-r border-b border-white/10" />
            <div className="border-b border-white/10" />
            <div className="border-r border-b border-white/10" />
            <div className="border-r border-b border-white/10" />
            <div className="border-b border-white/10" />
            <div className="border-r border-white/10" />
            <div className="border-r border-white/10" />
            <div />
          </div>
        )}

        {/* Viewfinder Target Reticle */}
        <div className="relative z-10 w-72 h-72 border-2 border-white/30 rounded-3xl flex items-center justify-center pointer-events-none">
          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-apple-green rounded-tl-xl -translate-x-1 -translate-y-1" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-apple-green rounded-tr-xl translate-x-1 -translate-y-1" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-apple-green rounded-bl-xl -translate-x-1 translate-y-1" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-apple-green rounded-br-xl translate-x-1 translate-y-1" />

          {/* Real-time laser scan line when active */}
          {isAnalyzing && (
            <div className="absolute left-0 right-0 h-1 laser-line animate-scan" />
          )}

          {/* AI Focus Reticle Center */}
          <div className="w-12 h-12 rounded-full border border-dashed border-white/40 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-apple-green animate-ping" />
          </div>
        </div>
      </div>

      {/* Preset Food Bar: Allows 1-Click Instant Testing */}
      <div className="relative z-30 px-4 pt-2 pb-2 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-apple-ringProtein" />
            Tap to Test High-Accuracy Dishes
          </span>
          <span className="text-[10px] text-neutral-400">8 sample plates</span>
        </div>

        <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-1">
          {PRESET_FOOD_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectPreset(sample)}
              className={`flex-shrink-0 flex items-center gap-2 p-1.5 pr-3 rounded-2xl border transition-all ${
                selectedPreset?.id === sample.id
                  ? 'bg-white/20 border-apple-ringProtein shadow-md scale-105'
                  : 'bg-black/60 border-white/10 hover:border-white/30 backdrop-blur-md'
              }`}
            >
              <img
                src={sample.imageUrl}
                alt={sample.title}
                className="w-10 h-10 rounded-xl object-cover"
              />
              <div className="text-left">
                <p className="text-xs font-semibold text-white truncate max-w-[110px]">{sample.title}</p>
                <p className="text-[10px] text-apple-ringCalories font-bold">{sample.foodData.calories} kcal</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Shutter & Controls Section (iOS Style) */}
      <div className="relative z-30 px-8 pb-10 pt-2 flex items-center justify-between bg-black">
        {/* Gallery / File Picker */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white transition-colors"
          title="Upload from Photo Library"
        >
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/15 flex items-center justify-center hover:bg-neutral-800 transition-colors">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-medium">Library</span>
        </button>

        {/* Big Apple Shutter Button */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={handleCapture}
            disabled={isAnalyzing}
            aria-label="Capture and Detect Food"
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1.5 transition-transform active:scale-90 hover:scale-105 disabled:opacity-50"
          >
            <div className={`w-full h-full rounded-full transition-all ${
              isAnalyzing ? 'bg-apple-green animate-pulse' : 'bg-white active:bg-neutral-300'
            }`} />
          </button>
        </div>

        {/* Quick Help / Info */}
        <div className="w-12 flex flex-col items-center gap-1 text-neutral-400">
          <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-white/15 flex items-center justify-center text-apple-green">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-medium text-neutral-400">Scan</span>
        </div>
      </div>
    </div>
  );
};
