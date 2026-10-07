import { request, setToken } from "./client";

export async function register({ email, password }) {
  const data = await request("/api/register", { method: "POST", body: { email, password } });
  if (data?.token) setToken(data.token);
  return data;
}

export async function login({ email, password }) {
  const data = await request("/api/login", { method: "POST", body: { email, password } });
  if (data?.token) setToken(data.token);
  return data;
}

export async function logout() {
  try {
    await request("/api/logout");
  } finally {
    setToken(null);
  }
}
