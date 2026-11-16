import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import AddQuestion from "./pages/AddQuestion";

export default function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<CategoryPage />} />
        <Route path="/add" element={<AddQuestion />} />
      </Routes>
    </div>
  );
}
