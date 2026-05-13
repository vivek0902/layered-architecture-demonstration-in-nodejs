# Layered Architecture Backend (Node.js + TypeScript)

A backend API demonstrating a layered architecture in Node.js using TypeScript,
Express, and MongoDB (Mongoose).

## Tech Stack

- Node.js
- TypeScript
- Express 5
- MongoDB + Mongoose
- ESLint + Prettier

## Project Structure

```text
src/
  app.ts
  server.ts
  env.ts
  dns.ts
  config/
    index.ts
    db.config.ts
  constants/
  controllers/
    tool.controller.ts
  models/
    tool.schema.ts
  repository/
    base.repository.ts
    tool.repository.ts
  routes/
    index.route.ts
    toolbox.route.ts
  sevices/
    tool.service.ts
  utils/
    apiResponse.util.ts
```

## Layered Flow

Request flow:

`Route -> Controller -> Service -> Repository -> Model (Mongoose)`

Responsibilities:

- Route: HTTP path and handler mapping
- Controller: Request parsing and response formatting
- Service: Business logic and orchestration
- Repository: Data-access abstraction
- Model: MongoDB schema and query helpers

## Prerequisites

- Node.js 18+
- npm
- MongoDB instance (local or cloud)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

On Windows PowerShell, use:

```powershell
Copy-Item .env.example .env
```

3. Update `.env` values (especially `MONGODB_URI`).

4. Start in development mode:

```bash
npm run dev
```

## Available Scripts

- `npm run dev`: Start dev server with auto-reload
- `npm run start`: Start server with ts-node
- `npm run build`: Compile TypeScript
- `npm run lint`: Run ESLint with fix
- `npm run format`: Format source files
- `npm run test`: Run tests (Jest)

## Environment Variables

From `.env.example` and config defaults:

- `PORT`: Server port (default in config: `3001`)
- `MONGODB_URI`: MongoDB connection URI
- `LOG_LEVEL`: Logging level (default: `info`)
- `NODE_ENV`: `development | production | test`
- `DNS_SERVERS`: Comma-separated DNS servers (default: `1.1.1.1,8.8.8.8`)
- `API_PREFIX`: API prefix (default: `/api/v1`)
- `API_VERSION`: API version label (default: `v1`)
- `CORS_ORIGIN`: Allowed origin (default: `*`)
- `CORS_CREDENTIALS`: `true` or `false` (default: `false`)
- `CORS_METHODS`: Allowed methods (default: `GET,POST,PUT,DELETE,OPTIONS`)

## API Base URL

By default:

- Service root: `http://localhost:3001/`
- API base: `http://localhost:3001/api/v1`

## Endpoints

Tools routes are mounted under `/api/v1/tools`.

- `GET /api/v1/tools/` : List tools
- `GET /api/v1/tools/popular` : List popular tools
- `GET /api/v1/tools/category/:category` : List tools by category
- `GET /api/v1/tools/:id` : Get tool by id
- `POST /api/v1/tools/create` : Create tool
- `POST /api/v1/tools/create/bulk` : Create tools in bulk
- `PUT /api/v1/tools/:id` : Update tool
- `DELETE /api/v1/tools/delete/:id` : Delete single tool
- `DELETE /api/v1/tools/delete/bulk` : Delete tools in bulk

### Query Params for Listing

`GET /api/v1/tools/` supports:

- `category` (string)
- `popular=true`
- `search` (string)
- `limit` (number)
- `skip` (number)
- `sort` (field name, ascending)

Example:

```http
GET /api/v1/tools/?category=IDE&popular=true&limit=10&skip=0
```

## Tool Category Values

Valid category values:

- `IDE`
- `API_TOOL`
- `VERSION_CONTROL`
- `DATABASE`
- `DESIGN`
- `PRODUCTIVITY`
- `OTHER`

## Example Request Payloads

Create tool:

```json
{
  "name": "Postman",
  "description": "API development platform",
  "category": "API_TOOL",
  "url": "https://www.postman.com",
  "isPopular": true,
  "tags": ["api", "testing"]
}
```

Bulk create:

```json
{
  "tools": [
    {
      "name": "VS Code",
      "description": "Code editor",
      "category": "IDE",
      "url": "https://code.visualstudio.com",
      "isPopular": true,
      "tags": ["editor", "typescript"]
    }
  ]
}
```

Bulk delete:

```json
{
  "ids": ["6640f97b03e0f8f0f7e2be11", "6640f97b03e0f8f0f7e2be12"]
}
```

## Standard Response Shape

Responses are centralized through `ApiResponse` utility and generally follow:

```json
{
  "success": true,
  "message": "Tool fetched successfully",
  "data": {},
  "meta": {}
}
```

## Notes

- The folder is intentionally named `sevices` in this project (not `services`).
- DNS servers are configured at startup from `DNS_SERVERS`.
