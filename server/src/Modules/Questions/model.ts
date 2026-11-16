import { IQuestion } from "./interface";

/**
 * @openapi
 * definitions:
 *   CreateQuestionSchema:
 *     type: object
 *     required:
 *       - categoryId
 *       - subcategoryId
 *       - question
 *       - answer
 *     properties:
 *       categoryId:
 *         type: string
 *         example: "72a7ab95-358a-4060-8a90-e5678045e340"
 *       subcategoryId:
 *         type: string
 *         example: "8d8fd3f4-b9f6-4983-86f2-f293a82cbc7b"
 *       question:
 *         type: string
 *         example: "What is the difference between var, let, and const?"
 *       answer:
 *         type: string
 *         example: "<p>var is function scoped, while let and const are block scoped...</p>"
 *   UpdateQuestionSchema:
 *     type: object
 *     properties:
 *       categoryId:
 *         type: string
 *       subcategoryId:
 *         type: string
 *       question:
 *         type: string
 *       answer:
 *         type: string
 */

export class QuestionModel {
  public id: string;
  public categoryId: string;
  public subcategoryId: string;
  public question: string;
  public answer: string;
  public createdAt: string;

  constructor(data: IQuestion) {
    this.id = data.id;
    this.categoryId = data.categoryId;
    this.subcategoryId = data.subcategoryId;
    this.question = data.question;
    this.answer = data.answer;
    this.createdAt = data.createdAt;
  }
}

export default QuestionModel;

