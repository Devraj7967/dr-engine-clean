export type Category =
  | "engine"
  | "electrical"
  | "brakes"
  | "ac-cooling"
  | "transmission"
  | "suspension-steering"
  | "tyres-wheels"
  | "fuel-system"
  | "exhaust-system"
  | "body-interior"
  | "lighting-system"
  | "engine-cooling-system"
  | "hybrid-ev-system"
  | "emergency-issues"
  | "sensors-ecu";

export type Severity = "low" | "medium" | "high" | "critical";

export interface Problem {
  id: string;
  title: string;
  category: Category;
  symptoms: string[];
  causes: string[];
  solutions: string[];
  estimated_cost_min: number;
  estimated_cost_max: number;
  parts_cost: number;
  labor_cost: number;
  severity: Severity;
  video_keywords: string;
  video_ids: string[];
}

export interface Garage {
  id: string;
  name: string;
  rating: number;
  distance: string;
  services: string[];
  address: string;
  phone: string;
  openHours: string;
}

export interface DiagnosisResult {
  problem: Problem;
  matchScore: number;
  matchingSymptoms: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface IssueReport {
  id: string;
  category: Category;
  symptoms: string[];
  description: string;
  imageUrl?: string;
  createdAt: Date;
  diagnosis?: DiagnosisResult[];
}

export const CATEGORY_ORDER: Category[] = [
  "engine",
  "electrical",
  "brakes",
  "ac-cooling",
  "transmission",
  "suspension-steering",
  "tyres-wheels",
  "fuel-system",
  "exhaust-system",
  "body-interior",
  "lighting-system",
  "engine-cooling-system",
  "hybrid-ev-system",
  "emergency-issues",
  "sensors-ecu",
];

export const CATEGORY_INFO: Record<Category, { label: string; icon: string; description: string }> = {
  engine: {
    label: "Engine",
    icon: "engine",
    description: "Combustion, timing, and power delivery issues in the engine."
  },
  electrical: {
    label: "Electrical",
    icon: "zap",
    description: "Battery, alternator, starter, and wiring network failures."
  },
  brakes: {
    label: "Brakes",
    icon: "circle-stop",
    description: "Braking force, ABS, pedal feel, and stopping safety concerns."
  },
  "ac-cooling": {
    label: "AC & Cooling",
    icon: "snowflake",
    description: "Cabin cooling performance and climate control issues."
  },
  transmission: {
    label: "Transmission",
    icon: "cog",
    description: "Gear engagement, clutch, CVT, and drivetrain transfer problems."
  },
  "suspension-steering": {
    label: "Suspension & Steering",
    icon: "steering-wheel",
    description: "Ride quality, wheel alignment, steering, and cornering stability."
  },
  "tyres-wheels": {
    label: "Tyres & Wheels",
    icon: "circle-dot",
    description: "Tyre wear, pressure, balancing, puncture, and rim issues."
  },
  "fuel-system": {
    label: "Fuel System",
    icon: "fuel",
    description: "Fuel delivery, injectors, pump pressure, and combustion mix faults."
  },
  "exhaust-system": {
    label: "Exhaust System",
    icon: "wind",
    description: "Emission flow, catalytic converter, and exhaust leak concerns."
  },
  "body-interior": {
    label: "Body & Interior",
    icon: "armchair",
    description: "Doors, trims, cabin controls, and body hardware problems."
  },
  "lighting-system": {
    label: "Lighting System",
    icon: "lightbulb",
    description: "Headlights, tail lamps, signaling, and visibility electronics."
  },
  "engine-cooling-system": {
    label: "Engine Cooling System",
    icon: "thermometer",
    description: "Radiator, thermostat, fan, and coolant circulation diagnostics."
  },
  "hybrid-ev-system": {
    label: "Hybrid / EV System",
    icon: "battery-charging",
    description: "High-voltage battery, inverter, charging, and regen braking issues."
  },
  "emergency-issues": {
    label: "Emergency Issues",
    icon: "siren",
    description: "Immediate safety failures requiring urgent roadside support."
  },
  "sensors-ecu": {
    label: "Sensors & ECU",
    icon: "cpu",
    description: "Sensor readings, ECU logic, OBD faults, and calibration issues."
  },
};
