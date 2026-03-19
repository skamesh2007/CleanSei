import type { Hotspot, LiveReport, Contributor } from "../../lib/home/type";

export const HOTSPOTS: Hotspot[] = [
  {
    id: 1,
    latitude: 13.0827,
    longitude: 80.2707,
    title: "Overflowing Bin",
    severity: "high",
    type: "plastic",
    image: "/demo/overflow-bin.png",
  },
  {
    id: 2,
    latitude: 13.0877,
    longitude: 80.274,
    title: "Littered Area",
    severity: "medium",
    type: "mixed",
    image: "/demo/street-waste.png",
  },
  {
    id: 3,
    latitude: 13.085,
    longitude: 80.272,
    title: "Construction Waste",
    severity: "high",
    type: "concrete",
    image: "/demo/plastic-dump.png",
  },
];

export const LIVE_REPORTS: LiveReport[] = [
  {
    id: 1,
    img: "/demo/overflow-bin.png",
    title: "Overflowing Dustbin",
    status: "pending",
    time: "5 min ago",
    location: "1.2 km away",
    type: "plastic",
  },
  {
    id: 2,
    img: "/demo/street-waste.png",
    title: "Street Waste",
    status: "resolved",
    time: "2 hours ago",
    location: "0.8 km away",
    type: "mixed",
  },
  {
    id: 3,
    img: "/demo/plastic-dump.png",
    title: "Plastic Dump",
    status: "in_progress",
    time: "15 min ago",
    location: "2.1 km away",
    type: "plastic",
  },
];

export const TOP_CONTRIBUTORS: Contributor[] = [
  {
    name: "Kamesh",
    points: 520,
    image: "/images/profile-placeholder.png",
    level: "Eco Warrior",
    isCurrentUser: true,
  },
  {
    name: "Mark Zuckerberg",
    points: 480,
    image: "/demo/mark.png",
    level: "Cleanup Champion",
  },
  {
    name: "Elon Musk",
    points: 450,
    image: "/demo/elon.png",
    level: "Eco Hero",
  },
];