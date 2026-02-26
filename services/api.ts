// services/api.ts

import { ServiceRequestPayload, ServiceRequestResponse } from '../types';

const API_BASE_URL = 'https://your-api.com/api/v1'; // 🔁 Replace when backend is ready

export const serviceApi = {
  submitRequest: async (payload: ServiceRequestPayload): Promise<ServiceRequestResponse> => {
    const response = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.message ?? 'Something went wrong');
    }

    return response.json();
  },
};
