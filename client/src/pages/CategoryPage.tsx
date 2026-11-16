import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api";
import { Category, Question } from "../types";

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [search, setSearch] = useState<string>("");
  const [subcategoryId, setSubcategoryId] = useState<string>("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!categoryId) return;
    api.getCategories().then((cats) => {
      const found = cats.find((c) => c.id === categoryId);
      setCategory(found || null);
    });
  }, [categoryId]);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    api
      .getQuestions(categoryId, { search, subcategoryId })
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      });
  }, [categoryId, search, subcategoryId]);

  const subName = (id: string) =>
    category?.subcategories.find((s) => s.id === id)?.name || "";

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">
      <Link to="/" className="text-sm text-slate hover:text-ink">
        ← All topics
      </Link>

      <div className="flex items-start justify-between mt-4 mb-8 gap-4">
        <h1 className="text-3xl font-bold text-ink">
          {category ? category.name : "…"}
        </h1>
        <button
          onClick={() => navigate(`/add?category=${categoryId}`)}
          className="shrink-0 border border-ink text-ink px-4 py-2 text-sm font-medium
                     hover:bg-ink hover:text-paper transition-colors"
        >
          + Add question
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions…"
          className="flex-1 border border-hairline bg-white px-4 py-2 text-sm
                     focus:outline-none focus:border-ink"
        />
        <select
          value={subcategoryId}
          onChange={(e) => setSubcategoryId(e.target.value)}
          className="border border-hairline bg-white px-4 py-2 text-sm
                     focus:outline-none focus:border-ink"
        >
          <option value="">All subcategories</option>
          {category?.subcategories.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-slate">Loading questions…</p>
      ) : questions.length === 0 ? (
        <p className="text-slate text-sm">No questions match yet.</p>
      ) : (
        <ul className="divide-y divide-hairline border-t border-b border-hairline">
          {questions.map((q) => (
            <li key={q.id} className="py-4">
              <button
                onClick={() => setOpenId(openId === q.id ? null : q.id)}
                className="w-full text-left flex items-start justify-between gap-4"
              >
                <div>
                  <p className="font-medium text-ink">{q.question}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-slate">
                    {subName(q.subcategoryId)}
                  </p>
                </div>
                <span className="text-slate text-sm shrink-0">
                  {openId === q.id ? "Hide" : "Show"} answer
                </span>
              </button>

              {openId === q.id && (
                <div
                  className="answer-content mt-3 text-sm text-ink bg-white border border-hairline p-4"
                  dangerouslySetInnerHTML={{ __html: q.answer }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
