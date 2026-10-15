import { apiRequest } from "./httpClient";

export function loginRequest({ identifier, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { identifier, password },
  });
}
