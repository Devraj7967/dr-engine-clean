"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProblemCard } from "@/components/problem-card";
import { problems } from "@/lib/data/problems";
import { Category, CATEGORY_INFO, CATEGORY_ORDER, Severity } from "@/lib/types";

const categories: Category[] = CATEGORY_ORDER;
const severities: Severity[] = ["low", "medium", "high", "critical"];
const PAGE_SIZE = 18;

type SortBy = "title" | "cost-low" | "cost-high" | "severity";
type CostFilter = "all" | "budget" | "standard" | "major" | "extensive";

function ProblemCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <div className="flex items-center justify-between border-t pt-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      </CardContent>
    </Card>
  );
}

function labelForCostFilter(costFilter: CostFilter): string {
  switch (costFilter) {
    case "budget":
      return "Budget (< ₹8k)";
    case "standard":
      return "Standard (₹8k-₹20k)";
    case "major":
      return "Major (₹20k-₹50k)";
    case "extensive":
      return "Extensive (> ₹50k)";
    default:
      return "All costs";
  }
}

function includeByCost(problemMaxCost: number, filter: CostFilter): boolean {
  switch (filter) {
    case "budget":
      return problemMaxCost < 8000;
    case "standard":
      return problemMaxCost >= 8000 && problemMaxCost <= 20000;
    case "major":
      return problemMaxCost > 20000 && problemMaxCost <= 50000;
    case "extensive":
      return problemMaxCost > 50000;
    default:
      return true;
  }
}

export default function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<Severity[]>([]);
  const [costFilter, setCostFilter] = useState<CostFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("title");
  const [isReady, setIsReady] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setIsReady(true);
  }, []);

  const filteredProblems = useMemo(() => {
    let filtered = problems;

    if (search) {
      const lowercaseSearch = search.toLowerCase();
      filtered = filtered.filter(
        (problem) =>
          problem.title.toLowerCase().includes(lowercaseSearch) ||
          problem.symptoms.some((symptom) => symptom.toLowerCase().includes(lowercaseSearch)) ||
          problem.causes.some((cause) => cause.toLowerCase().includes(lowercaseSearch))
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((problem) => selectedCategories.includes(problem.category));
    }

    if (selectedSeverities.length > 0) {
      filtered = filtered.filter((problem) => selectedSeverities.includes(problem.severity));
    }

    filtered = filtered.filter((problem) => includeByCost(problem.estimated_cost_max, costFilter));

    switch (sortBy) {
      case "title":
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "cost-low":
        filtered = [...filtered].sort((a, b) => a.estimated_cost_min - b.estimated_cost_min);
        break;
      case "cost-high":
        filtered = [...filtered].sort((a, b) => b.estimated_cost_max - a.estimated_cost_max);
        break;
      case "severity": {
        const severityOrder: Record<Severity, number> = {
          critical: 0,
          high: 1,
          medium: 2,
          low: 3,
        };

        filtered = [...filtered].sort(
          (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
        );
        break;
      }
      default:
        break;
    }

    return filtered;
  }, [search, selectedCategories, selectedSeverities, costFilter, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategories, selectedSeverities, costFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / PAGE_SIZE));

  useEffect(() => {
    setCurrentPage((previous) => Math.min(previous, totalPages));
  }, [totalPages]);

  const paginatedProblems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredProblems.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filteredProblems]);

  const toggleCategory = (category: Category) => {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    );
  };

  const toggleSeverity = (severity: Severity) => {
    setSelectedSeverities((previous) =>
      previous.includes(severity)
        ? previous.filter((item) => item !== severity)
        : [...previous, severity]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSeverities([]);
    setCostFilter("all");
    setSearch("");
  };

  const activeFiltersCount =
    selectedCategories.length + selectedSeverities.length + (costFilter === "all" ? 0 : 1);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Problems Database</h1>
        <p className="text-muted-foreground">
          Browse {problems.length}+ automobile issues with beginner-friendly diagnostics and repair guidance.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search problems, symptoms, causes..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
            <SelectTrigger className="w-[190px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Alphabetical</SelectItem>
              <SelectItem value="cost-low">Cost: Low to High</SelectItem>
              <SelectItem value="cost-high">Cost: High to Low</SelectItem>
              <SelectItem value="severity">Severity</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <SlidersHorizontal className="mr-2 size-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 flex size-5 items-center justify-center p-0">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Filter issues by category, severity, and budget range.</SheetDescription>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <h4 className="font-semibold">Category</h4>
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-3">
                      <Checkbox
                        id={`cat-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => toggleCategory(category)}
                      />
                      <Label htmlFor={`cat-${category}`} className="cursor-pointer">
                        {CATEGORY_INFO[category].label}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="font-semibold">Severity</h4>
                  {severities.map((severity) => (
                    <div key={severity} className="flex items-center gap-3">
                      <Checkbox
                        id={`sev-${severity}`}
                        checked={selectedSeverities.includes(severity)}
                        onCheckedChange={() => toggleSeverity(severity)}
                      />
                      <Label htmlFor={`sev-${severity}`} className="cursor-pointer capitalize">
                        {severity}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <h4 className="font-semibold">Repair Budget</h4>
                  <Select value={costFilter} onValueChange={(value) => setCostFilter(value as CostFilter)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All costs</SelectItem>
                      <SelectItem value="budget">Budget (&lt; ₹8,000)</SelectItem>
                      <SelectItem value="standard">Standard (₹8,000-₹20,000)</SelectItem>
                      <SelectItem value="major">Major (₹20,000-₹50,000)</SelectItem>
                      <SelectItem value="extensive">Extensive (&gt; ₹50,000)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              {CATEGORY_INFO[category].label} x
            </Badge>
          ))}
          {selectedSeverities.map((severity) => (
            <Badge
              key={severity}
              variant="secondary"
              className="cursor-pointer capitalize"
              onClick={() => toggleSeverity(severity)}
            >
              {severity} x
            </Badge>
          ))}
          {costFilter !== "all" && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setCostFilter("all")}>
              {labelForCostFilter(costFilter)} x
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
            Clear all
          </Button>
        </div>
      )}

      <p className="text-sm text-muted-foreground">
        Showing {paginatedProblems.length} of {filteredProblems.length} filtered problems (total {problems.length})
      </p>

      {!isReady ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProblemCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      )}

      {isReady && filteredProblems.length > PAGE_SIZE && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {isReady && filteredProblems.length === 0 && (
        <Card className="py-12">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <Filter className="mb-4 size-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">No problems found</h3>
            <p className="mt-2 text-muted-foreground">Try adjusting your search or filters.</p>
            <Button onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
