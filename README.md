# TravelBlog — фронтенд + мок-сервер API

Фронтенд по ТЗ и Swagger (/api/register, /api/login, /api/logout, /api/posts,
/api/posts/{id}, /api/posts/{id}/comments, /api/user, /api/user/password)
плюс мок-сервер API на чистом Node.js — настоящий бэкенд не требуется.

## Запуск (два терминала)

```bash
npm install

# Терминал 1 — мок-сервер API на http://127.0.0.1:8000
npm run mock

# Терминал 2 — фронтенд на http://localhost:5173
npm run dev
```

Proxy в `vite.config.js` уже настроен на мок-сервер. Данные хранятся в
`mock/db.json` (создаётся при первом запуске), загруженные фото — в
`mock/images/`. Тестовый аккаунт: `demo@travelblog.com` / `12345`.

Когда появится настоящий бэкенд — просто поменяйте `target` в
`vite.config.js` (или задайте `VITE_API_URL` в `.env` и уберите proxy).

## Структура

```
src/
  api/        — слой работы с бэкендом (fetch-обёртка и эндпоинты)
  context/    — состояние авторизации (AuthContext)
  components/ — переиспользуемые компоненты (Header, PostCard, CommentForm…)
  pages/      — страницы приложения (routes)
mock/
  mock-server.cjs — мок-API по Swagger (чистый Node, без зависимостей)
  images/        — фотографии мок-постов
  db.json        — данные (создаётся автоматически)
```

## Мок-сервер реализует Swagger один в один

| Назначение            | Метод  | Эндпоинт                  |
|-----------------------|--------|---------------------------|
| Регистрация           | POST   | /api/register             |
| Вход                  | POST   | /api/login                |
| Выход                 | GET    | /api/logout               |
| Список постов         | GET    | /api/posts                |
| Пост по ID            | GET    | /api/posts/{id}           |
| Создание поста        | POST   | /api/posts (multipart)    |
| Комментарии поста     | GET    | /api/posts/{id}/comments  |
| Новый комментарий     | POST   | /api/posts/{id}/comments  |
| Профиль               | GET    | /api/user                 |
| Правка профиля        | POST   | /api/user (multipart)     |
| Смена пароля          | PATCH  | /api/user/password        |
