"use client";

import { useState } from "react";
import {
  Phone,
  Truck,
  Battery,
  CircleDot,
  X,
  Loader2,
  CheckCircle,
  MapPin,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type EmergencyService = "mechanic" | "towing" | "battery" | "tyre";

interface EmergencyOption {
  id: EmergencyService;
  title: string;
  description: string;
  icon: React.ElementType;
  eta: string;
  phone: string;
}

const emergencyOptions: EmergencyOption[] = [
  {
    id: "mechanic",
    title: "Call Mechanic",
    description: "Get a mobile mechanic to your location",
    icon: Phone,
    eta: "15-30 mins",
    phone: "+91 98765 11111",
  },
  {
    id: "towing",
    title: "Request Towing",
    description: "Tow your vehicle to nearest garage",
    icon: Truck,
    eta: "20-40 mins",
    phone: "+91 98765 22222",
  },
  {
    id: "battery",
    title: "Battery Jumpstart",
    description: "Quick battery jumpstart service",
    icon: Battery,
    eta: "10-20 mins",
    phone: "+91 98765 33333",
  },
  {
    id: "tyre",
    title: "Flat Tyre Help",
    description: "Tyre puncture repair or replacement",
    icon: CircleDot,
    eta: "15-25 mins",
    phone: "+91 98765 44444",
  },
];

type CallState = "idle" | "calling" | "connected" | "ended";

export default function EmergencyPage() {
  const [selectedService, setSelectedService] = useState<EmergencyOption | null>(null);
  const [callState, setCallState] = useState<CallState>("idle");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleServiceClick = (service: EmergencyOption) => {
    setSelectedService(service);
    setIsDialogOpen(true);
    setCallState("idle");
  };

  const handleCall = () => {
    setCallState("calling");
    // Simulate calling
    setTimeout(() => {
      setCallState("connected");
    }, 2000);
  };

  const handleEndCall = () => {
    setCallState("ended");
    setTimeout(() => {
      setIsDialogOpen(false);
      setCallState("idle");
    }, 1500);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCallState("idle");
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-6 text-destructive" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Emergency Help</h1>
            <p className="text-muted-foreground">
              Get immediate roadside assistance
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Alert Banner */}
      <Card className="border-destructive/50 bg-destructive/10">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/20">
            <Phone className="size-5 text-destructive" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-destructive">24/7 Emergency Support</p>
            <p className="text-sm text-muted-foreground">
              Our team is available round the clock for emergencies
            </p>
          </div>
          <Button variant="destructive" className="shrink-0">
            <Phone className="mr-2 size-4" />
            Call Now
          </Button>
        </CardContent>
      </Card>

      {/* Emergency Services */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Select Service</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {emergencyOptions.map((option) => (
            <Card
              key={option.id}
              className="group cursor-pointer border-2 border-border/50 transition-all duration-200 hover:border-destructive/50 hover:shadow-lg"
              onClick={() => handleServiceClick(option)}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive transition-transform duration-200 group-hover:scale-110">
                  <option.icon className="size-8" />
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <h3 className="text-lg font-semibold">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      ETA: {option.eta}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Safety Tips */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Safety Tips</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Stay Safe</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                If broken down on a highway, move to the shoulder and turn on hazard lights.
                Stay inside if traffic is heavy.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Share Location</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Share your live location with family or friends when waiting for help.
                Note nearby landmarks.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Keep Documents Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Have your vehicle registration, insurance, and ID ready for the service provider.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedService && <selectedService.icon className="size-5 text-destructive" />}
              {selectedService?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedService?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-8">
            {callState === "idle" && (
              <>
                <div className="flex size-24 items-center justify-center rounded-full bg-destructive/10">
                  <Phone className="size-12 text-destructive" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{selectedService?.phone}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ETA: {selectedService?.eta}
                  </p>
                </div>
                <Button
                  size="lg"
                  className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  onClick={handleCall}
                >
                  <Phone className="mr-2 size-5" />
                  Call Now
                </Button>
              </>
            )}

            {callState === "calling" && (
              <>
                <div className="flex size-24 items-center justify-center rounded-full bg-destructive/10 animate-pulse">
                  <Phone className="size-12 text-destructive" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">Calling...</p>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Connecting to {selectedService?.title}
                  </p>
                </div>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive/10"
                  onClick={handleEndCall}
                >
                  <X className="mr-2 size-5" />
                  Cancel
                </Button>
              </>
            )}

            {callState === "connected" && (
              <>
                <div className="flex size-24 items-center justify-center rounded-full bg-green-500/10">
                  <Phone className="size-12 text-green-500" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-500">Connected</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Speaking with {selectedService?.title}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <MapPin className="size-4" />
                  <span>Sharing your location...</span>
                </div>
                <Button
                  size="lg"
                  variant="destructive"
                  className="w-full"
                  onClick={handleEndCall}
                >
                  <X className="mr-2 size-5" />
                  End Call
                </Button>
              </>
            )}

            {callState === "ended" && (
              <>
                <div className="flex size-24 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="size-12 text-green-500" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-green-500">Help is on the way!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ETA: {selectedService?.eta}
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
