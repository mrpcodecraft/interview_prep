export interface Subcategory {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
  questionCount?: number;
}

export interface Question {
  id: string;
  categoryId: string;
  subcategoryId: string;
  question: string;
  answer: string;
  createdAt?: string;
}

export interface QuestionFilter {
  search?: string;
  subcategoryId?: string;
}

export interface CreateQuestionPayload {
  categoryId: string;
  subcategoryId: string;
  question: string;
  answer: string;
}
