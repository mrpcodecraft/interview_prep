import { useEffect, useState, FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { api } from "../api";
import { Category } from "../types";

const OTHER = "__other__";

function isAnswerEmpty(html: string): boolean {
  return !html || html.replace(/<(.|\n)*?>/g, "").trim().length === 0;
}

export default function AddQuestion() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get("category") || "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string>(preselectedCategory);
  const [newCategoryName, setNewCategoryName] = useState<string>("");

  const [subcategoryId, setSubcategoryId] = useState<string>("");
  const [newSubcategoryName, setNewSubcategoryName] = useState<string>("");

  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");

  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const isNewCategory = categoryId === OTHER;
  const isNewSubcategory = subcategoryId === OTHER;
  const categoryChosen =
    (categoryId && !isNewCategory) || (isNewCategory && newCategoryName.trim().length > 0);

  function handleCategoryChange(value: string) {
    setCategoryId(value);
    setSubcategoryId("");
    setNewSubcategoryName("");
    if (value !== OTHER) setNewCategoryName("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (
      !categoryId ||
      (isNewCategory && !newCategoryName.trim()) ||
      !subcategoryId ||
      (isNewSubcategory && !newSubcategoryName.trim()) ||
      !question.trim() ||
      isAnswerEmpty(answer)
    ) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);
    try {
      let finalCategoryId = categoryId;
      if (isNewCategory) {
        const created = await api.createCategory(newCategoryName.trim());
        finalCategoryId = created.id;
      }

      let finalSubcategoryId = subcategoryId;
      if (isNewSubcategory) {
        const created = await api.createSubcategory(
          finalCategoryId,
          newSubcategoryName.trim()
        );
        finalSubcategoryId = created.id;
      }

      await api.createQuestion({
        categoryId: finalCategoryId,
        subcategoryId: finalSubcategoryId,
        question: question.trim(),
        answer,
      });

      navigate("/");
    } catch (err: any) {
      setError(err?.message || "Failed to save question.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-14">
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-slate hover:text-ink"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold text-ink mt-4 mb-8">Add a question</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Category
          </label>
          <select
            required
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full border border-hairline bg-white px-4 py-2 text-sm focus:outline-none focus:border-ink"
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            <option value={OTHER}>Other…</option>
          </select>
          {isNewCategory && (
            <input
              required
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
              className="mt-2 w-full border border-hairline bg-white px-4 py-2 text-sm focus:outline-none focus:border-ink"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Subcategory
          </label>
          <select
            required
            disabled={!categoryChosen}
            value={subcategoryId}
            onChange={(e) => setSubcategoryId(e.target.value)}
            className="w-full border border-hairline bg-white px-4 py-2 text-sm
                       focus:outline-none focus:border-ink disabled:bg-hairline/30 disabled:cursor-not-allowed"
          >
            <option value="">
              {categoryChosen ? "Select a subcategory" : "Select a category first"}
            </option>
            {!isNewCategory &&
              selectedCategory?.subcategories.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            {categoryChosen && <option value={OTHER}>Other…</option>}
          </select>
          {isNewSubcategory && (
            <input
              required
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              placeholder="New subcategory name"
              className="mt-2 w-full border border-hairline bg-white px-4 py-2 text-sm focus:outline-none focus:border-ink"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Question
          </label>
          <textarea
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={4}
            className="w-full border border-hairline bg-white px-4 py-2 text-sm focus:outline-none focus:border-ink"
            placeholder="Type the question…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            Answer
          </label>
          <div className="bg-white border border-hairline">
            <ReactQuill
              theme="snow"
              value={answer}
              onChange={setAnswer}
              placeholder="Type the answer…"
              modules={{
                toolbar: [
                  ["bold", "italic", "underline"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["link"],
                  ["clean"],
                ],
              }}
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="border border-ink bg-ink text-paper px-6 py-2 text-sm font-medium
                     hover:bg-ochre hover:border-ochre transition-colors disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Save question"}
        </button>
      </form>
    </div>
  );
}
