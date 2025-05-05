# BusinessBlueprint

## Overview
BusinessBlueprint is a comprehensive application designed to assist businesses in managing various aspects of their operations, including clients, expenses, forecasting, market analysis, and more. The application is built using modern web technologies and provides a user-friendly interface for efficient business management.

## Features
- **Client Management**: Add, edit, and view client details.
- **Expense Tracking**: Record and monitor business expenses.
- **Forecasting**: Generate financial forecasts based on input data.
- **Market Analysis**: Analyze market trends and competitor data.
- **Pitch Deck Generator**: Create professional pitch decks for presentations.
- **Legal Resources**: Access legal templates and resources.
- **Dashboard**: View quick stats and recent activities.

## Technologies Used
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express
- **Database**: Prisma (ORM)
- **Containerization**: Docker

## Folder Structure
Use code with caution.
Markdown
client/
src/
components/
assistant/
business-plans/
clients/
dashboard/
dice-game/
expenses/
forecasting/
layout/
legal/
market-analysis/
pitch-deck/
ui/
hooks/
lib/
pages/
server/
db.ts
index.ts
routes.ts
storage.ts
shared/
schema.ts
prisma/ # Added for Prisma
schema.prisma
migrations/
.env # Added for environment variables
*(Note: Adjusted folder structure slightly to reflect typical Prisma usage and added `.env`)*

## Setup Instructions (Local Development)
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd BusinessBlueprint
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  **Database Setup (Prisma):** See the "Database Management (Prisma)" section below. Ensure your database connection string is correctly set in a `.env` file at the project root.
5.  Start the development servers (adjust command if needed for concurrent client/server):
    ```bash
    npm run dev
    ```
6.  Open the application in your browser at `http://localhost:3000`.

## Database Management (Prisma)

This project uses **Prisma** as the ORM for database management, providing a type-safe way to interact with the database.

*(Note: Prisma replaces Drizzle ORM, which was previously used but switched due to security vulnerabilities.)*

### Setup Steps:

1.  Ensure you have installed dependencies (`npm install`), which includes Prisma CLI as a dev dependency.
2.  Configure your database connection URL in the `.env` file at the project root. Example for PostgreSQL:
    ```env
    DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
    ```
3.  Define your database schema in `prisma/schema.prisma`.
4.  Run migrations to apply schema changes to your database:
    ```bash
    npx prisma migrate dev
    ```
5.  Generate Prisma Client (usually run automatically after migrate, but can be run manually):
    ```bash
    npx prisma generate
    ```

### Key Prisma Commands:
-   `npx prisma migrate dev`: Apply migrations during development.
-   `npx prisma generate`: Generate/update the Prisma Client.
-   `npx prisma studio`: Open a GUI to view/edit database data.

## Running with Docker
Alternatively, you can run the application using Docker and Docker Compose.

1.  Ensure you have Docker and Docker Compose installed.
2.  Make sure your `.env` file is configured, especially the `DATABASE_URL` which might point to a service within the Docker network (e.g., a Postgres container). *Adjust `docker-compose.yml` as needed.*
3.  Build the Docker images:
    ```bash
    docker-compose build
    ```
4.  Start the containers:
    ```bash
    docker-compose up
    ```
5.  Access the application at `http://localhost:3000` (or as configured in your `docker-compose.yml`).

## Development Details
-   **Frontend**: The frontend is built with React and Vite. The entry point is `client/index.html`. Files are located in the `client/` directory.
-   **Backend**: The backend is built with Node.js, Express, and TypeScript. The main server entry point is `server/index.ts`. Files are located in the `server/` directory.

## Testing
Run the test suite using:
```bash
npm test
Use code with caution.
(Note: Ensure test environment setup, including potential test database configuration, is handled)
Contributing
Fork the repository.
Create a new branch for your feature or bugfix:
git checkout -b feature-name
Use code with caution.
Bash
Commit your changes:
git commit -m "Description of changes"
Use code with caution.
Bash
Push to your fork:
git push origin feature-name
Use code with caution.
Bash
Create a pull request against the main branch of the original repository.
License
This project is licensed under the MIT License.
**Summary of Changes:**

1.  **Resolved Conflict:** Removed the `<<<<<<<`, `=======`, `>>>>>>>` markers.
2.  **Unified ORM:** Updated "Technologies Used" to list **Prisma**. Added a note in the "Database Management" section explicitly mentioning the switch from Drizzle.
3.  **Integrated Setup:** Provided clear sections for both "Setup Instructions (Local Development)" and "Running with Docker".
4.  **Added Prisma Details:** Included the Prisma setup instructions from the conflicting branch under a dedicated "Database Management (Prisma)" section.
5.  **Included Development Details:** Added the Frontend/Backend entry point information from the conflicting branch under "Development Details".
6.  **Minor Structure Adjustments:** Added `prisma/` and `.env` to the folder structure example for clarity. Added placeholders/notes regarding `.env` configuration for both local and Docker setups.
7.  **Removed Empty "Scripts" Heading:** The heading was present in one conflict branch but had no content. It was removed for now.
