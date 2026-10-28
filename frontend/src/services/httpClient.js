const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/+$/,
  "",
);
const SESSION_STORAGE_KEY = "beehub-session-cookie-v1";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(
  path,
  { method = "GET", body, signal, clearSessionOnUnauthorized = true } = {},
) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      credentials: "include",
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique se a API Java está disponível.",
    );
  }

  const responseText = await response.text();
  let responseBody = null;
  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new Error("A API retornou uma resposta JSON inválida.");
      }
      responseBody = { message: responseText };
    }
  }

  if (!response.ok) {
    if (response.status === 401 && clearSessionOnUnauthorized) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      window.dispatchEvent(new Event("beehub:session-expired"));
    }
    const message =
      responseBody?.message ||
      responseBody?.detail ||
      (response.status === 401
        ? "Credenciais inválidas ou sessão expirada."
        : `A solicitação falhou (HTTP ${response.status}).`);
    throw new ApiError(message, response.status);
  }

  return responseBody;
}
