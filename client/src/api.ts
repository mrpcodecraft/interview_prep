import { Category, Subcategory, Question, QuestionFilter, CreateQuestionPayload } from "./types";

const BASE = "/api";

async function handle<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.message || "Something went wrong.");
  }
  return data as T;
}

export const api = {
  getCategories: (): Promise<Category[]> =>
    fetch(`${BASE}/categories`).then((res) => handle<Category[]>(res)),

  createCategory: (name: string): Promise<Category> =>
    fetch(`${BASE}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then((res) => handle<Category>(res)),

  createSubcategory: (categoryId: string, name: string): Promise<Subcategory> =>
    fetch(`${BASE}/categories/${categoryId}/subcategories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }).then((res) => handle<Subcategory>(res)),

  getQuestions: (
    categoryId: string,
    { search = "", subcategoryId = "" }: QuestionFilter = {}
  ): Promise<Question[]> => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (subcategoryId) params.set("subcategoryId", subcategoryId);
    return fetch(`${BASE}/categories/${categoryId}/questions?${params}`).then((res) =>
      handle<Question[]>(res)
    );
  },

  createQuestion: (payload: CreateQuestionPayload): Promise<Question> =>
    fetch(`${BASE}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((res) => handle<Question>(res)),
};
