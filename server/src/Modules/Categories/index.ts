import { Request, Response, NextFunction, Router } from "express";
import CategoryService from "./service";
import QuestionService from "../Questions/service";

export default class CategoryController {
  public router: Router = Router({
    mergeParams: true,
  });

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    /**
    * @swagger
    * /categories:
    *   get:
    *     tags:
    *       - Categories
    *     description: "API for getting all categories"
    *     summary: "Get all categories"
    *     consumes: application/json
    *     produces: application/json
    *     responses:
    *       200:
    *         description: "Query executed successfully"
    *       500:
    *         description: "Server error"
    */
    this.router.get("/", this.getCategories);

    /**
    * @swagger
    * /categories:
    *   post:
    *     tags:
    *       - Categories
    *     description: "API for creating category"
    *     summary: "Create category"
    *     consumes: application/json
    *     produces: application/json
    *     requestBody:
    *       content:
    *         "application/json":
    *           schema:
    *             $ref: "#/definitions/CreateCategorySchema"
    *     responses:
    *       200:
    *         description: "Category exists"
    *       201:
    *         description: "Category created successfully"
    *       400:
    *         description: "Bad API call received"
    *       500:
    *         description: "Server error"
    */
    this.router.post("/", this.createCategory);

    /**
    * @swagger
    * /categories/{id}:
    *   get:
    *     tags:
    *       - Categories
    *     description: "API for getting category by id"
    *     summary: "Get category by id"
    *     consumes: application/json
    *     produces: application/json
    *     parameters:
    *       - in: "path"
    *         name: "id"
    *         type: "string"
    *         required: true
    *         description: "Category id"
    *     responses:
    *       200:
    *         description: "Query executed successfully"
    *       404:
    *         description: "Data not found"
    *       500:
    *         description: "Server error"
    */
    this.router.get("/:id", this.getCategoryById);

    /**
    * @swagger
    * /categories/{categoryId}/subcategories:
    *   post:
    *     tags:
    *       - Categories
    *     description: "API for creating subcategory"
    *     summary: "Create subcategory"
    *     consumes: application/json
    *     produces: application/json
    *     parameters:
    *       - in: "path"
    *         name: "categoryId"
    *         type: "string"
    *         required: true
    *         description: "Category id"
    *     requestBody:
    *       content:
    *         "application/json":
    *           schema:
    *             $ref: "#/definitions/CreateSubcategorySchema"
    *     responses:
    *       200:
    *         description: "Subcategory exists"
    *       201:
    *         description: "Subcategory created successfully"
    *       400:
    *         description: "Bad API call received"
    *       404:
    *         description: "Data not found"
    *       500:
    *         description: "Server error"
    */
    this.router.post("/:categoryId/subcategories", this.createSubcategory);

    /**
    * @swagger
    * /categories/{categoryId}/questions:
    *   get:
    *     tags:
    *       - Categories
    *       - Questions
    *     description: "API for getting questions by category"
    *     summary: "Get questions for category"
    *     consumes: application/json
    *     produces: application/json
    *     parameters:
    *       - in: "path"
    *         name: "categoryId"
    *         type: "string"
    *         required: true
    *       - in: "query"
    *         name: "search"
    *         type: "string"
    *       - in: "query"
    *         name: "subcategoryId"
    *         type: "string"
    *     responses:
    *       200:
    *         description: "Query executed successfully"
    *       500:
    *         description: "Server error"
    */
    this.router.get("/:categoryId/questions", this.getQuestionsByCategory);
  }

  private async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      let categorySrvc: CategoryService = CategoryService.instance();
      let categories = await categorySrvc.getCategories();
      res.send(categories);
    } catch (err) {
      next(err);
    }
  }

  private async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      let categorySrvc: CategoryService = CategoryService.instance();
      let category = await categorySrvc.getCategoryById(req.params.id);
      res.send(category);
    } catch (err) {
      next(err);
    }
  }

  private async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      let categorySrvc: CategoryService = CategoryService.instance();
      let result = await categorySrvc.createCategory(req.body.name);
      if (result.isNew) {
        res.status(201).send(result.data);
      } else {
        res.send(result.data);
      }
    } catch (err) {
      next(err);
    }
  }

  private async createSubcategory(req: Request, res: Response, next: NextFunction) {
    try {
      let categorySrvc: CategoryService = CategoryService.instance();
      let result = await categorySrvc.createSubcategory(req.params.categoryId, req.body.name);
      if (result.isNew) {
        res.status(201).send(result.data);
      } else {
        res.send(result.data);
      }
    } catch (err) {
      next(err);
    }
  }

  private async getQuestionsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      let questionSrvc: QuestionService = QuestionService.instance();
      let questions = await questionSrvc.getQuestionsByCategory(req.params.categoryId, req.query);
      res.send(questions);
    } catch (err) {
      next(err);
    }
  }
}
