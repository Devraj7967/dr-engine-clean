import { Suspense } from "react";
import { DiagnosisWizard } from "@/components/diagnosis-wizard";
import { Skeleton } from "@/components/ui/skeleton";

function DiagnosisWizardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <Skeleton className="h-2 w-full" />
      </div>
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function DiagnosePage() {
  return (
    <div className="p-6">
      <Suspense fallback={<DiagnosisWizardSkeleton />}>
        <DiagnosisWizard />
      </Suspense>
    </div>
  );
}
