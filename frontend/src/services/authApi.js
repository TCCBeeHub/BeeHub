import { apiRequest } from "./httpClient";

export function loginRequest({ identifier, password }) {
  return apiRequest("/admin/login", {
    method: "POST",
    body: { user: identifier, senha: password },
  });
}
