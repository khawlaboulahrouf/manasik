
const API_URL = "http://127.0.0.1:8000/api";

async function apiRequest(endpoint, token, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body && { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationErrors = data.errors
      ? Object.values(data.errors).flat().join(" ")
      : "";

    throw new Error(
      validationErrors || data.message || "Une erreur est survenue."
    );
  }

  return data;
}

export const reservationService = {
  async getPackages(token) {
    return apiRequest("/packages", token);
  },

  async getDepartures(token) {
    return apiRequest("/departures", token);
  },

  async create(token, departureId) {
    return apiRequest("/reservations", token, {
      method: "POST",
      body: JSON.stringify({
        departure_id: departureId,
      }),
    });
  },

  async getMyReservations(token) {
    return apiRequest("/reservations", token);
  },
};
