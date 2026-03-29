import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CircleDollarSign,
  ListChecks,
  ShieldAlert,
  Stethoscope,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoSolutions } from "@/components/VideoSolutions";
import { formatPrice, getProblemById, getSeverityColor } from "@/lib/data/problems";
import { CATEGORY_INFO } from "@/lib/types";

interface ProblemDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProblemDetailPage({ params }: ProblemDetailPageProps) {
  const { id } = await params;
  const problem = getProblemById(id);

  if (!problem) {
    notFound();
  }

  const categoryInfo = CATEGORY_INFO[problem.category];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="outline">
          <Link href="/problems">
            <ArrowLeft className="mr-2 size-4" />
            Back to Problems
          </Link>
        </Button>
        <Badge variant="secondary">Problem ID: {problem.id}</Badge>
      </div>

      <Card className="border-border/70">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{categoryInfo.label}</Badge>
            <Badge variant="outline" className={getSeverityColor(problem.severity)}>
              {problem.severity}
            </Badge>
          </div>
          <CardTitle className="text-2xl sm:text-3xl">{problem.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Estimated Cost:</span>
            <span>
              {formatPrice(problem.estimated_cost_min)} - {formatPrice(problem.estimated_cost_max)}
            </span>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/70 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Stethoscope className="size-5 text-primary" />
              Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2">
              {problem.symptoms.map((symptom) => (
                <li key={symptom} className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                  {symptom}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CircleDollarSign className="size-5 text-primary" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-md border border-border/60 bg-muted/30 p-3">
              <p className="text-muted-foreground">Parts Cost</p>
              <p className="text-lg font-semibold text-primary">{formatPrice(problem.parts_cost)}</p>
            </div>
            <div className="rounded-md border border-border/60 bg-muted/30 p-3">
              <p className="text-muted-foreground">Labor Cost</p>
              <p className="text-lg font-semibold text-primary">{formatPrice(problem.labor_cost)}</p>
            </div>
            <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Expected Total</p>
              <p className="text-sm font-medium">
                {formatPrice(problem.estimated_cost_min)} - {formatPrice(problem.estimated_cost_max)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="size-5 text-primary" />
            10 Possible Causes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-2 sm:grid-cols-2">
            {problem.causes.map((cause, index) => (
              <li key={cause} className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                <span className="mr-2 font-semibold text-primary">{index + 1}.</span>
                {cause}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <ListChecks className="size-5 text-primary" />
            20 Solutions (Beginner-Friendly Step-by-Step)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="grid gap-2 md:grid-cols-2">
            {problem.solutions.map((solution) => (
              <li key={solution} className="rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-sm">
                {solution}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-amber-500/5">
        <CardContent className="flex items-start gap-3 p-4 text-sm text-amber-700 dark:text-amber-300">
          <ShieldAlert className="mt-0.5 size-4 shrink-0" />
          For safety-critical symptoms (brake warning, heavy smoke, stalling in traffic), avoid long drives and seek professional help immediately.
        </CardContent>
      </Card>

      <VideoSolutions
        problemTitle={problem.title}
        videoIds={problem.video_ids}
        videoKeywords={problem.video_keywords}
      />
    </div>
  );
}
