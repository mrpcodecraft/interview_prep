export interface IQuestion {
  id: string;
  categoryId: string;
  subcategoryId: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface ICreateQuestionDto {
  categoryId: string;
  subcategoryId: string;
  question: string;
  answer: string;
}

export interface IQuestionFilter {
  search?: string;
  subcategoryId?: string;
  categoryId?: string;
}

