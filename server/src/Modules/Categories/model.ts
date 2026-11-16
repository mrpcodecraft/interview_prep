import { ICategory, ISubcategory } from "./interface";

/**
 * @openapi
 * definitions:
 *   CreateCategorySchema:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 *         example: "Core JavaScript & Web Fundamentals"
 *   CreateSubcategorySchema:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       name:
 *         type: string
 *         example: "Language Core, Scope & Memory"
 */

export class CategoryModel {
  public id: string;
  public name: string;
  public subcategories: ISubcategory[];
  public questionCount?: number;

  constructor(data: ICategory) {
    this.id = data.id;
    this.name = data.name;
    this.subcategories = data.subcategories || [];
    this.questionCount = data.questionCount;
  }
}

export default CategoryModel;

