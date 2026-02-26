// constants/services.ts

import { Service } from "../types";

export const SERVICES: Service[] = [
  {
    id: "plumber",
    label: "Plumber",
    icon: "🔧",
    description: "Leaks, pipes, faucets & more",
    startingPrice: 199,
  },
  {
    id: "electrician",
    label: "Electrician",
    icon: "⚡",
    description: "Wiring, repairs, installations",
    startingPrice: 249,
  },
  {
    id: "carpenter",
    label: "Carpenter",
    icon: "🪚",
    description: "Furniture, doors & shelves",
    startingPrice: 299,
    comingSoon: true,
  },
  {
    id: "painter",
    label: "Painter",
    icon: "🖌️",
    description: "Interior & exterior painting",
    startingPrice: 499,
    comingSoon: true,
  },
  {
    id: "cleaner",
    label: "Home Cleaning",
    icon: "🧹",
    description: "Routine cleaning & deep cleans",
    startingPrice: 349,
    comingSoon: true,
  },
  {
    id: "ac_repair",
    label: "AC Repair",
    icon: "❄️",
    description: "Air conditioner service & repairs",
    startingPrice: 399,
    comingSoon: true,
  },
  {
    id: "pest_control",
    label: "Pest Control",
    icon: "🐜",
    description: "Termite, cockroach & rodent removal",
    startingPrice: 599,
    comingSoon: true,
  },
  {
    id: "home_tutor",
    label: "Home Tutor",
    icon: "📚",
    description: "Tuition for students in various subjects",
    startingPrice: 299,
    comingSoon: true,
  },
];

export const CONTACT = {
  phone: "+91-9999999999",
  whatsapp: "919999999999",
  email: "sonijatin9227@gmail.com",
};

export const EMAIL_ENDPOINT = "https://formspree.io/f/xojnrwkg";
