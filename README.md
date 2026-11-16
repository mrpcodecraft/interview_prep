# Knowledge Bank

A basic question-bank site: React + Tailwind CSS frontend, Node/Express backend, data stored in a JSON file (no database needed).

## Project structure

```
knowledge-bank/
├── server/          # Express API (TypeScript)
│   ├── src/
│   │   ├── Modules/
│   │   │   ├── Categories/
│   │   │   ├── Questions/
│   │   │   └── utils/
│   │   ├── index.ts
│   │   ├── router.ts
│   │   └── server.ts
│   └── data/db.json # all categories, subcategories & questions live here
└── client/          # React + Tailwind (Vite + TypeScript) frontend
    └── src/
        ├── pages/Home.tsx           # Page 1 — topic cards
        ├── pages/CategoryPage.tsx   # Page 2 — Q&A list, search + filter
        └── pages/AddQuestion.tsx    # Page 3 — add form
```

## Running it locally

You need two terminals — one for the API, one for the frontend.

**Terminal 1 — backend**

```bash
cd server
npm install
npm start
```

Runs on http://localhost:4000

**Terminal 2 — frontend**

```bash
cd client
npm install
npm run dev
```

Runs on http://localhost:5173 — open this in your browser. The Vite dev server proxies `/api` calls to the backend automatically (see `vite.config.ts`).

## Answer editor: react-quill

The answer field uses **react-quill**, a free, open-source WYSIWYG editor (no license key, no paid tier, no usage caps). Toolbar currently supports bold/italic/underline, ordered/bullet lists, and links — edit the `modules.toolbar` array in `AddQuestion.tsx` to add more.

Everything in this build (React, Tailwind, Express, uuid, react-router, react-quill) is free and open-source with no usage caps.

## How data is stored

Everything lives in `server/data/db.json`:

```json
{
  "categories": [
    {
      "id": "...",
      "name": "Physics",
      "subcategories": [{ "id": "...", "name": "Mechanics" }]
    }
  ],
  "questions": [
    {
      "id": "...",
      "categoryId": "...",
      "subcategoryId": "...",
      "question": "...",
      "answer": "<p>...</p>"
    }
  ]
}
```

This is fine for a small/medium question bank. If it grows large (many thousands of questions) or you want multiple people editing at once, you'll eventually want to move this to a real database (e.g. Supabase's free tier) — the API layer is written so that swap wouldn't touch your React code at all.

## Notes on what's enforced

- **Uniqueness**: the backend rejects a new question if the same question text (case/whitespace-insensitive) already exists _within the same category_.
- **Subcategory lock**: on the Add form, the subcategory dropdown is disabled until a category is selected or a new one is typed in.
- **All fields required**: category, subcategory, question, and answer are all required before the form submits.
- On successful save, the user is redirected to the homepage.
