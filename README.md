
# Interview Preparation Application

A full-stack application to help users prepare for technical, behavioral, and mock interviews.

## Project Structure

This project consists of:

- **Frontend**: React application with TypeScript, TailwindCSS, and shadcn UI components
- **Backend**: Node.js with Express API server
- **Database**: PostgreSQL (through Prisma ORM)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

#### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file from the example:
   ```
   cp .env.example .env
   ```

4. Initialize the database:
   ```
   npm run prisma:migrate
   ```

5. Start the server:
   ```
   npm run dev
   ```
   The server will run on http://localhost:5000

#### Frontend Setup

1. In a new terminal, navigate to the project root directory

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The application will run on http://localhost:5173

## API Endpoints

### Interviews
- GET /api/interviews - Get all interviews
- GET /api/interviews/:id - Get interview by ID
- POST /api/interviews - Create new interview
- PUT /api/interviews/:id - Update interview
- DELETE /api/interviews/:id - Delete interview

### Resources
- GET /api/resources - Get all resources
- GET /api/resources/:id - Get resource by ID
- POST /api/resources - Create new resource
- PUT /api/resources/:id - Update resource
- DELETE /api/resources/:id - Delete resource

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- POST /api/users - Create new user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

## Technologies

- **Frontend**:
  - React
  - TypeScript
  - TailwindCSS
  - shadcn UI

- **Backend**:
  - Node.js
  - Express
  - Prisma ORM
  - PostgreSQL
