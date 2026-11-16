import { ICategory } from "../../Categories/interface";
import { IQuestion } from "../../Questions/interface";

export interface IDatabase {
  categories: ICategory[];
  questions: IQuestion[];
}

