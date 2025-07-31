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
  Download,
  CheckCircle, 
  XCircle, 
  Loader2, 
  QrCode,
  AlertTriangle,
  Copy,
  ExternalLink,
  Wallet
} from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

interface AddToWalletProps {
  defaultUrl?: string;
}

export default function AddToWallet({ defaultUrl = "" }: AddToWalletProps) {
  const [customUrl, setCustomUrl] = useState(defaultUrl || 'https://www.tapyfi.com/');
  const [isGeneratingApple, setIsGeneratingApple] = useState(false);
  const [isGeneratingGoogle, setIsGeneratingGoogle] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [applePassUrl, setApplePassUrl] = useState<string | null>(null);
  const [googlePassUrl, setGooglePassUrl] = useState<string | null>(null);

  // Generate QR code when URL changes
  useEffect(() => {
    if (customUrl && isValidUrl(customUrl)) {
      generateQRCode();
    }
  }, [customUrl]);

  const generateQRCode = async () => {
    if (!customUrl) return;
    
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(customUrl)}&margin=10`;
      setQrCodeUrl(qrUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.includes('tapyfi.com');
    } catch {
      return false;
    }
  };

  const generateAppleWalletPass = async () => {
    if (!isValidUrl(customUrl)) {
      toast.error('Please enter a valid TapyFi URL');
      return;
    }

    setIsGeneratingApple(true);
    try {
      const response = await fetch('/api/generate-apple-pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          customUrl,
          qrCodeData: customUrl 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Apple Wallet pass');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setApplePassUrl(url);
      
      toast.success('Apple Wallet pass generated successfully!');
      
      // Trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tapyfi-profile.pkpass';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error generating Apple Wallet pass:', error);
      toast.error('Failed to generate Apple Wallet pass');
    } finally {
      setIsGeneratingApple(false);
    }
  };

  const generateGoogleWalletPass = async () => {
    if (!isValidUrl(customUrl)) {
      toast.error('Please enter a valid TapyFi URL');
      return;
    }

    setIsGeneratingGoogle(true);
    try {
      const response = await fetch('/api/generate-google-pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          customUrl,
          qrCodeData: customUrl 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate Google Wallet pass');
      }

      const data = await response.json();
      const saveUrl = data.saveUrl;
      
      if (saveUrl) {
        // Open Google Wallet save URL
        window.open(saveUrl, '_blank');
        setGooglePassUrl(saveUrl);
        toast.success('Google Wallet pass created! Opening Google Wallet...');
      } else {
        throw new Error('No save URL received');
      }

    } catch (error) {
      console.error('Error generating Google Wallet pass:', error);
      toast.error('Failed to generate Google Wallet pass');
    } finally {
      setIsGeneratingGoogle(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Wallet className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              Add to Wallet
            </CardTitle>
            <p className="text-muted-foreground">
              Create Apple Wallet and Google Wallet passes for your TapyFi profile
            </p>
          </CardHeader>
        </Card>

        {/* URL Input */}
        <Card>
          <CardHeader>
            <CardTitle>TapyFi Profile URL</CardTitle>
            <p className="text-sm text-muted-foreground">
              Enter your TapyFi profile URL to create wallet passes
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="url">Custom URL</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="url"
                  type="url"
                  placeholder="https://www.tapyfi.com/yourusername"
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

            {/* URL Validation */}
            {customUrl && (
              <div className="flex items-center gap-2">
                {isValidUrl(customUrl) ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Valid TapyFi URL</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm text-red-600">Please enter a valid TapyFi URL</span>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Code Preview */}
        {customUrl && isValidUrl(customUrl) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  {qrCodeUrl && (
                    <div className="p-4 bg-white rounded-lg border inline-block">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code" 
                        className="w-64 h-64 mx-auto"
                      />
                      {/* Watermark */}
                      <div className="mt-2 text-center">
                        <p className="text-xs text-gray-500 font-medium">
                          Powered by TapyFi
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground break-all max-w-sm mx-auto">
                  {customUrl}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wallet Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Wallet Passes</CardTitle>
            <p className="text-sm text-muted-foreground">
              Click to create and download wallet passes for your devices
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Apple Wallet Button */}
              <div className="space-y-3">
                <button
                  onClick={generateAppleWalletPass}
                  disabled={!isValidUrl(customUrl) || isGeneratingApple}
                  className="w-full transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
                >
                  <Image
                    src="/assets/Add_to_Apple_Wallet_Badge.svg"
                    alt="Add to Apple Wallet"
                    width={200}
                    height={60}
                    className="mx-auto"
                  />
                </button>
                {isGeneratingApple && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Apple Wallet pass...
                  </div>
                )}
                {applePassUrl && (
                  <div className="text-center">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Pass Generated
                    </Badge>
                  </div>
                )}
              </div>

              {/* Google Wallet Button */}
              <div className="space-y-3">
                <button
                  onClick={generateGoogleWalletPass}
                  disabled={!isValidUrl(customUrl) || isGeneratingGoogle}
                  className="w-full transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
                >
                  <Image
                    src="/assets/add_to_google_wallet.svg"
                    alt="Add to Google Wallet"
                    width={200}
                    height={60}
                    className="mx-auto"
                  />
                </button>
                {isGeneratingGoogle && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Google Wallet pass...
                  </div>
                )}
                {googlePassUrl && (
                  <div className="text-center">
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Pass Generated
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium">Requirements:</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• Apple Wallet: iPhone with iOS 6+ or Apple Watch</li>
                    <li>• Google Wallet: Android device with Google Wallet app</li>
                    <li>• Valid TapyFi profile URL required</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card>
          <CardHeader>
            <CardTitle>Pass Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Pass Type</Label>
                <p className="text-sm text-muted-foreground">TapyFi Profile Card</p>
              </div>
              <div>
                <Label className="text-sm font-medium">URL</Label>
                <p className="text-sm text-muted-foreground break-all">{customUrl}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">QR Code</Label>
                <p className="text-sm text-muted-foreground">Contains profile URL</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Branding</Label>
                <p className="text-sm text-muted-foreground">Powered by TapyFi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Powered by TapyFi • Wallet passes expire in 1 year
          </p>
        </div>

      </div>
    </div>
  );
}
