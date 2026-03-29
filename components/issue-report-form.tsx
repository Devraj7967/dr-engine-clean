"use client";

import { useState } from "react";
import { Upload, X, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, CATEGORY_INFO, CATEGORY_ORDER, DiagnosisResult } from "@/lib/types";
import { getSymptomsByCategory, diagnoseProblems } from "@/lib/data/problems";
import { cn } from "@/lib/utils";
import { DiagnosisResultCard } from "./diagnosis-result-card";

const categories: Category[] = CATEGORY_ORDER;

type FormState = "form" | "submitting" | "results";

export function IssueReportForm() {
  const [formState, setFormState] = useState<FormState>("form");
  const [selectedCategory, setSelectedCategory] = useState<Category | "">("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [results, setResults] = useState<DiagnosisResult[]>([]);

  const symptoms = selectedCategory ? getSymptomsByCategory(selectedCategory) : [];

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || selectedSymptoms.length === 0) return;
    
    setFormState("submitting");
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const diagnosisResults = diagnoseProblems(selectedCategory, selectedSymptoms);
    setResults(diagnosisResults);
    setFormState("results");
  };

  const handleReset = () => {
    setFormState("form");
    setSelectedCategory("");
    setSelectedSymptoms([]);
    setDescription("");
    setImagePreview(null);
    setResults([]);
  };

  const isValid = selectedCategory && selectedSymptoms.length > 0;

  if (formState === "submitting") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-16 gap-6">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="size-10 text-primary animate-spin" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold">Analyzing Your Issue</h3>
            <p className="text-muted-foreground mt-2">
              Our AI is analyzing your symptoms and description...
            </p>
          </div>
          <Progress value={66} className="w-48" />
        </CardContent>
      </Card>
    );
  }

  if (formState === "results") {
    return (
      <div className="flex flex-col gap-6">
        <Card className="border-green-500/50 bg-green-500/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-500/20">
              <CheckCircle className="size-5 text-green-500" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-500">Issue Report Analyzed</p>
              <p className="text-sm text-muted-foreground">
                We found {results.length} possible issues matching your report
              </p>
            </div>
          </CardContent>
        </Card>

        {results.length > 0 ? (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">AI Diagnosis Results</h3>
              {results.length > 0 && (
                <Badge variant="secondary" className="text-sm">
                  {Math.round(results[0].matchScore * 100)}% confidence
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {results.slice(0, 3).map((result, index) => (
                <DiagnosisResultCard
                  key={result.problem.id}
                  result={result}
                  rank={index + 1}
                />
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No Matching Issues Found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                We couldn&apos;t identify specific issues based on your report. 
                Please consult a professional mechanic for a detailed inspection.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          <Button variant="outline" onClick={handleReset}>
            Report Another Issue
          </Button>
          <Button onClick={() => window.location.href = "/garages"}>
            Find Nearby Garage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Report an Issue</CardTitle>
          <CardDescription>
            Describe your car problem and let our AI diagnose it
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* Category Selection */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => {
                setSelectedCategory(value as Category);
                setSelectedSymptoms([]);
              }}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select problem category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_INFO[cat].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Symptoms Selection */}
          {selectedCategory && (
            <div className="flex flex-col gap-3">
              <Label>Symptoms * (Select all that apply)</Label>
              <div className="grid gap-2 sm:grid-cols-2 max-h-60 overflow-y-auto p-1">
                {symptoms.map((symptom) => (
                  <div
                    key={symptom}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-all duration-200",
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
              <p className="text-xs text-muted-foreground">
                {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Additional Details (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your issue in more detail... When did it start? What were you doing when it happened?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <Label>Upload Image (Optional)</Label>
            {imagePreview ? (
              <div className="relative w-full max-w-xs">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 size-6"
                  onClick={handleRemoveImage}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Label
                  htmlFor="image-upload"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/50 p-8 transition-colors hover:border-primary/50 hover:bg-muted/50"
                >
                  <Upload className="size-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload an image
                  </span>
                </Label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          * Required fields
        </p>
        <Button type="submit" size="lg" disabled={!isValid}>
          <Send className="mr-2 size-4" />
          Analyze Issue
        </Button>
      </div>
    </form>
  );
}
