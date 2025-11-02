import React from 'react';

export const LoadingScreen = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};
