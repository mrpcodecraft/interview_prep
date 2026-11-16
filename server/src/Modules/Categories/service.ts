import q from "q";
import { v4 as uuid } from "uuid";
import HttpException from "../../Exceptions/http.exception";
import DBClient from "../utils/DB";
import { normalize } from "../utils/helpers";
import { ICategory, ISubcategory } from "./interface";

export default class CategoryService {
  private static $_instance: CategoryService = null;

  constructor() {}

  public static instance(): CategoryService {
    if (CategoryService.$_instance == null) {
      CategoryService.$_instance = new CategoryService();
    }
    return CategoryService.$_instance;
  }

  /**
   * @Comment Function  to get all categories
   */
  public async getCategories(): Promise<ICategory[]> {
    let defer: q.Deferred<ICategory[]> = q.defer<ICategory[]>();

    try {
      let dbClient = DBClient.instance();
      let db = dbClient.readDB();

      let withCounts: ICategory[] = db.categories.map((c: ICategory) => ({
        ...c,
        questionCount: db.questions.filter((q) => q.categoryId === c.id).length,
      }));

      defer.resolve(withCounts);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise as unknown as Promise<ICategory[]>;
  }

  /**
   * @Comment Function  to get category by id
   */
  public async getCategoryById(id: string): Promise<ICategory> {
    let defer: q.Deferred<ICategory> = q.defer<ICategory>();

    try {
      let dbClient = DBClient.instance();
      let db = dbClient.readDB();

      let category = db.categories.find((c) => c.id === id);
      if (!category) {
        defer.reject(new HttpException(404, "Category not found."));
        return defer.promise as unknown as Promise<ICategory>;
      }

      let withCount: ICategory = {
        ...category,
        questionCount: db.questions.filter((q) => q.categoryId === category.id).length,
      };

      defer.resolve(withCount);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise as unknown as Promise<ICategory>;
  }

  /**
   * @Comment Function  to create category
   */
  public async createCategory(name: string): Promise<{ data: ICategory; isNew: boolean }> {
    let defer: q.Deferred<{ data: ICategory; isNew: boolean }> =
      q.defer<{ data: ICategory; isNew: boolean }>();

    try {
      if (!name || !name.trim()) {
        defer.reject(new HttpException(400, "Category name is required."));
        return defer.promise as unknown as Promise<{ data: ICategory; isNew: boolean }>;
      }

      let dbClient = DBClient.instance();
      let db = dbClient.readDB();

      let existing = db.categories.find(
        (c) => normalize(c.name) === normalize(name)
      );

      if (existing) {
        defer.resolve({ data: existing, isNew: false });
        return defer.promise as unknown as Promise<{ data: ICategory; isNew: boolean }>;
      }

      let category: ICategory = {
        id: uuid(),
        name: name.trim(),
        subcategories: [],
      };

      db.categories.push(category);
      dbClient.writeDB(db);

      defer.resolve({ data: category, isNew: true });
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise as unknown as Promise<{ data: ICategory; isNew: boolean }>;
  }

  /**
   * @Comment Function  to create subcategory
   */
  public async createSubcategory(
    categoryId: string,
    name: string
  ): Promise<{ data: ISubcategory; isNew: boolean }> {
    let defer: q.Deferred<{ data: ISubcategory; isNew: boolean }> =
      q.defer<{ data: ISubcategory; isNew: boolean }>();

    try {
      if (!name || !name.trim()) {
        defer.reject(new HttpException(400, "Subcategory name is required."));
        return defer.promise as unknown as Promise<{ data: ISubcategory; isNew: boolean }>;
      }

      let dbClient = DBClient.instance();
      let db = dbClient.readDB();

      let category = db.categories.find((c) => c.id === categoryId);
      if (!category) {
        defer.reject(new HttpException(404, "Category not found."));
        return defer.promise as unknown as Promise<{ data: ISubcategory; isNew: boolean }>;
      }

      let existing = category.subcategories.find(
        (s) => normalize(s.name) === normalize(name)
      );

      if (existing) {
        defer.resolve({ data: existing, isNew: false });
        return defer.promise as unknown as Promise<{ data: ISubcategory; isNew: boolean }>;
      }

      let subcategory: ISubcategory = {
        id: uuid(),
        name: name.trim(),
      };

      category.subcategories.push(subcategory);
      dbClient.writeDB(db);

      defer.resolve({ data: subcategory, isNew: true });
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise as unknown as Promise<{ data: ISubcategory; isNew: boolean }>;
  }
}
