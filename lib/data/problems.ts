import { CATEGORY_INFO, Category, Problem, Severity } from "../types";

interface CategoryConfig {
  prefix: string;
  baseMin: number;
  baseMax: number;
  partsBase: number;
  laborBase: number;
  focusPool: Array<[string, string, string]>;
  titles: string[];
  symptomPool: string[];
}

const severityCycle: Severity[] = ["low", "medium", "high", "critical", "high", "medium", "low", "high"];

const categoryConfigs: Record<Category, CategoryConfig> = {
  engine: {
    prefix: "eng",
    baseMin: 1800,
    baseMax: 26000,
    partsBase: 12000,
    laborBase: 6000,
    focusPool: [
      ["coolant", "radiator", "thermostat"],
      ["spark plugs", "ignition coil", "injector"],
      ["engine oil", "timing chain", "crank pulley"],
    ],
    titles: [
      "Engine Overheating in Traffic",
      "Engine Misfire Under Acceleration",
      "Rough Idle at Cold Start",
      "Knocking Noise During Load",
      "Engine Hesitation After Start",
      "Excessive Engine Vibration",
      "Loss of Power on Highway",
      "Frequent Engine Stall at Idle",
    ],
    symptomPool: [
      "Engine temperature climbs above normal in city traffic.",
      "RPM fluctuates while idling at a traffic signal.",
      "Acceleration feels weak while overtaking.",
      "A burning smell appears after a long drive.",
      "Check engine indicator flashes intermittently.",
      "Fuel economy drops compared with recent average.",
    ],
  },
  electrical: {
    prefix: "ele",
    baseMin: 1200,
    baseMax: 22000,
    partsBase: 9000,
    laborBase: 4000,
    focusPool: [
      ["alternator", "battery terminals", "ground strap"],
      ["starter relay", "fuse box", "wiring harness"],
      ["battery health", "charging line", "ECU power feed"],
    ],
    titles: [
      "Battery Not Charging While Driving",
      "Starter Clicking but No Crank",
      "Intermittent No-Start Condition",
      "Dashboard Lights Dimming Randomly",
      "Frequent Battery Drain Overnight",
      "Power Windows Losing Voltage",
      "Fuse Blowing in Cabin Circuit",
      "Alternator Overcharging Warning",
    ],
    symptomPool: [
      "Vehicle struggles to crank in the morning.",
      "Electrical accessories reset while driving.",
      "Battery warning icon appears intermittently.",
      "Headlights dim at idle but brighten when revving.",
      "Central locking behaves inconsistently.",
      "Power outlets stop working suddenly.",
    ],
  },
  brakes: {
    prefix: "brk",
    baseMin: 1600,
    baseMax: 28000,
    partsBase: 11000,
    laborBase: 5000,
    focusPool: [
      ["brake fluid", "master cylinder", "brake lines"],
      ["ABS sensor", "tone ring", "ABS module"],
      ["brake pads", "caliper slide", "brake booster"],
    ],
    titles: [
      "Soft Brake Pedal Feel",
      "ABS Warning Light On",
      "Brake Pedal Sinks at Stop",
      "Grinding Noise While Braking",
      "Vehicle Pulls During Braking",
      "Brake Fade After Repeated Stops",
      "Handbrake Weak Holding Power",
      "Brake Vibration at High Speed",
    ],
    symptomPool: [
      "Brake pedal travel increases more than usual.",
      "Stopping distance feels longer than normal.",
      "ABS light remains active after restart.",
      "Brake response becomes inconsistent in rain.",
      "Squeal or grinding appears while braking.",
      "Vehicle drifts left or right under braking.",
    ],
  },
  "ac-cooling": {
    prefix: "acc",
    baseMin: 900,
    baseMax: 26000,
    partsBase: 10000,
    laborBase: 4200,
    focusPool: [
      ["refrigerant", "compressor", "condenser"],
      ["blower motor", "cabin filter", "expansion valve"],
      ["AC relay", "climate sensor", "cooling fan"],
    ],
    titles: [
      "AC Not Cooling in Summer Traffic",
      "Blower Fan Not Working",
      "AC Cooling Drops After 20 Minutes",
      "AC Compressor Clutch Not Engaging",
      "Cabin Airflow Very Weak",
      "AC Producing Musty Smell",
      "Intermittent AC Cooling on Highway",
      "Dual-Zone Temperature Imbalance",
    ],
    symptomPool: [
      "Cabin remains warm despite low temperature setting.",
      "Airflow is weak at all fan speeds.",
      "Cooling improves briefly after restart.",
      "Compressor cut-in sound is missing.",
      "Fogging persists on windshield in humid weather.",
      "Cabin odor appears when AC is switched on.",
    ],
  },
  transmission: {
    prefix: "trn",
    baseMin: 3000,
    baseMax: 70000,
    partsBase: 26000,
    laborBase: 12000,
    focusPool: [
      ["transmission fluid", "valve body", "shift solenoid"],
      ["clutch pack", "torque converter", "line pressure"],
      ["gear selector", "TCM", "input speed sensor"],
    ],
    titles: [
      "Gear Slipping Under Load",
      "Delayed Drive Engagement",
      "Harsh Gear Shift at Low Speed",
      "Transmission Overheat Warning",
      "Reverse Gear Takes Too Long",
      "CVT Jerk During Acceleration",
      "Gear Indicator Mismatch Error",
      "Transmission Whine on Cruise",
    ],
    symptomPool: [
      "Gear engagement is delayed after selecting drive.",
      "RPM rises without proportional speed increase.",
      "Shift quality becomes jerky in city traffic.",
      "Transmission warning appears after a long drive.",
      "Vehicle hesitates while moving from standstill.",
      "Shudder is felt during light acceleration.",
    ],
  },
  "suspension-steering": {
    prefix: "sus",
    baseMin: 1200,
    baseMax: 26000,
    partsBase: 12000,
    laborBase: 5000,
    focusPool: [
      ["tie rod", "control arm bushing", "strut mount"],
      ["wheel balance", "lower arm", "steering rack"],
      ["sway bar link", "ball joint", "alignment settings"],
    ],
    titles: [
      "Steering Wheel Vibration",
      "Clunk Noise Over Speed Breakers",
      "Vehicle Pulls to One Side",
      "Steering Feels Too Heavy",
      "Front Suspension Bottoming Out",
      "Rear Suspension Squeaking",
      "Uneven Ride Height on One Side",
      "Loose Steering Play at Center",
    ],
    symptomPool: [
      "Steering needs frequent correction on straight roads.",
      "Vibration increases as speed rises above 60 km/h.",
      "Clunk sound appears on potholes and breakers.",
      "Tyre wear pattern looks uneven at edges.",
      "Vehicle bounces excessively after bumps.",
      "Steering effort changes suddenly while turning.",
    ],
  },
  "tyres-wheels": {
    prefix: "tyr",
    baseMin: 600,
    baseMax: 14000,
    partsBase: 7000,
    laborBase: 2200,
    focusPool: [
      ["air pressure", "wheel rim", "valve stem"],
      ["tread depth", "alignment angle", "balancing weights"],
      ["TPMS sensor", "bead seal", "wheel hub"],
    ],
    titles: [
      "Uneven Tyre Wear Pattern",
      "Slow Tyre Pressure Loss",
      "Steering Shake Due to Wheel Imbalance",
      "TPMS Warning Not Clearing",
      "Tyre Noise at Highway Speed",
      "Wheel Rim Bend After Pothole",
      "Repeated Puncture on Same Tyre",
      "Premature Tyre Shoulder Wear",
    ],
    symptomPool: [
      "Tyre pressure drops within a few days.",
      "Steering shakes on smooth roads.",
      "TPMS alert returns after air refill.",
      "Tyre noise gets louder with speed.",
      "Visible wear appears uneven across tread.",
      "Vehicle drifts slightly despite alignment.",
    ],
  },
  "fuel-system": {
    prefix: "ful",
    baseMin: 1000,
    baseMax: 26000,
    partsBase: 12000,
    laborBase: 4200,
    focusPool: [
      ["fuel pump", "fuel filter", "injector"],
      ["fuel rail", "pressure regulator", "intake manifold"],
      ["throttle body", "air filter", "MAF sensor"],
    ],
    titles: [
      "Poor Fuel Economy Suddenly",
      "Hard Start After Overnight Park",
      "Engine Hesitation on Acceleration",
      "Fuel Smell Near Engine Bay",
      "Jerking at Constant Speed",
      "Fuel Pump Noise From Tank",
      "Black Smoke on Hard Throttle",
      "Idle Fluctuation With AC On",
    ],
    symptomPool: [
      "Mileage drops significantly in similar routes.",
      "Starting requires extended cranking.",
      "Vehicle hesitates when throttle is pressed.",
      "Fuel odor appears near bonnet area.",
      "Engine jerks while cruising at fixed speed.",
      "Power delivery feels inconsistent uphill.",
    ],
  },
  "exhaust-system": {
    prefix: "exh",
    baseMin: 900,
    baseMax: 30000,
    partsBase: 14000,
    laborBase: 5200,
    focusPool: [
      ["catalytic converter", "oxygen sensor", "exhaust manifold"],
      ["muffler", "exhaust gasket", "PCV valve"],
      ["DPF", "EGR valve", "tailpipe section"],
    ],
    titles: [
      "Excessive Exhaust Smoke",
      "Loud Exhaust Leak Noise",
      "Sulfur Smell From Tailpipe",
      "Catalyst Efficiency Warning",
      "Rattling Underbody Exhaust Sound",
      "Exhaust Backpressure Loss",
      "Black Soot Buildup on Bumper",
      "DPF Regeneration Failure",
    ],
    symptomPool: [
      "Exhaust note becomes louder than usual.",
      "Smoke color changes during acceleration.",
      "Unusual smell appears from tailpipe.",
      "Check engine light appears with emission codes.",
      "Rattle noise is heard from underbody.",
      "Power drops when climbing flyovers.",
    ],
  },
  "body-interior": {
    prefix: "bdy",
    baseMin: 700,
    baseMax: 18000,
    partsBase: 8000,
    laborBase: 2800,
    focusPool: [
      ["window regulator", "door lock actuator", "wiring loom"],
      ["seat rail", "dashboard clips", "cabin blower"],
      ["sunroof drain", "door seal", "interior lamp circuit"],
    ],
    titles: [
      "Power Window Jammed",
      "Door Lock Actuator Failure",
      "Sunroof Water Leak in Cabin",
      "Cabin Rattle From Dashboard",
      "Rear Hatch Not Opening Properly",
      "Seat Adjustment Motor Not Working",
      "Interior Lights Flickering",
      "Wiper Linkage Noise in Rain",
    ],
    symptomPool: [
      "Door controls respond intermittently.",
      "Cabin trim noise increases on rough roads.",
      "Water enters cabin after heavy rain.",
      "Power window movement is slow or stuck.",
      "Central locking does not sync on all doors.",
      "Interior electronics reset occasionally.",
    ],
  },
  "lighting-system": {
    prefix: "lgt",
    baseMin: 400,
    baseMax: 12000,
    partsBase: 5000,
    laborBase: 1800,
    focusPool: [
      ["headlight relay", "ground point", "fuse box"],
      ["tail lamp socket", "brake switch", "wiring connector"],
      ["DRL module", "lighting stalk", "BCM"],
    ],
    titles: [
      "Headlights Flickering at Night",
      "Brake Light Not Working",
      "Turn Indicator Hyper Flash",
      "Fog Lamp Random Shutdown",
      "DRL Not Turning On",
      "High Beam Not Engaging",
      "Reverse Lamp Failure",
      "Parking Lights Stay On",
    ],
    symptomPool: [
      "Headlight brightness fluctuates while driving.",
      "A rear light warning appears on cluster.",
      "Indicator flashing speed is abnormal.",
      "One side lighting fails intermittently.",
      "Lighting issue worsens on bumps.",
      "Fuse blows repeatedly in lighting circuit.",
    ],
  },
  "engine-cooling-system": {
    prefix: "clg",
    baseMin: 1100,
    baseMax: 26000,
    partsBase: 11000,
    laborBase: 4200,
    focusPool: [
      ["radiator hose", "water pump", "coolant reservoir"],
      ["thermostat", "fan motor", "coolant sensor"],
      ["radiator cap", "heater core", "coolant line"],
    ],
    titles: [
      "Coolant Leak From Front Bay",
      "Radiator Fan Not Spinning",
      "Coolant Temperature Fluctuating",
      "Heater Not Producing Warm Air",
      "Coolant Reservoir Overflow",
      "Low Coolant Warning Recurring",
      "Engine Fan Running Constantly",
      "Thermostat Stuck Open/Closed",
    ],
    symptomPool: [
      "Coolant level drops between services.",
      "Temperature gauge swings abnormally.",
      "Cooling fan behavior is inconsistent.",
      "Cabin heater output is weak.",
      "Sweet coolant smell appears after drive.",
      "Engine warms up slower or faster than usual.",
    ],
  },
  "hybrid-ev-system": {
    prefix: "hev",
    baseMin: 4000,
    baseMax: 160000,
    partsBase: 85000,
    laborBase: 18000,
    focusPool: [
      ["battery module", "battery cooling fan", "BMS"],
      ["charging port", "onboard charger", "pilot signal"],
      ["inverter", "DC-DC converter", "high-voltage harness"],
    ],
    titles: [
      "Hybrid Battery Rapid Drain",
      "Charging Port Not Detecting Charger",
      "Regenerative Braking Weak Response",
      "EV Range Drop in Normal Driving",
      "High Voltage Warning on Startup",
      "Charging Session Stops Midway",
      "Battery Cooling Fan Noise",
      "Inverter Overheat Warning",
    ],
    symptomPool: [
      "EV range reduces noticeably from usual pattern.",
      "Charging fails to start on first attempt.",
      "Battery percentage drops quickly under light load.",
      "Hybrid warning appears after city traffic.",
      "Charging connector unlocks unexpectedly.",
      "Power mode changes are delayed.",
    ],
  },
  "emergency-issues": {
    prefix: "emr",
    baseMin: 2000,
    baseMax: 36000,
    partsBase: 17000,
    laborBase: 7000,
    focusPool: [
      ["fuel pressure", "crank sensor", "ECU power supply"],
      ["brake booster", "hydraulic line", "ABS hydraulic unit"],
      ["steering assist pump", "belt drive", "power steering line"],
    ],
    titles: [
      "Engine Stalls in Moving Traffic",
      "Brake Failure Warning Alert",
      "Sudden Loss of Steering Assist",
      "Engine Cut-Off on Highway",
      "Severe Overheat With Steam",
      "Critical Oil Pressure Warning",
      "Strong Fuel Leak Smell",
      "Brake Pedal Becomes Hard",
    ],
    symptomPool: [
      "Vehicle behavior becomes unsafe during normal drive.",
      "Critical warning appears with alarm chime.",
      "Immediate pull-over is required for safety.",
      "Control response changes suddenly.",
      "Issue repeats even after restart.",
      "Tow support may be required.",
    ],
  },
  "sensors-ecu": {
    prefix: "ecu",
    baseMin: 1000,
    baseMax: 22000,
    partsBase: 10000,
    laborBase: 3500,
    focusPool: [
      ["MAF sensor", "intake hose", "ECU adaptation"],
      ["crank sensor", "wiring harness", "ground network"],
      ["oxygen sensor", "throttle sensor", "CAN line"],
    ],
    titles: [
      "Check Engine Light P0101",
      "Crank Sensor Intermittent Signal",
      "Throttle Position Sensor Error",
      "Oxygen Sensor Slow Response",
      "Knock Sensor Circuit Fault",
      "Camshaft Correlation Code",
      "ECU Communication Timeout",
      "Random Multiple Sensor Faults",
    ],
    symptomPool: [
      "Check engine light remains active after clearing.",
      "Fault codes return after short drive cycle.",
      "Idle quality changes without obvious mechanical issue.",
      "Engine enters limp mode unexpectedly.",
      "Scan tool live data shows unstable readings.",
      "Cold start behavior differs from warm start.",
    ],
  },
};

const youtubeVideoPool = [
  "o5uxFk_mFO4",
  "iAojH-dpKCA",
  "DiQqKmXE-04",
  "PGkSfPbGr3Y",
  "HmA0YDkQyAA",
  "P31PVOezag0",
  "vCAlwSI-W2M",
  "I1fJodnsg68",
  "NehZEoOZrn4",
  "SPt4J-Z-qLo",
  "UcY1MZVZzbk",
  "MrBI1hRTgx4",
  "q0ABtquGfLY",
  "Fj0MUZ73t2U",
  "xBeIeL-3VNk",
  "xdFicdS_IX0",
  "evpaTW2WJ5Y",
  "iKVlsF8SBmk",
  "wxZiYiiY9Oo",
  "Lu8fzBtuP2w",
];

function getStableHash(input: string): number {
  let hash = 0;
  for (const char of input) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function buildVideoIds(title: string, category: Category): string[] {
  if (youtubeVideoPool.length === 0) {
    return [];
  }

  const start = getStableHash(`${category}:${title}`) % youtubeVideoPool.length;
  return [0, 1, 2].map((offset) => youtubeVideoPool[(start + offset) % youtubeVideoPool.length]);
}

function formatStep(prefix: string, step: number, detail: string): string {
  return `Step ${step}: ${prefix}${detail}`;
}

function buildSymptoms(title: string, category: Category, focus: [string, string, string]): string[] {
  const pool = categoryConfigs[category].symptomPool;
  return [
    pool[0],
    pool[1],
    pool[2],
    pool[3],
    pool[4],
    pool[5],
    `${title} is more noticeable during stop-and-go driving.`,
    `Intermittent vibration is felt near the ${focus[0]} area.`,
    `Issue worsens after longer trips and repeated restarts.`,
    `${CATEGORY_INFO[category].label} warning stays active after ignition cycle.`,
  ];
}

function buildCauses(title: string, focus: [string, string, string]): string[] {
  return [
    `Low or contaminated ${focus[0]} causing unstable operation.`,
    `Partial blockage around ${focus[1]} reducing normal flow.`,
    `Electrical connector corrosion near ${focus[2]}.`,
    `Progressive wear due to delayed maintenance intervals.`,
    `Incorrect sensor feedback causing ECU over-correction.`,
    `Loose mounting hardware creating vibration and poor contact.`,
    `Heat-soak conditions triggering intermittent failure.`,
    `Aging rubber seals causing pressure or vacuum leaks.`,
    `Aftermarket component mismatch affecting calibration.`,
    `Underlying wiring loom damage hidden under insulation for ${title.toLowerCase()}.`,
  ];
}

function buildSolutions(title: string, focus: [string, string, string]): string[] {
  const safePrefix = "Before starting, park safely on level ground and engage the handbrake. ";
  return [
    formatStep(safePrefix, 1, "Switch off the engine and let hot parts cool before inspection."),
    formatStep("", 2, "Review your owner manual for warnings linked to this symptom."),
    formatStep("", 3, "Perform a visual check for loose connectors, leaks, or damaged hoses."),
    formatStep("", 4, `Inspect ${focus[0]} level/condition and top up only approved fluids.`),
    formatStep("", 5, `Check ${focus[1]} path for dirt, cracks, or external blockages.`),
    formatStep("", 6, `Reseat the connector around ${focus[2]} and verify lock tabs.`),
    formatStep("", 7, "Inspect related fuses/relays and replace only with same amp ratings."),
    formatStep("", 8, "Clean accessible service points using dry cloth and contact cleaner where needed."),
    formatStep("", 9, "Start the engine and monitor idle behavior for 2-3 minutes."),
    formatStep("", 10, "Record warning lights, unusual sounds, and exact trigger conditions."),
    formatStep("", 11, "Run a short low-speed test drive in a safe area."),
    formatStep("", 12, "Stop immediately if temperature spikes, brake feel changes, or severe vibration appears."),
    formatStep("", 13, "Scan OBD codes and save freeze-frame data for the mechanic."),
    formatStep("", 14, "Compare live data values against service manual reference ranges."),
    formatStep("", 15, "Replace overdue maintenance items connected to the affected subsystem."),
    formatStep("", 16, `Request a pressure/load test for ${focus[1]} if issue persists.`),
    formatStep("", 17, "Inspect harness continuity and ground resistance with a technician."),
    formatStep("", 18, "After repair, clear codes and perform a full confirmation drive cycle."),
    formatStep("", 19, "Recheck for leaks/noises after cooldown and second restart."),
    formatStep("", 20, `Set preventive reminders to avoid repeat ${title.toLowerCase()} events.`),
  ];
}

function buildProblem(category: Category, config: CategoryConfig, title: string, index: number): Problem {
  const focus = config.focusPool[index % config.focusPool.length];
  const severity = severityCycle[index % severityCycle.length];
  const id = `${config.prefix}-${String(index + 1).padStart(3, "0")}`;
  const variable = index * 280;
  const estimated_cost_min = config.baseMin + variable;
  const estimated_cost_max = config.baseMax + variable * 4;
  const parts_cost = config.partsBase + variable * 2;
  const labor_cost = config.laborBase + Math.round(variable * 1.4);

  return {
    id,
    title,
    category,
    symptoms: buildSymptoms(title, category, focus),
    causes: buildCauses(title, focus),
    solutions: buildSolutions(title, focus),
    severity,
    estimated_cost_min,
    estimated_cost_max,
    parts_cost,
    labor_cost,
    video_keywords: `car ${title} fix`,
    video_ids: buildVideoIds(title, category),
  };
}

export const problems: Problem[] = Object.entries(categoryConfigs).flatMap(([categoryKey, config]) => {
  const category = categoryKey as Category;
  return config.titles.map((title, index) => buildProblem(category, config, title, index));
});

for (const problem of problems) {
  if (problem.causes.length !== 10) {
    throw new Error(`Invalid causes count for ${problem.id}`);
  }

  if (problem.solutions.length !== 20) {
    throw new Error(`Invalid solutions count for ${problem.id}`);
  }
}

export function getSymptomsByCategory(category: Category): string[] {
  const categoryProblems = problems.filter((problem) => problem.category === category);
  const symptoms = new Set<string>();

  categoryProblems.forEach((problem) => {
    problem.symptoms.forEach((symptom) => symptoms.add(symptom));
  });

  return Array.from(symptoms).sort();
}

export function getProblemsByCategory(category: Category): Problem[] {
  return problems.filter((problem) => problem.category === category);
}

export function getProblemById(id: string): Problem | undefined {
  return problems.find((problem) => problem.id === id);
}

export function diagnoseProblems(
  category: Category,
  selectedSymptoms: string[]
): { problem: Problem; matchScore: number; matchingSymptoms: string[] }[] {
  const categoryProblems = getProblemsByCategory(category);

  const results = categoryProblems.map((problem) => {
    const matchingSymptoms = problem.symptoms.filter((symptom) =>
      selectedSymptoms.some((selected) => {
        const symptomLower = symptom.toLowerCase();
        const selectedLower = selected.toLowerCase();
        return symptomLower.includes(selectedLower) || selectedLower.includes(symptomLower);
      })
    );

    const matchScore = matchingSymptoms.length / problem.symptoms.length;

    return {
      problem,
      matchScore,
      matchingSymptoms,
    };
  });

  return results
    .filter((result) => result.matchingSymptoms.length > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getSeverityColor(severity: Severity): string {
  switch (severity) {
    case "critical":
      return "text-rose-600 bg-rose-500/10 border-rose-500/30";
    case "high":
      return "text-red-500 bg-red-500/10 border-red-500/30";
    case "medium":
      return "text-amber-500 bg-amber-500/10 border-amber-500/30";
    case "low":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/30";
    default:
      return "text-muted-foreground bg-muted border-border";
  }
}
