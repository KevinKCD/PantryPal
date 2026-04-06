'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanFailure?: (errorMessage: string) => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScanSuccess, onScanFailure }) => {
  const [error, setError] = useState<string | null>(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const startScanner = async () => {
    setError(null);
    setIsCameraStarted(false);
    
    try {
      // Clean up previous instance if it exists
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
      }

      const html5QrCode = new Html5Qrcode('reader');
      html5QrCodeRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 150 } };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          if (onScanFailure) onScanFailure(errorMessage);
        }
      );
      setIsCameraStarted(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
      let userFriendlyError = 'Failed to start camera.';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
          userFriendlyError = 'Camera permission was denied. Please click the camera icon in your browser address bar to allow access.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          userFriendlyError = 'No camera found on this device.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          userFriendlyError = 'Camera is already in use by another application.';
        } else {
          userFriendlyError = err.message;
        }
      }
      setError(userFriendlyError);
    }
  };

  useEffect(() => {
    startScanner();

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current?.clear();
        }).catch(err => console.error('Error stopping scanner:', err));
      }
    };
  }, [onScanSuccess, onScanFailure, retryCount]);

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
          <p className="text-sm font-bold mb-2">Camera Access Required</p>
          <p className="text-xs mb-4">{error}</p>
          <div className="text-[10px] text-gray-400 space-y-2 text-left bg-black/20 p-3 rounded-lg mb-4">
            <p>• Click the camera/lock icon in the address bar.</p>
            <p>• Set Camera to "Allow".</p>
            <p>• Ensure no other app is using the camera.</p>
            <p>• Refresh the page if the prompt doesn't appear.</p>
          </div>
          <div className="flex space-x-2 justify-center">
            <button 
              onClick={() => setRetryCount(prev => prev + 1)}
              className="text-xs bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Refresh Page
            </button>
          </div>
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
