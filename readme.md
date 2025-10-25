# BetterBeerWebsite

A full-stack web application for discovering, browsing, and tracking your favorite beers with Google OAuth authentication.

## Features

### 🔐 Authentication
- **Google OAuth Login**: Secure sign-in using Google accounts
- User profile display with avatar and name

### 🍺 Beer Browsing
- Browse through a catalog of 100 different beers
- View detailed information: name, brewery, style, ABV, IBU, and description
- Beautiful grid layout with responsive design

### 📄 Pagination
- Choose between **30 or 50 beers per page**
- Smart pagination with ellipsis for many pages
- Navigate easily between pages

### 🔍 Local Filtering
- **Real-time search** by beer name or brewery
- **Filter by beer style** (IPA, Lager, Stout, etc.)
- All filtering happens **client-side** for instant results
- Combine search and style filters for precise results

### ❤️ Favorites
- Add beers to your favorites (requires login)
- Remove beers from favorites with one click
- Favorites persist across browser sessions (localStorage)
- See count of your favorite beers

## Architecture

### Frontend (`betterbeerfrontend/`)
- **React 19** with functional components and hooks
- **@react-oauth/google** for Google authentication
- **jwt-decode** for JWT token handling
- Client-side state management
- Responsive CSS design

### Backend (`BetterBeerBackend/`)
- **Node.js** with **Express**
- RESTful API for beer data
- User favorites management
- CORS enabled for frontend integration
- Mock data generation (100 beers)

### Data Collection (`goDataCollection/`)
- Placeholder for future data collection service

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Google OAuth Client ID (for login functionality)

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/igtl314/BetterBeerWebsite.git
   cd BetterBeerWebsite
   ```

2. **Set up the backend:**
   ```bash
   cd BetterBeerBackend
   npm install
   npm start
   ```
   The backend will run on `http://localhost:3000`

3. **Set up the frontend:**
   ```bash
   cd ../betterbeerfrontend
   npm install
   ```

4. **Configure Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new OAuth 2.0 Client ID
   - Add authorized JavaScript origins: `http://localhost:3000`
   - Copy your Client ID

5. **Create frontend `.env` file:**
   ```bash
   cp .env.example .env
   ```
   
   Add your Google Client ID to `.env`:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

6. **Start the frontend:**
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## Docker Compose

Run the entire stack with Docker:

```bash
docker-compose -f compose.yml up
```

This will start:
- Backend API on port 3005 (mapped from internal 3000)
- Data collector (if implemented)

## Project Structure

```
BetterBeerWebsite/
├── BetterBeerBackend/          # Express.js API server
│   ├── index.js                # Main server file
│   ├── Dockerfile              # Backend container config
│   └── README.md               # Backend documentation
├── betterbeerfrontend/         # React frontend application
│   ├── src/
│   │   ├── App.js              # Main React component
│   │   ├── App.css             # Application styles
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   ├── public/
│   │   └── index.html          # HTML template
│   └── README.md               # Frontend documentation
├── goDataCollection/           # Data collection service
├── compose.yml                 # Docker Compose configuration
└── README.md                   # This file
```

## Usage

### Browsing Beers
1. Open the application in your browser
2. Browse the beer catalog on the home page
3. Use the search bar to find specific beers or breweries
4. Use the style dropdown to filter by beer type
5. Choose your preferred pagination size (30 or 50 beers)

### Managing Favorites
1. Click "Sign in with Google" in the header
2. Authorize the application with your Google account
3. Click the heart icon (🤍) on any beer to add it to favorites
4. Click the filled heart (❤️) to remove from favorites
5. Your favorites are saved and persist across sessions

### Local Filtering
All filtering happens in your browser for instant results:
- Type in the search box → instant filter by name/brewery
- Select a style → instant filter by beer type
- Combine both → precise results immediately
- No server calls needed for filtering!

## API Documentation

See [BetterBeerBackend/README.md](BetterBeerBackend/README.md) for detailed API documentation.

## Development

### Frontend Development
```bash
cd betterbeerfrontend
npm start          # Start dev server
npm run build      # Build for production
npm test           # Run tests
```

### Backend Development
```bash
cd BetterBeerBackend
npm start          # Start server
npm run dev        # Start with auto-reload
```

## Technologies Used

### Frontend
- React 19
- @react-oauth/google
- jwt-decode
- CSS3 with responsive design

### Backend
- Node.js
- Express.js
- CORS
- dotenv

### Infrastructure
- Docker
- Docker Compose

## Future Enhancements

- [ ] Connect to real beer API (e.g., OpenBreweryDB, PunkAPI)
- [ ] Implement persistent database for favorites
- [ ] Add user authentication with JWT
- [ ] Implement backend filtering options
- [ ] Add beer ratings and reviews
- [ ] Social features (share favorites)
- [ ] Advanced filtering (ABV range, IBU range)
- [ ] Beer recommendations based on favorites
- [ ] Mobile app version

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Author

igtl314

---

**BetterBeer** - Discover and track your favorite beers! 🍺
