// constants/services.ts

import { Service } from "../types";

export const SERVICES: Service[] = [
  {
    id: "electrician",
    label: "Electrician",
    icon: "⚡",
    description: "Wiring, switches, lights & repairs",
    startingPrice: 199,
    comingSoon: false,
  },
  {
    id: "plumber",
    label: "Plumber",
    icon: "🔧",
    description: "Leaks, pipes, taps & fittings",
    startingPrice: 199,
    comingSoon: false,
  },
  {
    id: "carpenter",
    label: "Carpenter",
    icon: "🪚",
    description: "Furniture, doors & woodwork",
    startingPrice: 199,
    comingSoon: false,
  },
  {
    id: "appliance_repair",
    label: "Appliance Repair",
    icon: "🛠️",
    description: "AC, fridge, washing machine & more",
    startingPrice: 199,
    comingSoon: false,
  },
  {
    id: "interior_design",
    label: "Interior Design",
    icon: "🛋️",
    description: "Home & office interior solutions",
    startingPrice: 599,
    comingSoon: false,
  },
  {
    id: "exterior_design",
    label: "Exterior Design",
    icon: "🏠",
    description: "Outdoor, facade & elevation design",
    startingPrice: 599,
    comingSoon: false,
  },
  {
    id: "architect",
    label: "Architect",
    icon: "📐",
    description: "Planning, drawings & approvals",
    startingPrice: 999,
    comingSoon: false,
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: "🧰",
    description: "General home & office maintenance",
    startingPrice: 199,
    comingSoon: false,
  },

  {
    id: "app_development",
    label: "App Development",
    icon: "📱",
    description: "Mobile app development services",
    startingPrice: 1999,
    comingSoon: false,
  },

  // 🔒 Coming Soon (Urban Company–style extensions)

  {
    id: "home_cleaning",
    label: "Home Cleaning",
    icon: "🧹",
    description: "Deep & regular home cleaning",
    startingPrice: 349,
    comingSoon: true,
  },
  {
    id: "bathroom_cleaning",
    label: "Bathroom Cleaning",
    icon: "🚿",
    description: "Tile, fittings & sanitization",
    startingPrice: 299,
    comingSoon: true,
  },
  {
    id: "pest_control",
    label: "Pest Control",
    icon: "🐜",
    description: "Cockroach, termite & rodent control",
    startingPrice: 599,
    comingSoon: true,
  },
  {
    id: "ac_service",
    label: "AC Service",
    icon: "❄️",
    description: "AC servicing & gas refill",
    startingPrice: 399,
    comingSoon: true,
  },
  {
    id: "painting",
    label: "Painting",
    icon: "🖌️",
    description: "Interior & exterior wall painting",
    startingPrice: 499,
    comingSoon: true,
  },
];

export const CONTACT = {
  phone: "+91-8848478484",
  whatsapp: "918848478484",
  email: "prime.fixex@gmail.com",
};

export const EMAIL_ENDPOINT = "https://formspree.io/f/xvzbnegr";
