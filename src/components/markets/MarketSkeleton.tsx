import React from 'react';

export function MarketSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-6 w-64 bg-background-primary rounded-md"></div>
          <div className="h-4 w-32 bg-background-primary rounded-md"></div>
        </div>
        <div className="h-6 w-24 bg-background-primary rounded-md"></div>
      </div>

      <div className="flex items-center space-x-4 mt-4">
        <div className="h-5 w-32 bg-background-primary rounded-md"></div>
        <div className="h-5 w-32 bg-background-primary rounded-md"></div>
      </div>

      <div className="h-2 bg-background-primary rounded-full mt-4"></div>

      <div className="flex items-center justify-between mt-2">
        <div className="h-4 w-20 bg-background-primary rounded-md"></div>
        <div className="h-4 w-20 bg-background-primary rounded-md"></div>
      </div>

      <div className="flex space-x-4 mt-4">
        <div className="flex-1 h-10 bg-background-primary rounded-lg"></div>
        <div className="flex-1 h-10 bg-background-primary rounded-lg"></div>
      </div>
    </div>
  );
}