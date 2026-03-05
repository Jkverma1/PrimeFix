export interface Customer {
  id: string;
  phone: string;
  full_name: string | null;
  referral_code: string;
  created_at: string;
  booking_count?: number;
}

export interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  issue: string;
  status: string;
  created_at: string;
  scheduled_at: string | null;
  quoted_price: number | null;
  final_price: number | null;
  services: { label: string; icon: string } | null;
}

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface BookingDetail {
  id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  issue: string;
  status: BookingStatus;
  scheduled_at: string | null;
  quoted_price: number | null;
  final_price: number | null;
  admin_notes: string | null;
  created_at: string;
  services: { label: string; icon: string } | null;
  profiles: { phone: string; full_name: string | null } | null;
}

export interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  in_progress: number;
  completed: number;
  cancelled: number;
  today: number;
  revenue: number;
}

export interface RecentBooking {
  id: string;
  customer_name: string;
  customer_phone: string;
  status: string;
  created_at: string;
  services:
    | { label: string; icon: string }
    | { label: string; icon: string }[]
    | null;
}

export interface Service {
  id: string;
  slug: string;
  label: string;
  description: string;
  icon: string;
  starting_price: number;
  is_active: boolean;
  sort_order: number;
}
