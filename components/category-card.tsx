"use client";

import Link from "next/link";
import {
  LucideIcon,
  Gauge,
  Zap,
  CircleStop,
  Snowflake,
  Cog,
  CarFront,
  CircleDot,
  Fuel,
  Wind,
  Armchair,
  Lightbulb,
  Thermometer,
  BatteryCharging,
  Siren,
  Cpu,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Category, CATEGORY_INFO } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  engine: Gauge,
  zap: Zap,
  "circle-stop": CircleStop,
  snowflake: Snowflake,
  cog: Cog,
  "steering-wheel": CarFront,
  "circle-dot": CircleDot,
  fuel: Fuel,
  wind: Wind,
  armchair: Armchair,
  lightbulb: Lightbulb,
  thermometer: Thermometer,
  "battery-charging": BatteryCharging,
  siren: Siren,
  cpu: Cpu,
};

interface CategoryCardProps {
  category: Category;
  problemCount?: number;
}

export function CategoryCard({ category, problemCount }: CategoryCardProps) {
  const info = CATEGORY_INFO[category];
  const Icon = iconMap[info.icon] || Gauge;

  return (
    <Link href={`/diagnose?category=${category}`}>
      <Card className="group relative overflow-hidden border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/50 hover:bg-card hover:shadow-lg hover:shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <CardContent className="relative flex flex-col items-center gap-4 p-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
            <Icon className="size-7" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold tracking-tight">{info.label}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {info.description}
            </p>
          </div>
          {problemCount !== undefined && (
            <div className="mt-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {problemCount} issues
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
