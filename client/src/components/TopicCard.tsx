import { useNavigate } from "react-router-dom";
import { Category } from "../types";

interface TopicCardProps {
  category: Category;
}

export default function TopicCard({ category }: TopicCardProps) {
  const navigate = useNavigate();

  const subCount = category.subcategories?.length || 0;
  const qCount = category.questionCount || 0;

  return (
    <button
      onClick={() => navigate(`/category/${category.id}`)}
      className="group text-left bg-white border border-hairline border-t-4 border-t-ink
                 px-5 py-6 hover:border-t-ochre transition-colors"
    >
      <h3 className="text-lg font-semibold text-ink">{category.name}</h3>
      <p className="mt-2 text-sm text-slate">
        {subCount} subcategor{subCount === 1 ? "y" : "ies"} · {qCount} question{qCount === 1 ? "" : "s"}
      </p>
    </button>
  );
}
