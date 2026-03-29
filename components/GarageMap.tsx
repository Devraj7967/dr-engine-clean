"use client";

import { useState } from "react";
import { Car, Loader2, LocateFixed, Search, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchKind = "garage" | "service_center" | "mechanic";

const SEARCH_CONFIG: Record<
  SearchKind,
  { label: string; nearQuery: string; nearMeQuery: string; icon: typeof Car }
> = {
  garage: {
    label: "Find Nearby Garages",
    nearQuery: "garage near",
    nearMeQuery: "garage near me",
    icon: Car,
  },
  service_center: {
    label: "Find Service Centers",
    nearQuery: "car service center near",
    nearMeQuery: "car service center near me",
    icon: Wrench,
  },
  mechanic: {
    label: "Find Mechanics",
    nearQuery: "car mechanic near",
    nearMeQuery: "car mechanic near me",
    icon: LocateFixed,
  },
};

function buildGoogleSearchUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function GarageMap() {
  const [manualLocation, setManualLocation] = useState("");
  const [openingMessage, setOpeningMessage] = useState<string | null>(null);

  const redirectToGoogle = (query: string) => {
    const url = buildGoogleSearchUrl(query);
    window.location.href = url;
  };

  const handleNearbySearch = (kind: SearchKind) => {
    const config = SEARCH_CONFIG[kind];
    setOpeningMessage("Opening Google Maps...");

    if (!navigator.geolocation) {
      redirectToGoogle(config.nearMeQuery);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        redirectToGoogle(`${config.nearQuery} ${lat},${lng}`);
      },
      () => {
        redirectToGoogle(config.nearMeQuery);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const handleManualSearch = () => {
    const query = manualLocation.trim();
    if (!query) {
      return;
    }

    setOpeningMessage("Opening Google Maps...");
    redirectToGoogle(`garage in ${query}`);
  };

  return (
    <section className="space-y-6 rounded-2xl border border-border/70 bg-card p-4 sm:p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Find Nearby Auto Help</h1>
        <p className="text-sm text-muted-foreground">
          Open live Google Maps results instantly for nearby garages, service centers, and mechanics.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(Object.keys(SEARCH_CONFIG) as SearchKind[]).map((kind) => {
          const config = SEARCH_CONFIG[kind];
          const Icon = config.icon;

          return (
            <Button
              key={kind}
              size="lg"
              className="h-14 text-base"
              onClick={() => handleNearbySearch(kind)}
            >
              <Icon className="mr-2 size-5" />
              {config.label}
            </Button>
          );
        })}
      </div>

      <div className="rounded-xl border border-border/70 bg-background p-3">
        <p className="mb-3 text-sm font-medium">Manual Location Search</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Enter city or location"
            value={manualLocation}
            onChange={(event) => setManualLocation(event.target.value)}
          />
          <Button onClick={handleManualSearch}>
            <Search className="mr-2 size-4" />
            Search City
          </Button>
        </div>
      </div>

      {openingMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background p-3 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          {openingMessage}
        </div>
      )}
    </section>
  );
}
