// types/index.ts

export type ServiceType =
  | "plumber"
  | "electrician"
  | "carpenter"
  | "painter"
  | "cleaner"
  | "ac_repair"
  | "pest_control"
  | "home_tutor"; // extra services (mostly coming soon)

export interface Service {
  id: ServiceType;
  label: string;
  icon: string;
  description: string;
  /**
   * When true the service is not yet available; the UI can show a "Coming Soon" tag
   * and prevent selection. Defaults to false.
   */
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
