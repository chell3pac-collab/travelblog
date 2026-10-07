import { request } from "./client";

export function getUser() {
  return request("/api/user");
}

export function updateUser({ fullName, city, bio, photo }) {
  const fd = new FormData();
  if (fullName) fd.append("full_name", fullName);
  if (city) fd.append("city", city);
  if (bio) fd.append("bio", bio);
  if (photo) fd.append("photo", photo);
  return request("/api/user", { method: "POST", body: fd, form: true });
}

export function changePassword({ password }) {
  return request("/api/user/password", { method: "PATCH", body: { password } });
}
