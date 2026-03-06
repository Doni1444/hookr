# Hookr MVP (Frontend + Backend)

## Что реализовано
- Backend на **Node.js + Express**.
- API endpoint: `POST /api/ideas`.
- Endpoint принимает `niche` из frontend.
- Подключен OpenAI API (Chat Completions REST API).
- Ответ возвращается в формате:

```json
{
  "trends": "...",
  "reelsIdeas": ["...", "...", "..."],
  "headlineIdeas": ["...", "...", "..."]
}
```

- Frontend отправляет `fetch`-запрос по кнопке **"Найти идеи"**.
- Есть `loading` state во время генерации.
- Есть отображение ошибок, если backend/API недоступен.
- API ключ хранится в `.env` (локально, в git не коммитится).

## Как запустить
1. Установить зависимости:

```bash
npm install
```

2. Создать `.env` на основе примера:

```bash
cp .env.example .env
```

3. Вставить реальный ключ в `.env`:

```env
OPENAI_API_KEY=ваш_реальный_ключ
BACKEND_PORT=4000
```

4. Запустить backend + frontend одновременно:

```bash
npm run dev
```

5. Открыть приложение:
- `http://localhost:3000`

## Отдельный запуск (по желанию)
- Только backend:

```bash
npm run server
```

- Только frontend:

```bash
npm start
```
