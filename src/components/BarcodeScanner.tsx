"use client";

import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (errorMessage: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScanSuccess,
  onScanFailure,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader");
        html5QrCodeRef.current = html5QrCode;

        const config = { fps: 10, qrbox: { width: 250, height: 150 } };

        // Try to start with back camera first
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            onScanSuccess(decodedText);
          },
          (errorMessage) => {
            if (onScanFailure) onScanFailure(errorMessage);
          },
        );
        setIsCameraStarted(true);
      } catch (err) {
        console.error("Error starting scanner:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to start camera. Please ensure camera permissions are granted.",
        );
      }
    };

    startScanner();

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            html5QrCodeRef.current?.clear();
          })
          .catch((err) => console.error("Error stopping scanner:", err));
      }
    };
  }, [onScanSuccess, onScanFailure]);

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-xl border border-gray-200 bg-gray-900 relative min-h-[300px] flex items-center justify-center">
      {!isCameraStarted && !error && (
        <div className="text-white text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p className="text-sm">Initializing camera...</p>
        </div>
      )}

      {error && (
        <div className="text-red-400 text-center p-6">
          <p className="text-sm font-bold mb-2">Camera Error</p>
          <p className="text-xs">{error}</p>
          <p className="text-[10px] mt-4 text-gray-400">
            Make sure you are using HTTPS and have granted camera permissions.
          </p>
        </div>
      )}

      <div id="reader" className="w-full h-full"></div>

      {isCameraStarted && (
        <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
          Live
        </div>
      )}
    </div>
  );
};

export default BarcodeScanner;
