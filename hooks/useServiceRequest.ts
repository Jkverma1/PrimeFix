// hooks/useServiceRequest.ts

import * as MailComposer from "expo-mail-composer";
import { useState } from "react";
import { Linking } from "react-native";
import { CONTACT } from "../constants/services";
import { ServiceRequestForm, ServiceRequestResponse } from "../types";
// Previously this hook sent data to a backend API. Since the backend
// isn't available yet, we'll open the user's mail client with the form
// details so they can email us directly.

export function useServiceRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (
    form: ServiceRequestForm,
  ): Promise<ServiceRequestResponse> => {
    setIsLoading(true);
    setError(null);

    // build email body from form data
    const body = `Service Type: ${form.serviceType}
Name: ${form.name}
Phone: ${form.phone}
Address: ${form.address}
Issue: ${form.issue}
Created At: ${new Date().toISOString()}`;

    try {
      // try using MailComposer (better UX on devices)
      if (await MailComposer.isAvailableAsync()) {
        await MailComposer.composeAsync({
          recipients: [CONTACT.email],
          subject: `Service Request - ${form.serviceType}`,
          body,
        });
      } else {
        // fallback to a mailto: URL
        const url =
          `mailto:${CONTACT.email}` +
          `?subject=${encodeURIComponent("Service Request - " + form.serviceType)}` +
          `&body=${encodeURIComponent(body)}`;
        // check if the device can handle the link before opening
        const canOpen = await Linking.canOpenURL(url);
        if (!canOpen) {
          throw new Error('No mail client is configured on this device');
        }
        await Linking.openURL(url);
      }

      // generate a fake request ID so callers can still navigate
      const fakeId = Date.now().toString();
      return { success: true, requestId: fakeId, message: "Composer opened" };
    } catch (err: any) {
      let msg = err?.message ?? "Failed to open mail composer.";
      // handle the common mailto failure message
      if (msg.startsWith('Unable to open URL')) {
        msg = 'Could not launch email client. Please install an email app and try again.';
      }
      setError(msg);
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading, error };
}
