import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import TopicCard from "../components/TopicCard";
import { Category } from "../types";

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getCategories().then((data) => {
      setCategories(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-14">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-ink">Knowledge Bank</h1>
        <p className="mt-2 text-slate">
          Browse questions by topic, or add a new one.
        </p>
      </header>

      {loading ? (
        <p className="text-slate">Loading topics…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <TopicCard key={category.id} category={category} />
          ))}

          <button
            onClick={() => navigate("/add")}
            className="flex flex-col items-center justify-center gap-2
                       border-2 border-dashed border-hairline px-5 py-6
                       text-ochre hover:border-ochre hover:bg-white transition-colors"
          >
            <span className="text-3xl leading-none">+</span>
            <span className="text-sm font-medium">Add a question</span>
          </button>
        </div>
      )}

      {!loading && categories.length === 0 && (
        <p className="mt-4 text-sm text-slate">
          No topics yet — use the card above to add your first question.
        </p>
      )}
    </div>
  );
}
