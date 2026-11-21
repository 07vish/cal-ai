import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  AlertCircle,
  Video,
  Play
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
  const [scanStatus, setScanStatus] = useState<string>('Point at any food to detect');
  const [selectedPreset, setSelectedPreset] = useState<PresetFoodSample | null>(null);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);

  // Initialize camera stream with robust fallbacks
  const startCamera = useCallback(async () => {
    setCameraError(null);

    // Stop any existing stream tracks
    if (videoRef.current && videoRef.current.srcObject) {
      const existing = videoRef.current.srcObject as MediaStream;
      existing.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }

    const constraintOptions: MediaStreamConstraints[] = [
      // 1. Try preferred facing mode with ideal resolution
      {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      },
      // 2. Try simple facing mode
      {
        video: { facingMode: facingMode },
        audio: false
      },
      // 3. Universal fallback: any video source (works on all laptops/webcams/phones)
      {
        video: true,
        audio: false
      }
    ];

    let mediaStream: MediaStream | null = null;
    let lastError: unknown = null;

    for (const constraints of constraintOptions) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (mediaStream) break;
      } catch (err) {
        lastError = err;
      }
    }

    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      try {
        await videoRef.current.play();
        setStreamActive(true);
        setCameraError(null);
      } catch (playErr) {
        console.warn('Video play interrupted or blocked:', playErr);
        setStreamActive(true);
      }
    } else {
      console.warn('All camera constraints failed:', lastError);
      setCameraError('Camera access blocked or not supported on this browser. Click "Enable Camera" or upload a photo.');
      setStreamActive(false);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  // Flip camera between front and back
  const handleFlipCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Trigger Real Capture & Scan
  const handleCapture = async () => {
    if (isAnalyzing) return;
    setIsAnalyzing(true);
    setScanStatus('Capturing frame...');

    try {
      let imageToAnalyze: string | null = null;

      // 1. If live video stream is active, grab the EXACT frame from video
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          imageToAnalyze = canvas.toDataURL('image/jpeg', 0.9);
          setCapturedSnapshot(imageToAnalyze);
        }
      }

      // 2. If no video frame (e.g. camera off), use preset or prompt
      if (!imageToAnalyze) {
        if (selectedPreset) {
          imageToAnalyze = selectedPreset.imageUrl;
        } else {
          // If no camera and no preset, prompt user to pick photo
          setIsAnalyzing(false);
          fileInputRef.current?.click();
          return;
        }
      }

      setScanStatus('AI Vision analyzing calories & macros...');
      const detected = await analyzeFoodImage(imageToAnalyze, geminiApiKey);
      setIsAnalyzing(false);
      setCapturedSnapshot(null);
      onFoodDetected(detected);

    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
      setScanStatus('Analysis error. Try again.');
      setCapturedSnapshot(null);
    }
  };

  // Handle Photo Library Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setScanStatus('Reading photo...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedSnapshot(dataUrl);
      setScanStatus('AI scanning calories, protein & macros...');
      try {
        const detected = await analyzeFoodImage(dataUrl, geminiApiKey);
        setIsAnalyzing(false);
        setCapturedSnapshot(null);
        onFoodDetected(detected);
      } catch (err) {
        console.error(err);
        setIsAnalyzing(false);
        setCapturedSnapshot(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset Sample Click
  const handleSelectPreset = (preset: PresetFoodSample) => {
    setSelectedPreset(preset);
    setIsAnalyzing(true);
    setCapturedSnapshot(preset.imageUrl);
    setScanStatus(`Scanning ${preset.foodData.name}...`);
    setTimeout(async () => {
      const detected = await analyzeFoodImage(preset.imageUrl, geminiApiKey);
      setIsAnalyzing(false);
      setCapturedSnapshot(null);
      onFoodDetected(detected);
    }, 900);
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
          ) : streamActive ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-apple-green" />
              <span className="text-neutral-200">Live Camera Ready</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-200">Camera Paused</span>
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
      <div className="relative flex-1 flex items-center justify-center overflow-hidden bg-neutral-950">
        {/* Flash Simulation Overlay */}
        {flashOn && (
          <div className="absolute inset-0 bg-white/30 pointer-events-none z-20" />
        )}

        {/* The Live Video Element is ALWAYS mounted so srcObject is never lost */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            streamActive && !capturedSnapshot ? 'opacity-100 z-0' : 'opacity-0 -z-10'
          }`}
        />

        {/* Freeze frame snapshot if currently analyzing a picture */}
        {capturedSnapshot && (
          <img
            src={capturedSnapshot}
            alt="Captured meal"
            className="absolute inset-0 w-full h-full object-cover z-10"
          />
        )}

        {/* If Camera is NOT active and no snapshot, show camera enable UI */}
        {!streamActive && !capturedSnapshot && (
          <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-xs">
            <div className="w-16 h-16 rounded-3xl bg-neutral-900 border border-white/10 flex items-center justify-center mb-4 text-apple-green shadow-xl">
              <Video className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold mb-1">Camera Standby</h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              {cameraError || 'Allow camera access to scan your food in real-time, or upload a photo from your gallery.'}
            </p>
            <div className="flex flex-col gap-2 w-full">
              <button
                onClick={startCamera}
                className="w-full py-2.5 rounded-2xl bg-apple-green text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors shadow-lg"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Turn On Camera</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 rounded-2xl bg-white/10 border border-white/10 text-white font-semibold text-xs hover:bg-white/15 transition-colors"
              >
                Upload Food Photo Instead
              </button>
            </div>
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
            <div className="border-r border-b border-white/10" />
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

      {/* Preset Food Bar: Quick testing dishes */}
      <div className="relative z-30 px-4 pt-2 pb-2 bg-gradient-to-t from-black via-black/85 to-transparent">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-apple-ringProtein" />
            Quick Test Dishes
          </span>
          <span className="text-[10px] text-neutral-400">or scan real food</span>
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

        {/* Big Apple Shutter Button: snaps the real camera frame */}
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

        {/* Camera Start / Switch Action */}
        <button
          onClick={startCamera}
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white transition-colors"
          title="Restart Camera"
        >
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-colors ${
            streamActive ? 'bg-neutral-900 border-white/15 text-apple-green' : 'bg-apple-green/20 border-apple-green text-apple-green'
          }`}>
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-medium">
            {streamActive ? 'Camera' : 'Start'}
          </span>
        </button>
      </div>
    </div>
  );
};
