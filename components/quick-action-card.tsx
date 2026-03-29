"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  variant?: "default" | "emergency";
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  variant = "default",
}: QuickActionCardProps) {
  return (
    <Link href={href}>
      <Card
        className={cn(
          "group relative overflow-hidden transition-all duration-300 hover:shadow-lg",
          variant === "emergency"
            ? "border-destructive/50 bg-destructive/10 hover:border-destructive hover:bg-destructive/20"
            : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card"
        )}
      >
        <CardContent className="flex items-center gap-4 p-5">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
              variant === "emergency"
                ? "bg-destructive/20 text-destructive"
                : "bg-primary/10 text-primary"
            )}
          >
            <Icon className="size-6" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="font-semibold tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
