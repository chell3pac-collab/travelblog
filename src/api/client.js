export const BASE_URL = import.meta.env.VITE_API_URL || "";

export const TOKEN_KEY = "travelblog_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

/**
 * Фотографии приходят с бэкенда относительными путями ("/images/...").
 * Превращаем их в полный URL, чтобы <img> работал и в dev, и в prod.
 */
export function assetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return BASE_URL + path;
}

export class ApiError extends Error {
  constructor(status, message, errors) {
    super(message || `Ошибка запроса (${status})`);
    this.status = status;
    this.errors = errors || {};
  }
}

/**
 * Базовая обёртка над fetch.
 * - form: если true, body уже FormData (Content-Type не ставим — браузер сам
 *   добавит multipart/form-data с boundary).
 * - Ошибки Swagger: 400/422 могут вернуть объект некорректных полей —
 *   он попадает в ApiError.errors независимо от вложенности
 *   ({errors: {...}} или {error: {...}}).
 */
export async function request(path, { method = "GET", body, form = false } = {}) {
  const headers = { Accept: "application/json" };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload = body;
  if (body && !form) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  const res = await fetch(BASE_URL + path, { method, headers, body: payload, credentials: "include" });
  if (res.status === 204) return null;

  let data = null;
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  }

  if (!res.ok) {
    const errors = normalizeErrors(data);
    throw new ApiError(res.status, data?.message || data?.error_message, errors);
  }
  return data;
}

function normalizeErrors(data) {
  if (!data) return {};
  if (data.errors && typeof data.errors === "object") return data.errors;
  if (data.error && typeof data.error === "object" && !Array.isArray(data.error)) return data.error;
  if (typeof data.error === "string") return { _global: [data.error] };
  return {};
}
