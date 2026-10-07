import { request } from "./client";

/** Список постов: [{id, title, excerpt, photo}]. */
export function getPosts() {
  return request("/api/posts");
}

/** Пост по id (404 → {error: "Post not found."}). */
export function getPost(id) {
  return request(`/api/posts/${id}`);
}

/** Создание поста (multipart): title, description, country, city, photo. */
export function createPost({ title, description, country, city, photo }) {
  const fd = new FormData();
  fd.append("title", title);
  fd.append("description", description);
  fd.append("country", country);
  fd.append("city", city);
  fd.append("photo", photo);
  return request("/api/posts", { method: "POST", body: fd, form: true });
}

export function getComments(postId) {
  return request(`/api/posts/${postId}/comments`);
}

export function createComment(postId, { fullName, comment }) {
  return request(`/api/posts/${postId}/comments`, {
    method: "POST",
    body: { full_name: fullName, comment },
  });
}
