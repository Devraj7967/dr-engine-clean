"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, getSeverityColor } from "@/lib/data/problems";
import { CATEGORY_INFO, Problem } from "@/lib/types";

export function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <Link href={`/problems/${problem.id}`} className="group block">
      <Card className="h-full border-border/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight">{problem.title}</CardTitle>
            <Badge variant="outline" className={getSeverityColor(problem.severity)}>
              {problem.severity}
            </Badge>
          </div>
          <Badge variant="secondary" className="w-fit text-xs">
            {CATEGORY_INFO[problem.category].label}
          </Badge>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          <div>
            <h4 className="mb-1 text-xs font-medium text-muted-foreground">Symptoms</h4>
            <p className="line-clamp-2 text-sm text-foreground/90">
              {problem.symptoms.slice(0, 2).join(", ")}
              {problem.symptoms.length > 2 && ` +${problem.symptoms.length - 2} more`}
            </p>
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <span className="text-xs text-muted-foreground">Estimated Cost</span>
            <span className="font-semibold text-primary">
              {formatPrice(problem.estimated_cost_min)} - {formatPrice(problem.estimated_cost_max)}
            </span>
          </div>

          <div className="flex items-center justify-end pt-1 text-sm font-medium text-primary">
            <span className="rounded-md border border-primary/20 bg-primary/5 px-3 py-1 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              View Details
            </span>
            <ArrowRight className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
