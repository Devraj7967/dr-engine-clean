"use client";

import { Search, Phone, MapPin, FileText, Clock, TrendingUp } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { QuickActionCard } from "@/components/quick-action-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Category, CATEGORY_ORDER } from "@/lib/types";
import { problems } from "@/lib/data/problems";

const categories: Category[] = CATEGORY_ORDER;

function getCategoryProblemCount(category: Category): number {
  return problems.filter((p) => p.category === category).length;
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Welcome Section */}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-balance">
          Welcome to AutoDiag
        </h1>
        <p className="text-muted-foreground text-pretty max-w-2xl">
          Your smart car diagnostic assistant. Browse by category, select symptoms, 
          and get instant diagnosis with cost estimates.
        </p>
      </section>

      {/* Stats Overview */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{problems.length}+</p>
              <p className="text-xs text-muted-foreground">Problems Database</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{CATEGORY_ORDER.length}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">10+</p>
              <p className="text-xs text-muted-foreground">Nearby Garages</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Clock className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-xs text-muted-foreground">Support Available</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Quick Actions</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickActionCard
            title="Diagnose Issue"
            description="Start diagnosing your car problem"
            icon={Search}
            href="/diagnose"
          />
          <QuickActionCard
            title="Emergency Help"
            description="Get immediate roadside assistance"
            icon={Phone}
            href="/emergency"
            variant="emergency"
          />
          <QuickActionCard
            title="Find Garage"
            description="Locate nearby service centers"
            icon={MapPin}
            href="/garages"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            Browse by Category
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a category to start diagnosis
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard
              key={category}
              category={category}
              problemCount={getCategoryProblemCount(category)}
            />
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight">How It Works</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                1
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2 text-base">Select Category</CardTitle>
              <p className="text-sm text-muted-foreground">
                Choose the system that seems to have the problem - Engine, Brakes, AC, etc.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                2
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2 text-base">Pick Symptoms</CardTitle>
              <p className="text-sm text-muted-foreground">
                Select all the symptoms you are experiencing from the checklist.
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                3
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2 text-base">Get Diagnosis</CardTitle>
              <p className="text-sm text-muted-foreground">
                View possible problems, causes, severity, and estimated repair costs.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
