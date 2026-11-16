import q from "q";
import { v4 as uuid } from "uuid";
import HttpException from "../../Exceptions/http.exception";
import DBClient from "../utils/DB";
import { normalize } from "../utils/helpers";
import { ICreateQuestionDto, IQuestion, IQuestionFilter } from "./interface";

export default class QuestionService {
  private static $_instance: QuestionService = null;

  constructor() {}

  public static instance(): QuestionService {
    if (QuestionService.$_instance == null) {
      QuestionService.$_instance = new QuestionService();
    }
    return QuestionService.$_instance;
  }

  /**
   * @Comment Function  to get questions by category
   */
  public async getQuestionsByCategory(categoryId: string, filter?: any): Promise<IQuestion[]> {
    let defer: q.Deferred<IQuestion[]> = q.defer<IQuestion[]>();

    try {
      let dbClient = DBClient.instance();
      let db = dbClient.readDB();

      let results = db.questions.filter((q) => q.categoryId === categoryId);

      if (filter?.subcategoryId) {
        results = results.filter((q) => q.subcategoryId === filter.subcategoryId);
      }

      if (filter?.search && filter.search.trim()) {
        let term = normalize(filter.search);
        results = results.filter((q) => normalize(q.question).includes(term));
      }

      defer.resolve(results);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise as unknown as Promise<IQuestion[]>;
  }

  /**
   * @Comment Function  to get all questions
   */
  public async getAllQuestions(filter?: any): Promise<IQuestion[]> {
    let defer: q.Deferred<IQuestion[]> = q.defer<IQuestion[]>();

    try {
      let dbClient = DBClient.instance();
      let db = dbClient.readDB();

      let results = db.questions;

      if (filter?.categoryId) {
        results = results.filter((q) => q.categoryId === filter.categoryId);
      }

      if (filter?.subcategoryId) {
        results = results.filter((q) => q.subcategoryId === filter.subcategoryId);
      }

      if (filter?.search && filter.search.trim()) {
        let term = normalize(filter.search);
        results = results.filter((q) => normalize(q.question).includes(term));
      }

      defer.resolve(results);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise as unknown as Promise<IQuestion[]>;
  }

  /**
   * @Comment Function  to get question by id
   */
  public async getQuestionById(id: string): Promise<IQuestion> {
    let defer: q.Deferred<IQuestion> = q.defer<IQuestion>();

    try {
      let dbClient = DBClient.instance();
      let db = dbClient.readDB();

      let question = db.questions.find((q) => q.id === id);
      if (!question) {
        defer.reject(new HttpException(404, "Question not found."));
        return defer.promise as unknown as Promise<IQuestion>;
      }

      defer.resolve(question);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise as unknown as Promise<IQuestion>;
  }

  /**
   * @Comment Function  to create question
   */
  public async createQuestion(data: ICreateQuestionDto): Promise<IQuestion> {
    let defer: q.Deferred<IQuestion> = q.defer<IQuestion>();

    try {
      let { categoryId, subcategoryId, question, answer } = data;

      if (!categoryId || !subcategoryId || !question?.trim() || !answer?.trim()) {
        defer.reject(new HttpException(400, "All fields are required."));
        return defer.promise as unknown as Promise<IQuestion>;
      }

      let dbClient = DBClient.instance();
      let db = dbClient.readDB();

      let category = db.categories.find((c) => c.id === categoryId);
      if (!category) {
        defer.reject(new HttpException(404, "Category not found."));
        return defer.promise as unknown as Promise<IQuestion>;
      }

      let subExists = category.subcategories.some(
        (s) => s.id === subcategoryId
      );
      if (!subExists) {
        defer.reject(new HttpException(404, "Subcategory not found."));
        return defer.promise as unknown as Promise<IQuestion>;
      }

      let duplicate = db.questions.some(
        (q) =>
          q.categoryId === categoryId &&
          normalize(q.question) === normalize(question)
      );
      if (duplicate) {
        defer.reject(
          new HttpException(409, "This question already exists in this category.")
        );
        return defer.promise as unknown as Promise<IQuestion>;
      }

      let newQuestion: IQuestion = {
        id: uuid(),
        categoryId,
        subcategoryId,
        question: question.trim(),
        answer,
        createdAt: new Date().toISOString(),
      };

      db.questions.push(newQuestion);
      dbClient.writeDB(db);

      defer.resolve(newQuestion);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise as unknown as Promise<IQuestion>;
  }

  /**
   * @Comment Function  to update question
   */
  public async updateQuestion(id: string, data: any): Promise<IQuestion> {
    let defer: q.Deferred<IQuestion> = q.defer<IQuestion>();

    try {
      let dbClient = DBClient.instance();
      let db = dbClient.readDB();

      let index = db.questions.findIndex((q) => q.id === id);
      if (index === -1) {
        defer.reject(new HttpException(404, "Question not found."));
        return defer.promise as unknown as Promise<IQuestion>;
      }

      let current = db.questions[index];
      let updated: IQuestion = {
        ...current,
        ...(data.question ? { question: data.question.trim() } : {}),
        ...(data.answer ? { answer: data.answer } : {}),
        ...(data.subcategoryId ? { subcategoryId: data.subcategoryId } : {}),
        ...(data.categoryId ? { categoryId: data.categoryId } : {}),
      };

      db.questions[index] = updated;
      dbClient.writeDB(db);

      defer.resolve(updated);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise as unknown as Promise<IQuestion>;
  }

  /**
   * @Comment Function  to delete question
   */
  public async deleteQuestion(id: string): Promise<boolean> {
    let defer: q.Deferred<boolean> = q.defer<boolean>();

    try {
      let dbClient = DBClient.instance();
      let db = dbClient.readDB();

      let initialLength = db.questions.length;
      db.questions = db.questions.filter((q) => q.id !== id);

      if (db.questions.length === initialLength) {
        defer.reject(new HttpException(404, "Question not found."));
        return defer.promise as unknown as Promise<boolean>;
      }

      dbClient.writeDB(db);
      defer.resolve(true);
    } catch (err) {
      defer.reject(err);
    }

    return defer.promise as unknown as Promise<boolean>;
  }
}
