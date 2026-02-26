import { Service } from "../types";

export const SERVICES: Service[] = [
  {
    id: "plumber",
    label: "Plumber",
    icon: "🔧",
    description: "Leaks, pipes, faucets & more",
  },
  {
    id: "electrician",
    label: "Electrician",
    icon: "⚡",
    description: "Wiring, repairs, installations",
  },
  {
    id: "carpenter",
    label: "Carpenter",
    icon: "🪚",
    description: "Furniture, doors & shelves",
    comingSoon: true,
  },
  {
    id: "painter",
    label: "Painter",
    icon: "🖌️",
    description: "Interior & exterior painting",
    comingSoon: true,
  },
  {
    id: "cleaner",
    label: "Home Cleaning",
    icon: "🧹",
    description: "Routine cleaning & deep cleans",
    comingSoon: true,
  },
  {
    id: "ac_repair",
    label: "AC Repair",
    icon: "❄️",
    description: "Air conditioner service & repairs",
    comingSoon: true,
  },
  {
    id: "pest_control",
    label: "Pest Control",
    icon: "🐜",
    description: "Termite, cockroach & rodent removal",
    comingSoon: true,
  },
  {
    id: "home_tutor",
    label: "Home Tutor",
    icon: "📚",
    description: "Tuition for students in various subjects",
    comingSoon: true,
  },
];

export const CONTACT = {
  phone: "+91-9999999999",
  whatsapp: "919999999999",
  email: "sonijatin9227@gmail.com",
};

// Optionally configure a lightweight serverless email endpoint such as
// Formspree or EmailJS. This lets the app POST the request directly and
// you receive it via email without involving the user’s mail client.
export const EMAIL_ENDPOINT = "https://formspree.io/f/xojnrwkg";
