import React from 'react';
import Image from "next/image";
import logo from "@/public/images/ignitelogo.png";

export const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background/80 backdrop-blur-md z-[9999]">
      <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="relative">
          {/* Outer glowing ring */}
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 opacity-75 duration-[2000ms]"></div>

          {/* Inner pulsating logo container */}
          <div className="relative rounded-full bg-primary p-1 shadow-[0_0_40px_rgba(var(--primary),0.3)] animate-pulse shrink-0 w-24 h-24 sm:w-32 sm:h-32">
            <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/20">
              <Image
                src={logo}
                alt="FolaIgnite"
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-3">
          <h3 className="text-2xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-t from-foreground to-foreground/70">
            FolaIgnite
          </h3>
          <div className="flex flex-col items-center space-y-1">
            <p className="text-sm text-muted-foreground/80 font-medium">Igniting your journey...</p>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
