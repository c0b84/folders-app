# Мои папки

PWA для создания папок с фото, съёмкой на камеру и экспортом в ZIP.
Все данные хранятся локально в браузере (IndexedDB).

## Логин по умолчанию
- Логин: `admin1238`
- Пароль: `Admin1238`

Меняются в `index.html` в блоке `const AUTH = { ... }`.

## Деплой на Cloudflare Pages

1. Создай репозиторий на GitHub и залей туда эти файлы.
2. Заходи в https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Выбери репозиторий.
4. Настройки сборки:
   - **Framework preset:** None
   - **Build command:** *(оставь пустым)*
   - **Build output directory:** `/`
5. **Save and Deploy**. Через ~30 секунд получишь ссылку вида `https://folders-app.pages.dev`.

## Обновление
Просто пуш в GitHub — Cloudflare пересоберёт автоматически.
При следующем открытии приложения появится плашка «Доступно обновление» → «Обновить».