"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Smartphone, 
  Wifi, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  QrCode,
  AlertTriangle,
  Copy,
  ExternalLink,
  Download,
  Apple
} from "lucide-react";
import toast from "react-hot-toast";

interface ActivateNfcQRProps {
  defaultUrl?: string;
}

export default function ActivateNfcQR({ defaultUrl = "" }: ActivateNfcQRProps) {
  const [nfcSupported, setNfcSupported] = useState<boolean | null>(null);
  const [isIPhone, setIsIPhone] = useState(false);
  const [isWriting, setIsWriting] = useState(false);
  const [customUrl, setCustomUrl] = useState(defaultUrl);
  const [writeSuccess, setWriteSuccess] = useState(false);
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState('');

  // Detect device and NFC support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if it's an iPhone
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isiPhone = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      setIsIPhone(isiPhone);
      
      // Check Web NFC support
      const supported = 'NDEFWriter' in window && 'NDEFReader' in window;
      setNfcSupported(supported);
      
      if (isiPhone) {
        setError('Web NFC is not supported on iPhone. Please use the App Store apps mentioned below.');
      } else if (!supported) {
        setError('Web NFC is not supported in this browser. Please use Chrome on Android.');
      }
    }
  }, []);

  // Generate QR code when URL changes
  useEffect(() => {
    if (customUrl) {
      generateQRCode();
    }
  }, [customUrl]);

  const generateQRCode = async () => {
    if (!customUrl) return;
    
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(customUrl)}`;
      setQrCode(qrUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const writeToNFC = async () => {
    if (!customUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    if (isIPhone) {
      setError('Please use a native iOS app to write NFC tags on iPhone');
      return;
    }

    if (!nfcSupported) {
      setError('NFC is not supported on this device');
      return;
    }

    setIsWriting(true);
    setError('');
    setWriteSuccess(false);

    try {
      const ndef = new (window as any).NDEFWriter();
      
      await ndef.write({
        records: [{
          recordType: 'url',
          data: customUrl
        }]
      });

      setWriteSuccess(true);
      toast.success('Successfully wrote URL to NFC tag!');
      
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown error occurred';
      setError(`Failed to write to NFC: ${errorMessage}`);
      toast.error('Failed to write to NFC tag');
    } finally {
      setIsWriting(false);
    }
  };

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(customUrl);
      toast.success('URL copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const testUrl = () => {
    if (customUrl) {
      window.open(customUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // iPhone-specific app recommendations
  const iPhoneNFCApps = [
    {
      name: "NFC Tools",
      description: "Free app for reading and writing NFC tags",
      url: "https://apps.apple.com/us/app/nfc-tools/id1252962749",
      free: true
    },
    {
      name: "TagWriter by NXP",
      description: "Official NXP app for writing NFC tags",
      url: "https://apps.apple.com/us/app/tagwriter-by-nxp/id1398596779",
      free: true
    },
    {
      name: "Smart NFC",
      description: "Advanced NFC reading and writing tools",
      url: "https://apps.apple.com/us/app/smart-nfc-tools-read-write/id1527587931",
      free: false,
      price: "$2.99"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Smartphone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              Activate NFC & QR Code
            </CardTitle>
            <p className="text-muted-foreground">
              {isIPhone 
                ? "Share your profile via QR code or use iPhone NFC apps"
                : "Write your profile URL to an NFC tag or share via QR code"
              }
            </p>
          </CardHeader>
        </Card>

        {/* Device & NFC Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isIPhone ? <Apple className="h-5 w-5" /> : <Wifi className="h-5 w-5" />}
              {isIPhone ? "iPhone Detected" : "NFC Status"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {isIPhone ? (
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              ) : nfcSupported === null ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : nfcSupported ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${
                isIPhone 
                  ? 'text-yellow-600'
                  : nfcSupported === null 
                    ? 'text-muted-foreground' 
                    : nfcSupported 
                      ? 'text-green-600' 
                      : 'text-red-600'
              }`}>
                {isIPhone 
                  ? 'Web NFC not supported on iPhone'
                  : nfcSupported === null 
                    ? 'Checking NFC support...' 
                    : nfcSupported 
                      ? 'NFC is supported and ready' 
                      : 'NFC is not supported'
                }
              </span>
              {nfcSupported && !isIPhone && (
                <Badge variant="secondary" className="ml-auto">
                  Web NFC Ready
                </Badge>
              )}
            </div>
            
            {/* iPhone-specific instructions */}
            {isIPhone && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2">
                  <Apple className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium">iPhone NFC Writing:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• iPhone 7 and newer support NFC writing</li>
                      <li>• Requires downloading native iOS apps</li>
                      <li>• Web browsers cannot write NFC tags on iPhone</li>
                      <li>• See recommended apps below</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Android requirements */}
            {!isIPhone && !nfcSupported && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800 dark:text-yellow-200">
                    <p className="font-medium">NFC Requirements:</p>
                    <ul className="mt-1 space-y-1 text-xs">
                      <li>• Use Chrome browser on Android device</li>
                      <li>• Enable NFC in device settings</li>
                      <li>• Grant NFC permissions to the browser</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* iPhone NFC Apps Recommendations */}
        {isIPhone && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Recommended iPhone NFC Apps
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Download these apps from the App Store to write NFC tags on your iPhone
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {iPhoneNFCApps.map((app, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{app.name}</h4>
                        {app.free ? (
                          <Badge variant="secondary" className="text-xs">Free</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">{app.price}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{app.description}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(app.url, '_blank')}
                      className="ml-3"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Get App
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* URL Input */}
        <Card>
          <CardHeader>
            <CardTitle>Profile URL</CardTitle>
            <p className="text-sm text-muted-foreground">
              {isIPhone 
                ? "Copy this URL to use with iPhone NFC apps or share via QR code"
                : "Enter the URL you want to write to the NFC tag"
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="url">Custom URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://tapyfi.com/yourusername"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyUrlToClipboard}
                  disabled={!customUrl}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={testUrl}
                  disabled={!customUrl}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Success Display */}
            {writeSuccess && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800 dark:text-green-200">
                    <p className="font-medium">Success!</p>
                    <p>Your URL has been written to the NFC tag.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Write Button - Only show for Android */}
            {!isIPhone && (
              <Button
                onClick={writeToNFC}
                disabled={!customUrl.trim() || !nfcSupported || isWriting}
                className="w-full"
                size="lg"
              >
                {isWriting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Writing to NFC...
                  </>
                ) : (
                  <>
                    <Wifi className="h-4 w-4 mr-2" />
                    Write to NFC Tag
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        <Separator />

        {/* QR Code Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code {isIPhone && <Badge variant="secondary">Recommended for iPhone</Badge>}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Scan this QR code to access your profile
            </p>
          </CardHeader>
          <CardContent>
            {customUrl ? (
              <div className="text-center space-y-4">
                {qrCode && (
                  <div className="inline-block p-4 bg-white rounded-lg border">
                    <img 
                      src={qrCode} 
                      alt="QR Code" 
                      className="w-48 h-48 mx-auto"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground break-all">
                  {customUrl}
                </p>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Enter a URL to generate QR code</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm">
              {isIPhone ? (
                <>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0 mt-0.5">1</Badge>
                    <p>Download one of the recommended NFC apps from the App Store</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0 mt-0.5">2</Badge>
                    <p>Copy your profile URL using the copy button above</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0 mt-0.5">3</Badge>
                    <p>Open the NFC app and paste your URL</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0 mt-0.5">4</Badge>
                    <p>Hold your NFC tag near the top of your iPhone to write</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0 mt-0.5">1</Badge>
                    <p>Enter your profile URL in the text field above</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0 mt-0.5">2</Badge>
                    <p>Hold your NFC tag close to your device</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0 mt-0.5">3</Badge>
                    <p>Click "Write to NFC Tag" and keep the tag close until writing completes</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="shrink-0 mt-0.5">4</Badge>
                    <p>Test the NFC tag by tapping it with any NFC-enabled device</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
