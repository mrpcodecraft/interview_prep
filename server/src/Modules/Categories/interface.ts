export interface ISubcategory {
  id: string;
  name: string;
}

export interface ICategory {
  id: string;
  name: string;
  subcategories: ISubcategory[];
  questionCount?: number;
}

export interface ICreateCategoryDto {
  name: string;
}

export interface ICreateSubcategoryDto {
  name: string;
}

