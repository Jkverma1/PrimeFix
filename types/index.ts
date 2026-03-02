// types/index.ts

export type ServiceType =
  | "plumber"
  | "electrician"
  | "carpenter"
  | "painter"
  | "cleaner"
  | "ac_repair"
  | "pest_control"
  | "home_tutor"
  | "home_cleaning"
  | "bathroom_cleaning"
  | "ac_service"
  | "painting"
  | "appliance_repair"
  | "interior_design"
  | "exterior_design"
  | "architect"
  | "maintenance"
  | "app_development";

export interface Service {
  id: ServiceType;
  label: string;
  icon: string;
  description: string;
  startingPrice: number; // ← in ₹, e.g. 199
  comingSoon?: boolean;
}

export interface ServiceRequestForm {
  name: string;
  phone: string;
  address: string;
  issue: string;
  serviceType: ServiceType;
}

export interface ServiceRequestPayload extends ServiceRequestForm {
  createdAt: string;
}

export interface ServiceRequestResponse {
  success: boolean;
  requestId: string;
  message: string;
}
