"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Armchair,
  BatteryCharging,
  Car,
  CarFront,
  CircleDot,
  CircleStop,
  Cog,
  Cpu,
  Fuel,
  Gauge,
  Home,
  Lightbulb,
  MapPin,
  Phone,
  Search,
  Siren,
  Snowflake,
  Thermometer,
  User,
  Wind,
  FileText,
  LogOut,
  Zap,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CATEGORY_INFO, CATEGORY_ORDER, Category } from "@/lib/types";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    title: "Diagnose",
    href: "/diagnose",
    icon: Search,
  },
  {
    title: "Problems",
    href: "/problems",
    icon: FileText,
  },
  {
    title: "Emergency",
    href: "/emergency",
    icon: Phone,
  },
  {
    title: "Garages",
    href: "/garages",
    icon: MapPin,
  },
];

const categoryIconMap = {
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
} as const;

const categoryNavItems = CATEGORY_ORDER.map((category: Category) => {
  const info = CATEGORY_INFO[category];
  const icon = categoryIconMap[info.icon as keyof typeof categoryIconMap] || Gauge;

  return {
    title: info.label,
    href: `/diagnose?category=${category}`,
    icon,
  };
});

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userName = session?.user?.name || "Guest User";
  const userEmail = session?.user?.email || "No email";

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
            <Car className="size-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight">Dr. Engine</span>
            <span className="text-xs text-muted-foreground">Smart Car Assistant</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Quick Diagnose</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categoryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Profile">
              <Link href="/profile" className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    <User className="size-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{userName}</span>
                  <span className="text-xs text-muted-foreground">{userEmail}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sign Out" onClick={() => signOut({ callbackUrl: "/login" })}>
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
