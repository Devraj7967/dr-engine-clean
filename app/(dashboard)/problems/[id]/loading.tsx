import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProblemDetailLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Skeleton className="h-10 w-44" />

      <Card>
        <CardHeader className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
