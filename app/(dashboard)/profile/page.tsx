"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Car,
  Calendar,
  Edit,
  Save,
  Clock,
  Bookmark,
  History,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 98765 12345",
  joinedDate: "January 2024",
  vehicles: [
    {
      id: "v1",
      make: "Maruti Suzuki",
      model: "Swift",
      year: "2021",
      regNumber: "DL 01 AB 1234",
    },
    {
      id: "v2",
      make: "Hyundai",
      model: "Creta",
      year: "2023",
      regNumber: "DL 02 CD 5678",
    },
  ],
  recentDiagnosis: [
    {
      id: "d1",
      problem: "Engine Overheating",
      date: "2 days ago",
      severity: "high",
    },
    {
      id: "d2",
      problem: "AC Not Cooling",
      date: "1 week ago",
      severity: "medium",
    },
    {
      id: "d3",
      problem: "Brake Noise",
      date: "2 weeks ago",
      severity: "low",
    },
  ],
  savedProblems: [
    { id: "s1", title: "Engine Misfiring", category: "Engine" },
    { id: "s2", title: "Battery Issues", category: "Electrical" },
  ],
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(mockUser.name);
  const [email, setEmail] = useState(mockUser.email);
  const [phone, setPhone] = useState(mockUser.phone);

  const handleSave = () => {
    setIsEditing(false);
    // Save logic would go here
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and view your activity
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Account</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? (
                  <>
                    <Save className="mr-2 size-4" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit className="mr-2 size-4" />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <Avatar className="size-24">
              <AvatarImage src="/placeholder-avatar.jpg" alt={mockUser.name} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {mockUser.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>

            <div className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="size-4 text-muted-foreground" />
                  Name
                </Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="size-4 text-muted-foreground" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="size-4 text-muted-foreground" />
                  Phone
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                ) : (
                  <p className="text-sm">{phone}</p>
                )}
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                Member since {mockUser.joinedDate}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Section */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="vehicles" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="vehicles">
                <Car className="mr-2 size-4" />
                Vehicles
              </TabsTrigger>
              <TabsTrigger value="history">
                <History className="mr-2 size-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="saved">
                <Bookmark className="mr-2 size-4" />
                Saved
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vehicles" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">My Vehicles</CardTitle>
                    <Button size="sm">
                      <Car className="mr-2 size-4" />
                      Add Vehicle
                    </Button>
                  </div>
                  <CardDescription>
                    Manage your registered vehicles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {mockUser.vehicles.map((vehicle) => (
                      <Card key={vehicle.id} className="border-border/50">
                        <CardContent className="flex items-center gap-4 p-4">
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Car className="size-6" />
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <p className="font-semibold">
                              {vehicle.make} {vehicle.model}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {vehicle.year} • {vehicle.regNumber}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Diagnoses</CardTitle>
                  <CardDescription>
                    Your recent diagnostic history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUser.recentDiagnosis.map((diagnosis) => (
                      <div
                        key={diagnosis.id}
                        className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 items-center justify-center rounded-full bg-muted">
                            <History className="size-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{diagnosis.problem}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="size-3" />
                              {diagnosis.date}
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            diagnosis.severity === "high"
                              ? "text-red-500 bg-red-500/10"
                              : diagnosis.severity === "medium"
                              ? "text-amber-500 bg-amber-500/10"
                              : "text-emerald-500 bg-emerald-500/10"
                          }
                        >
                          {diagnosis.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Saved Problems</CardTitle>
                  <CardDescription>
                    Problems you have bookmarked for reference
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUser.savedProblems.map((problem) => (
                      <div
                        key={problem.id}
                        className="flex items-center justify-between rounded-lg border border-border/50 p-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                            <Bookmark className="size-5 text-primary fill-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{problem.title}</p>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {problem.category}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
