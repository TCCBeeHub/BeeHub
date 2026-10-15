const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/+$/,
  "",
);
const SESSION_STORAGE_KEY = "beehub-session-v1";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getAccessToken() {
  try {
    const session = JSON.parse(
      sessionStorage.getItem(SESSION_STORAGE_KEY) || "null",
    );
    return session?.accessToken || "";
  } catch {
    return "";
  }
}

export async function apiRequest(path, { method = "GET", body, signal } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const accessToken = getAccessToken();
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new Error(
      "Não foi possível conectar ao servidor. Verifique se a API Java está disponível.",
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const responseBody = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    if (response.status === 401 && accessToken) {
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
