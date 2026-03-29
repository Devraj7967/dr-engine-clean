import { Garage } from "../types";

export const garages: Garage[] = [
  {
    id: "g-001",
    name: "AutoFix Pro Service Center",
    rating: 4.8,
    distance: "0.5 km",
    services: ["Engine Repair", "AC Service", "Brakes", "Electrical", "Transmission"],
    address: "Shop 12, Sector 18, Noida",
    phone: "+91 98765 43210",
    openHours: "8:00 AM - 8:00 PM"
  },
  {
    id: "g-002",
    name: "Maruti Authorized Service",
    rating: 4.5,
    distance: "1.2 km",
    services: ["All Maruti Models", "Genuine Parts", "Insurance Claims", "Denting & Painting"],
    address: "Plot 45, Industrial Area, Phase 2",
    phone: "+91 98765 43211",
    openHours: "9:00 AM - 7:00 PM"
  },
  {
    id: "g-003",
    name: "Quick Wheels Garage",
    rating: 4.2,
    distance: "1.8 km",
    services: ["Multi-Brand Service", "Oil Change", "Tyre Service", "Battery Replacement"],
    address: "Main Road, Near Metro Station",
    phone: "+91 98765 43212",
    openHours: "24 Hours"
  },
  {
    id: "g-004",
    name: "Elite Auto Care",
    rating: 4.9,
    distance: "2.3 km",
    services: ["Luxury Car Service", "BMW", "Mercedes", "Audi", "Detailing"],
    address: "Golf Course Road, DLF Phase 5",
    phone: "+91 98765 43213",
    openHours: "8:00 AM - 9:00 PM"
  },
  {
    id: "g-005",
    name: "Hyundai Service Point",
    rating: 4.4,
    distance: "2.8 km",
    services: ["Hyundai Models", "Periodic Maintenance", "Warranty Service", "Body Shop"],
    address: "NH-48, Sector 37",
    phone: "+91 98765 43214",
    openHours: "9:00 AM - 6:00 PM"
  },
  {
    id: "g-006",
    name: "Supreme Motor Works",
    rating: 4.6,
    distance: "3.1 km",
    services: ["Engine Overhaul", "Transmission Repair", "Suspension", "AC Specialist"],
    address: "Industrial Estate, Block C",
    phone: "+91 98765 43215",
    openHours: "8:00 AM - 8:00 PM"
  },
  {
    id: "g-007",
    name: "Tata Motors Authorized",
    rating: 4.3,
    distance: "3.5 km",
    services: ["Tata Vehicles", "Commercial Vehicles", "EV Service", "Genuine Parts"],
    address: "Auto Market, Ring Road",
    phone: "+91 98765 43216",
    openHours: "9:00 AM - 7:00 PM"
  },
  {
    id: "g-008",
    name: "Speed Zone Auto Repair",
    rating: 4.7,
    distance: "4.0 km",
    services: ["Performance Tuning", "Custom Exhaust", "Sports Cars", "Racing Setup"],
    address: "Cyber Hub, Tower B",
    phone: "+91 98765 43217",
    openHours: "10:00 AM - 10:00 PM"
  },
  {
    id: "g-009",
    name: "Honda Authorized Service",
    rating: 4.5,
    distance: "4.5 km",
    services: ["Honda Cars", "Honda Bikes", "Accessories", "Extended Warranty"],
    address: "MG Road, Sector 28",
    phone: "+91 98765 43218",
    openHours: "9:00 AM - 7:00 PM"
  },
  {
    id: "g-010",
    name: "Budget Auto Service",
    rating: 4.0,
    distance: "5.2 km",
    services: ["Budget Friendly", "All Brands", "Quick Service", "Home Pickup"],
    address: "Old City Market, Lane 4",
    phone: "+91 98765 43219",
    openHours: "7:00 AM - 9:00 PM"
  }
];

export function searchGarages(query: string): Garage[] {
  const lowercaseQuery = query.toLowerCase();
  return garages.filter(
    garage =>
      garage.name.toLowerCase().includes(lowercaseQuery) ||
      garage.services.some(s => s.toLowerCase().includes(lowercaseQuery)) ||
      garage.address.toLowerCase().includes(lowercaseQuery)
  );
}

export function filterGaragesByService(service: string): Garage[] {
  return garages.filter(garage =>
    garage.services.some(s => s.toLowerCase().includes(service.toLowerCase()))
  );
}

export function sortGaragesByRating(): Garage[] {
  return [...garages].sort((a, b) => b.rating - a.rating);
}

export function sortGaragesByDistance(): Garage[] {
  return [...garages].sort((a, b) => {
    const distA = parseFloat(a.distance);
    const distB = parseFloat(b.distance);
    return distA - distB;
  });
}
