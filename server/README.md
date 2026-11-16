# Knowledge Bank API

The Knowledge Bank API is a question-bank management application built using Node.js and TypeScript.
It provides an intuitive and efficient way to organize categories, subcategories, and technical questions.
This app is designed to streamline knowledge sharing and technical interview preparation.

## Features

- **Category Management**: Create, view, and organize topics and subcategories effortlessly.
- **Question Bank**: Manage questions and rich-text answers across categories.
- **Search and Filtering**: Search questions by keyword and filter by subcategory.
- **Data Integrity**: Enforces uniqueness per category to avoid duplicate questions.
- **Swagger Documentation**: Interactive API testing available at `/explorer`.

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. Start the application:

   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:4000/explorer
   ```

## Technologies Used

- Node.js
- Express.js
- TypeScript
- Swagger / OpenAPI

## Base URL

```
http://localhost:4000
```

## Endpoints

### Categories

- `GET /categories` - Get all categories with question count
- `GET /categories/{id}` - Get category by ID
- `POST /categories` - Create new category
- `POST /categories/{categoryId}/subcategories` - Create subcategory
- `GET /categories/{categoryId}/questions` - Get questions under category

### Questions

- `GET /questions` - Get all questions
- `GET /questions/{id}` - Get question by ID
- `POST /questions` - Create question
- `PUT /questions/{id}` - Update question
- `DELETE /questions/{id}` - Delete question

## License

This project is licensed under the [ISC License](LICENSE).

## Author

Test User
