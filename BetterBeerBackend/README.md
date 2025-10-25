# BetterBeer Backend

A Node.js/Express API for the BetterBeer application.

## Features

- RESTful API for beer data
- User favorites management
- CORS enabled for frontend integration
- Mock data for 100 beers
- Pagination support
- Filtering by search term and style

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file (optional):
   ```bash
   cp .env.example .env
   ```

3. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3000` by default.

## API Endpoints

### Beer Endpoints

- `GET /api/beers` - Get all beers with pagination and filtering
  - Query params: `page`, `limit`, `search`, `style`
  - Example: `/api/beers?page=1&limit=30&search=IPA&style=IPA`

- `GET /api/beers/:id` - Get a single beer by ID

- `GET /api/styles` - Get all available beer styles

### Favorites Endpoints

- `GET /api/favorites/:userId` - Get user's favorite beers

- `POST /api/favorites/:userId` - Add a beer to favorites
  - Body: `{ "beerId": 1 }`

- `DELETE /api/favorites/:userId/:beerId` - Remove a beer from favorites

## Docker

Build the image:
```bash
docker build -t betterbeer-backend .
```

Run the container:
```bash
docker run -p 3000:3000 betterbeer-backend
```

## Technology Stack

- Node.js
- Express.js
- CORS for cross-origin requests
- dotenv for environment variables

## Notes

- Currently uses in-memory storage for favorites (use a database in production)
- Beer data is mock generated (connect to a real beer API or database)
- No authentication implemented yet (add JWT or OAuth for production)
