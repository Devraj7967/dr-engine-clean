"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Category, CATEGORY_INFO, CATEGORY_ORDER, DiagnosisResult } from "@/lib/types";
import { getSymptomsByCategory, diagnoseProblems } from "@/lib/data/problems";
import { cn } from "@/lib/utils";
import { DiagnosisResultCard } from "./diagnosis-result-card";

const categories: Category[] = CATEGORY_ORDER;

type Step = "category" | "symptoms" | "results";

export function DiagnosisWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const initialCategory = categoryParam && categories.includes(categoryParam as Category)
    ? (categoryParam as Category)
    : null;

  const [step, setStep] = useState<Step>(initialCategory ? "symptoms" : "category");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(initialCategory);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [results, setResults] = useState<DiagnosisResult[]>([]);

  const symptoms = selectedCategory ? getSymptomsByCategory(selectedCategory) : [];

  useEffect(() => {
    if (initialCategory && categories.includes(initialCategory)) {
      setSelectedCategory(initialCategory);
      setStep("symptoms");
    }
  }, [initialCategory]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSelectedSymptoms([]);
    setStep("symptoms");
  };

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleDiagnose = () => {
    if (!selectedCategory || selectedSymptoms.length === 0) return;
    
    const diagnosisResults = diagnoseProblems(selectedCategory, selectedSymptoms).slice(0, 3);
    setResults(diagnosisResults);
    setStep("results");
  };

  const handleBack = () => {
    if (step === "symptoms") {
      setStep("category");
      setSelectedCategory(null);
      setSelectedSymptoms([]);
    } else if (step === "results") {
      setStep("symptoms");
    }
  };

  const handleReset = () => {
    setStep("category");
    setSelectedCategory(null);
    setSelectedSymptoms([]);
    setResults([]);
    router.push("/diagnose");
  };

  const progress = step === "category" ? 33 : step === "symptoms" ? 66 : 100;

  return (
    <div className="flex flex-col gap-6">
      {/* Progress Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step !== "category" && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={cn(step === "category" && "text-primary font-medium")}>
              Category
            </span>
            <ChevronRight className="size-4" />
            <span className={cn(step === "symptoms" && "text-primary font-medium")}>
              Symptoms
            </span>
            <ChevronRight className="size-4" />
            <span className={cn(step === "results" && "text-primary font-medium")}>
              Results
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step: Category Selection */}
      {step === "category" && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Select Category</h2>
            <p className="text-muted-foreground mt-1">
              Choose the system that seems to have the problem
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const info = CATEGORY_INFO[category];
              return (
                <Card
                  key={category}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md",
                    selectedCategory === category && "border-primary bg-primary/5"
                  )}
                  onClick={() => handleCategorySelect(category)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{info.label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{info.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Step: Symptom Selection */}
      {step === "symptoms" && selectedCategory && (
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">{CATEGORY_INFO[selectedCategory].label}</Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Select Symptoms</h2>
            <p className="text-muted-foreground mt-1">
              Check all the symptoms you are experiencing
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {symptoms.map((symptom) => (
                  <div
                    key={symptom}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-4 cursor-pointer transition-all duration-200",
                      selectedSymptoms.includes(symptom)
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/30"
                    )}
                    onClick={() => handleSymptomToggle(symptom)}
                  >
                    <Checkbox
                      checked={selectedSymptoms.includes(symptom)}
                      onCheckedChange={() => handleSymptomToggle(symptom)}
                    />
                    <span className="text-sm">{symptom}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? "s" : ""} selected
            </p>
            <Button
              onClick={handleDiagnose}
              disabled={selectedSymptoms.length === 0}
              size="lg"
            >
              Diagnose
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step: Results */}
      {step === "results" && (
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Diagnosis Results</h2>
            <p className="text-muted-foreground mt-1">
              Based on your symptoms, here are the most likely issues
            </p>
          </div>

          {results.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="size-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No Matching Problems Found</h3>
                <p className="text-muted-foreground mt-2 max-w-md">
                  We couldn&apos;t find any problems matching your symptoms. Try selecting different symptoms or consult a mechanic.
                </p>
                <Button onClick={handleReset} className="mt-6">
                  Start Over
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
                <Check className="size-5 text-primary" />
                <span className="text-sm">
                  Found top <strong>{results.length}</strong> matched problem{results.length !== 1 ? "s" : ""} for your selected symptoms
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {results.map((result, index) => (
                  <DiagnosisResultCard
                    key={result.problem.id}
                    result={result}
                    rank={index + 1}
                  />
                ))}
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={handleReset}>
                  Start New Diagnosis
                </Button>
                <Button onClick={() => router.push("/garages")}>
                  Find Nearby Garage
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
