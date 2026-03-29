"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  Bookmark,
  ChevronDown,
  ChevronUp,
  IndianRupee,
  ListChecks,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DiagnosisResult, Severity } from "@/lib/types";
import { formatPrice, getSeverityColor } from "@/lib/data/problems";
import { cn } from "@/lib/utils";
import { VideoSolutions } from "@/components/VideoSolutions";

interface DiagnosisResultCardProps {
  result: DiagnosisResult;
  rank: number;
}

const severityLabels: Record<Severity, string> = {
  low: "Low Severity",
  medium: "Medium Severity",
  high: "High Severity",
  critical: "Critical Severity",
};

export function DiagnosisResultCard({ result, rank }: DiagnosisResultCardProps) {
  const [expanded, setExpanded] = useState(rank === 1);
  const [bookmarked, setBookmarked] = useState(false);

  const { problem, matchScore, matchingSymptoms } = result;
  const confidencePercent = Math.round(matchScore * 100);
  const storageKey = `autodiag-bookmark-${problem.id}`;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setBookmarked(window.localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  const toggleBookmark = (event: React.MouseEvent) => {
    event.stopPropagation();
    setBookmarked((current) => {
      const next = !current;
      if (typeof window !== "undefined") {
        if (next) {
          window.localStorage.setItem(storageKey, "1");
        } else {
          window.localStorage.removeItem(storageKey);
        }
      }
      return next;
    });
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200",
        rank === 1 && "border-primary/50 shadow-lg shadow-primary/5"
      )}
    >
      <CardHeader className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-bold",
                rank === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              {rank}
            </div>

            <div className="flex flex-col gap-2">
              <CardTitle className="text-lg">{problem.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={getSeverityColor(problem.severity)}>
                  {severityLabels[problem.severity]}
                </Badge>
                <Badge variant="secondary">{confidencePercent}% match</Badge>
                <Badge variant="secondary">
                  {formatPrice(problem.estimated_cost_min)} - {formatPrice(problem.estimated_cost_max)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-8" onClick={toggleBookmark}>
              <Bookmark className={cn("size-4", bookmarked && "fill-primary text-primary")} />
            </Button>
            {expanded ? (
              <ChevronUp className="size-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="border-t pt-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <h4 className="flex items-center gap-2 font-semibold">
                <AlertCircle className="size-4 text-primary" />
                Matching Symptoms
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchingSymptoms.map((symptom) => (
                  <Badge key={symptom} variant="outline" className="bg-primary/5">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="font-semibold">Match Confidence</h4>
              <div className="flex flex-col gap-2">
                <Progress value={confidencePercent} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  {matchingSymptoms.length} of {problem.symptoms.length} symptoms matched
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="flex items-center gap-2 font-semibold">
                <Wrench className="size-4 text-primary" />
                10 Possible Causes
              </h4>
              <ol className="space-y-1 text-sm text-muted-foreground">
                {problem.causes.map((cause, index) => (
                  <li key={cause} className="flex items-start gap-2">
                    <span className="text-primary">{index + 1}.</span>
                    <span>{cause}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="flex items-center gap-2 font-semibold">
                <IndianRupee className="size-4 text-primary" />
                Estimated Cost
              </h4>
              <div className="rounded-lg bg-muted/50 p-4">
                <div className="text-2xl font-bold text-primary">
                  {formatPrice(problem.estimated_cost_min)} - {formatPrice(problem.estimated_cost_max)}
                </div>
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Parts</span>
                    <span>{formatPrice(problem.parts_cost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Labor</span>
                    <span>{formatPrice(problem.labor_cost)}</span>
                  </div>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href={`/problems/${problem.id}`}>View Details</Link>
              </Button>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold">
                  <ListChecks className="size-4 text-primary" />
                  20 Beginner-Friendly Solutions
                </h4>
                <ol className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
                  {problem.solutions.map((solution, index) => (
                    <li key={solution} className="flex items-start gap-2">
                      <span className="text-primary">{index + 1}.</span>
                      <span>{solution}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="lg:col-span-2">
              <VideoSolutions
                problemTitle={problem.title}
                videoIds={problem.video_ids}
                videoKeywords={problem.video_keywords}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
