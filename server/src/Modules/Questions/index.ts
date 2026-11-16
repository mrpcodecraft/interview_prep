import { Request, Response, NextFunction, Router } from "express";
import QuestionService from "./service";

export default class QuestionController {
  public router: Router = Router({
    mergeParams: true,
  });

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    /**
    * @swagger
    * /questions:
    *   get:
    *     tags: 
    *       - Questions
    *     description: "API for getting questions"
    *     summary: "Get questions"
    *     consumes: application/json
    *     produces: application/json
    *     responses:
    *       200: 
    *         description: "Query executed successfully"
    *       400: 
    *         description: "Bad API call received"
    *       404: 
    *         description: "Data not found"
    *       500: 
    *         description: "Server error"
    *     parameters:
    *       - in: "query"
    *         name: "categoryId"
    *         type: "string"
    *       - in: "query"
    *         name: "subcategoryId"
    *         type: "string"
    *       - in: "query"
    *         name: "search"
    *         type: "string"
    */
    this.router.get("/", this.getAllQuestions);

    /**
    * @swagger
    * /questions/{id}:
    *   get:
    *     tags: 
    *       - Questions
    *     description: "API for getting question by id"
    *     summary: "Get question by id"
    *     consumes: application/json
    *     produces: application/json
    *     responses:
    *       200: 
    *         description: "Query executed successfully"
    *       400: 
    *         description: "Bad API call received"
    *       404: 
    *         description: "Data not found"
    *       500: 
    *         description: "Server error"
    *     parameters:
    *       - in: "path"
    *         name: "id"
    *         type: "string"
    *         required: true
    */
    this.router.get("/:id", this.getQuestionById);

    /**
    * @swagger
    * /questions:
    *   post:
    *     tags: 
    *       - Questions
    *     description: "API for creating questions"
    *     summary: "Add question"
    *     consumes: application/json
    *     produces: application/json
    *     responses:
    *       201: 
    *         description: "Question created successfully"
    *       400: 
    *         description: "Bad API call received"
    *       404: 
    *         description: "Data not found"
    *       409: 
    *         description: "Question already exists"
    *       500: 
    *         description: "Server error"
    *     requestBody:
    *       content:
    *         "application/json":
    *           schema:
    *             $ref: "#/definitions/CreateQuestionSchema"
    */
    this.router.post("/", this.createQuestion);

    /**
    * @swagger
    * /questions/{id}:
    *   put:
    *     tags: 
    *       - Questions
    *     description: "API for updating question by id"
    *     summary: "Update question"
    *     consumes: application/json
    *     produces: application/json
    *     responses:
    *       200: 
    *         description: "Query executed successfully"
    *       400: 
    *         description: "Bad API call received"
    *       404: 
    *         description: "Data not found"
    *       500: 
    *         description: "Server error"
    *     parameters:
    *       - in: "path"
    *         name: "id"
    *         type: "string"
    *         required: true
    *     requestBody:
    *       content:
    *         "application/json":
    *           schema:
    *             $ref: "#/definitions/UpdateQuestionSchema"
    */
    this.router.put("/:id", this.updateQuestion);

    /**
    * @swagger
    * /questions/{id}:
    *   delete:
    *     tags: 
    *       - Questions
    *     description: "API for deleting question by id"
    *     summary: "Delete question"
    *     consumes: application/json
    *     produces: application/json
    *     responses:
    *       200: 
    *         description: "Query executed successfully"
    *       404: 
    *         description: "Data not found"
    *       500: 
    *         description: "Server error"
    *     parameters:
    *       - in: "path"
    *         name: "id"
    *         type: "string"
    *         required: true
    */
    this.router.delete("/:id", this.deleteQuestion);
  }

  private async getAllQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      let questionSrvc: QuestionService = QuestionService.instance();
      let questions = await questionSrvc.getAllQuestions(req.query);
      res.send(questions);
    } catch (err) {
      next(err);
    }
  }

  private async getQuestionById(req: Request, res: Response, next: NextFunction) {
    try {
      let questionSrvc: QuestionService = QuestionService.instance();
      let question = await questionSrvc.getQuestionById(req.params.id);
      res.send(question);
    } catch (err) {
      next(err);
    }
  }

  private async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      let questionSrvc: QuestionService = QuestionService.instance();
      let question = await questionSrvc.createQuestion(req.body);
      res.status(201).send(question);
    } catch (err) {
      next(err);
    }
  }

  private async updateQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      let questionSrvc: QuestionService = QuestionService.instance();
      let question = await questionSrvc.updateQuestion(req.params.id, req.body);
      res.send(question);
    } catch (err) {
      next(err);
    }
  }

  private async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      let questionSrvc: QuestionService = QuestionService.instance();
      await questionSrvc.deleteQuestion(req.params.id);
      res.send({ message: "Question deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}
