"use client";

import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const GarageMap = dynamic(() => import("@/components/GarageMap"), {
  ssr: false,
  loading: () => (
    <Card>
      <CardContent className="space-y-3 p-4">
        <Skeleton className="h-[340px] w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  ),
});

export default function GaragesPage() {
  return (
    <div className="p-2 sm:p-4">
      <GarageMap />
    </div>
  );
}
