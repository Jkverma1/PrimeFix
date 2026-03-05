// hooks/useServiceRequest.ts

import { useBookingStore } from "../store/BookingStore";
import { ServiceType } from "../types";

interface SubmitInput {
  name: string;
  phone: string;
  address: string;
  issue: string;
  serviceType: ServiceType;
}

export function useServiceRequest() {
  const createBooking = useBookingStore((s) => s.createBooking);
  const isSubmitting = useBookingStore((s) => s.isSubmitting);
  const error = useBookingStore((s) => s.error);

  const submit = async (input: SubmitInput) => {
    const { supabase } = await import("../lib/supabase");

    const { data: svcRow, error: svcError } = await supabase
      .from("services")
      .select("id")
      .eq("slug", input.serviceType)
      .single();

    if (svcError || !svcRow) {
      throw new Error(
        `Service "${input.serviceType}" not found in database. ` +
          `Make sure the services table slugs match your local SERVICES constant.`,
      );
    }

    const booking = await createBooking({
      service_id: svcRow.id,
      customer_name: input.name,
      customer_phone: input.phone,
      address: input.address,
      issue: input.issue,
    });

    return { requestId: booking.id };
  };

  return { submit, isLoading: isSubmitting, error };
}
