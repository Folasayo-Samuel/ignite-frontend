import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 opacity-75 duration-1000"></div>
          <div className="relative rounded-full bg-card p-4 shadow-xl ring-1 ring-border">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">FolaIgnite</h3>
          <p className="text-xs text-muted-foreground animate-pulse">Preparing your experience...</p>
        </div>
      </div>
    </div>
  );
};
