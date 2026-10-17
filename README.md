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
