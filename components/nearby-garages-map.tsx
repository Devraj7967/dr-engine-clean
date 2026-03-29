"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Clock,
  List,
  Loader2,
  Map as MapIcon,
  MapPin,
  Navigation,
  Search,
  Star,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface NearbyGaragesMapProps {
  className?: string;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface LiveGarage {
  id: string;
  name: string;
  rating: number;
  address: string;
  distanceKm: number;
  distanceLabel: string;
  openNow: boolean | null;
  lat: number;
  lng: number;
}

type ViewMode = "list" | "map";
type SortBy = "distance" | "rating";

type PlacesServiceStatus = {
  OK: string;
};

type PlacesServiceRequest = {
  location: unknown;
  radius: number;
  keyword: string;
  type: string;
};

type PlaceResult = {
  place_id?: string;
  name?: string;
  rating?: number;
  vicinity?: string;
  geometry?: {
    location?: {
      lat: () => number;
      lng: () => number;
    };
  };
  opening_hours?: {
    open_now?: boolean;
  };
};

type GoogleMapsLike = {
  maps: {
    Map: new (element: HTMLElement, options: Record<string, unknown>) => unknown;
    Marker: new (options: Record<string, unknown>) => {
      setMap: (map: unknown | null) => void;
    };
    LatLng: new (lat: number, lng: number) => unknown;
    places: {
      PlacesService: new (target: HTMLElement | unknown) => {
        nearbySearch: (
          request: PlacesServiceRequest,
          callback: (results: PlaceResult[] | null, status: string) => void
        ) => void;
      };
      PlacesServiceStatus: PlacesServiceStatus;
    };
  };
};

declare global {
  interface Window {
    google?: GoogleMapsLike;
  }
}

const FALLBACK_CITY = {
  label: "New Delhi",
  coords: { lat: 28.6139, lng: 77.209 },
};

let googleMapsLoader: Promise<GoogleMapsLike> | null = null;

function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }

  return `${km.toFixed(1)} km`;
}

function haversineDistance(from: Coordinates, to: Coordinates): number {
  const earthRadius = 6371;
  const deltaLat = ((to.lat - from.lat) * Math.PI) / 180;
  const deltaLng = ((to.lng - from.lng) * Math.PI) / 180;
  const fromLatRadians = (from.lat * Math.PI) / 180;
  const toLatRadians = (to.lat * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2) * Math.cos(fromLatRadians) * Math.cos(toLatRadians);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function loadGoogleMaps(apiKey: string): Promise<GoogleMapsLike> {
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (googleMapsLoader) {
    return googleMapsLoader;
  }

  googleMapsLoader = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-maps="true"]');

    if (existing) {
      existing.addEventListener("load", () => {
        if (window.google?.maps?.places) {
          resolve(window.google);
        } else {
          reject(new Error("Google Maps loaded without Places library."));
        }
      });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps script.")));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => {
      if (window.google?.maps?.places) {
        resolve(window.google);
      } else {
        reject(new Error("Google Maps loaded without Places library."));
      }
    };
    script.onerror = () => reject(new Error("Unable to load Google Maps JavaScript API."));
    document.head.appendChild(script);
  });

  return googleMapsLoader;
}

function getCurrentPosition(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => reject(new Error("Location permission denied.")),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

function nearbySearch(
  service: InstanceType<GoogleMapsLike["maps"]["places"]["PlacesService"]>,
  request: PlacesServiceRequest,
  successStatus: string
): Promise<PlaceResult[]> {
  return new Promise((resolve) => {
    service.nearbySearch(request, (results, status) => {
      if (status === successStatus && results) {
        resolve(results);
        return;
      }

      resolve([]);
    });
  });
}

export function NearbyGaragesMap({ className }: NearbyGaragesMapProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("distance");
  const [view, setView] = useState<ViewMode>("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState("Detecting location...");
  const [allPlaces, setAllPlaces] = useState<LiveGarage[]>([]);
  const [activeCenter, setActiveCenter] = useState<Coordinates | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<unknown | null>(null);
  const markerRefs = useRef<Array<{ setMap: (map: unknown | null) => void }>>([]);
  const googleRef = useRef<GoogleMapsLike | null>(null);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    let isMounted = true;

    async function initializeNearbySearch() {
      if (!googleMapsApiKey) {
        setError("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing. Add it to load live garages.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const google = await loadGoogleMaps(googleMapsApiKey);
        googleRef.current = google;

        let center = FALLBACK_CITY.coords;
        let label = `Fallback city: ${FALLBACK_CITY.label}`;

        try {
          center = await getCurrentPosition();
          label = `Live location: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`;
        } catch {
          setError(`Location permission denied. Showing results for ${FALLBACK_CITY.label}.`);
        }

        if (!isMounted) {
          return;
        }

        setActiveCenter(center);
        setLocationLabel(label);

        const service = new google.maps.places.PlacesService(document.createElement("div"));
        const statusOK = google.maps.places.PlacesServiceStatus.OK;
        const location = new google.maps.LatLng(center.lat, center.lng);
        const keywords = ["car repair", "garage", "mechanic near me"];

        const responses = await Promise.all(
          keywords.map((keyword) =>
            nearbySearch(
              service,
              {
                location,
                radius: 7000,
                keyword,
                type: "car_repair",
              },
              statusOK
            )
          )
        );

        if (!isMounted) {
          return;
        }

        const mergedMap = new Map<string, LiveGarage>();
        responses.flat().forEach((place) => {
          const placeLat = place.geometry?.location?.lat?.();
          const placeLng = place.geometry?.location?.lng?.();

          if (typeof placeLat !== "number" || typeof placeLng !== "number") {
            return;
          }

          const id = place.place_id || `${place.name}-${placeLat}-${placeLng}`;
          const distanceKm = haversineDistance(center, { lat: placeLat, lng: placeLng });
          const normalized: LiveGarage = {
            id,
            name: place.name || "Unnamed garage",
            rating: place.rating || 0,
            address: place.vicinity || "Address unavailable",
            distanceKm,
            distanceLabel: formatDistance(distanceKm),
            openNow:
              typeof place.opening_hours?.open_now === "boolean" ? place.opening_hours.open_now : null,
            lat: placeLat,
            lng: placeLng,
          };

          const existing = mergedMap.get(id);
          if (!existing || normalized.rating > existing.rating) {
            mergedMap.set(id, normalized);
          }
        });

        const normalizedPlaces = Array.from(mergedMap.values()).sort(
          (a, b) => a.distanceKm - b.distanceKm
        );
        setAllPlaces(normalizedPlaces);

        if (normalizedPlaces.length === 0) {
          setError("No nearby garages were found for this location. Try changing location and refresh.");
        }
      } catch (runtimeError) {
        setError(runtimeError instanceof Error ? runtimeError.message : "Unable to load nearby garages.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initializeNearbySearch();

    return () => {
      isMounted = false;
    };
  }, [googleMapsApiKey]);

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLowerCase();
    let next = allPlaces;

    if (query) {
      next = next.filter(
        (place) =>
          place.name.toLowerCase().includes(query) ||
          place.address.toLowerCase().includes(query) ||
          "car repair garage mechanic".includes(query)
      );
    }

    if (sortBy === "rating") {
      return [...next].sort((a, b) => b.rating - a.rating);
    }

    return [...next].sort((a, b) => a.distanceKm - b.distanceKm);
  }, [allPlaces, search, sortBy]);

  useEffect(() => {
    if (view !== "map" || !activeCenter || !googleRef.current || !mapContainerRef.current || loading) {
      return;
    }

    const google = googleRef.current;

    if (!mapRef.current) {
      mapRef.current = new google.maps.Map(mapContainerRef.current, {
        center: activeCenter,
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
    }

    markerRefs.current.forEach((marker) => marker.setMap(null));
    markerRefs.current = [];

    const userMarker = new google.maps.Marker({
      map: mapRef.current,
      position: activeCenter,
      title: "Your location",
      label: "You",
    });
    markerRefs.current.push(userMarker);

    filteredPlaces.forEach((place) => {
      const marker = new google.maps.Marker({
        map: mapRef.current,
        position: { lat: place.lat, lng: place.lng },
        title: place.name,
      });
      markerRefs.current.push(marker);
    });
  }, [activeCenter, filteredPlaces, loading, view]);

  const openDirections = (place: LiveGarage) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Nearby Garages</h1>
        <p className="text-muted-foreground">
          Real-time Google Places results for car repair, garage, and mechanic searches.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or address..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortBy)}>
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Nearest First</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex rounded-lg border border-border">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setView("list")}
            >
              <List className="size-4" />
            </Button>
            <Button
              variant={view === "map" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setView("map")}
            >
              <MapIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card className="border-border/70">
        <CardContent className="flex flex-col gap-1 p-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{locationLabel}</span>
          <span>{filteredPlaces.length} garages found</span>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="flex items-center gap-2 p-3 text-sm text-amber-700 dark:text-amber-300">
            <TriangleAlert className="size-4" />
            {error}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="space-y-3 p-4">
            <Skeleton className="h-[300px] w-full" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading nearby garages...
            </div>
          </CardContent>
        </Card>
      ) : view === "map" ? (
        <Card className="overflow-hidden border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Map View</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div ref={mapContainerRef} className="h-[430px] w-full bg-muted/40" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredPlaces.map((place) => (
            <Card
              key={place.id}
              className="group border-border/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{place.name}</CardTitle>
                    <p className="mt-1 flex items-start gap-1 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 size-3 shrink-0" />
                      <span>{place.address}</span>
                    </p>
                  </div>
                  <Badge variant="outline">{place.distanceLabel}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="size-4 fill-amber-500 text-amber-500" />
                    {place.rating > 0 ? place.rating.toFixed(1) : "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wrench className="size-4" />
                    Car Repair
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {place.openNow === null ? "Status unknown" : place.openNow ? "Open now" : "Closed now"}
                  </span>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" onClick={() => openDirections(place)}>
                    <Navigation className="mr-2 size-4" />
                    Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
