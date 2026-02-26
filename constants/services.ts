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
  // Future — uncomment when ready:
  // { id: 'carpenter', label: 'Carpenter', icon: '🪚', description: 'Furniture & doors' },
  // { id: 'painter',   label: 'Painter',   icon: '🖌️', description: 'Interior & exterior' },
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
