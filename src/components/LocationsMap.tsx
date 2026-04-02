"use client";

import dynamic from "next/dynamic";

const LocationsMap = dynamic(() => import("./LocationsMapInternal"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] md:h-[520px] rounded-3xl bg-muted/20 animate-pulse flex items-center justify-center border border-border">
      <span className="text-muted-foreground font-medium">Loading Map...</span>
    </div>
  )
});

export default LocationsMap;
