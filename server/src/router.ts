import { Application } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import CategoryController from "./Modules/Categories";
import QuestionController from "./Modules/Questions";
import { version } from "../package.json";

export class Router {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public initializeRoutes = () => {
    this.app.get("/", (req, res) => {
      res.status(200).send({
        message: "Hello World!",
      });
    });

    this.app.use("/categories", new CategoryController().router);
    this.app.use("/questions", new QuestionController().router);
    this.app.use("/api/categories", new CategoryController().router);
    this.app.use("/api/questions", new QuestionController().router);

    const options = {
      swaggerDefinition: {
        openapi: "3.0.0",
        info: {
          title: "Knowledge Bank",
          version,
          summary: "The Knowledge Bank API is a question-bank management application.",
          description: "It provides an intuitive and efficient way to organize your categories, subcategories, and questions.",
          contact: {
            "name": "Mohit Raj Panday",
            // "email": "test@test.com"
          },
          servers: ["http://localhost:4000"]
        },
        tags: [{
          name: "Categories",
          description: "Everything about categories.",
        }, {
          name: "Questions",
          description: "Everything about questions.",
        }],
        components: {
          securitySchemes: {
            bearerToken: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT"
            }
          }
        },
      },
      apis: ["src/**/*.ts", "dist/src/**/*.js"],
    };

    const swaggerOptions = {
      // customCss: '.swagger-ui .auth-wrapper { display: none }',
      sorter: "alphabetical",
      swaggerOptions: {},
    };

    const swaggerDocs = swaggerJsdoc(options);

    this.app.use(
      "/explorer",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocs, swaggerOptions)
    );
  };
}
