# BetterBeer Frontend

A React application for discovering and tracking your favorite beers with Google OAuth authentication.

## Features

- **Google OAuth Login**: Secure authentication using Google accounts
- **Beer Browsing**: View a comprehensive list of beers with detailed information
- **Pagination**: Choose between 30 or 50 beers per page
- **Local Filtering**: Filter beers by name, brewery, or style (client-side for performance)
- **Favorite Beers**: Save your favorite beers (requires login)
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new OAuth 2.0 Client ID
   - Add authorized JavaScript origins: `http://localhost:3000`
   - Copy your Client ID

3. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Add your Google Client ID to `.env`:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

5. Start the development server:
   ```bash
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Browsing Beers
- Scroll through the beer catalog
- Use the search bar to find specific beers or breweries
- Filter by beer style using the dropdown
- Choose pagination size (30 or 50 beers per page)

### Adding Favorites
1. Click "Sign in with Google" in the header
2. Authorize the application
3. Click the heart icon (🤍) on any beer to add it to your favorites
4. Click the filled heart (❤️) to remove from favorites

### Local Filtering
All filtering happens in your browser for instant results:
- Type in the search box to filter by name or brewery
- Select a style from the dropdown to filter by beer type
- Combine both filters for precise results

## Technology Stack

- React 19
- @react-oauth/google for authentication
- jwt-decode for token handling
- React Hooks for state management
- CSS3 for styling

## Project Structure

```
src/
├── App.js          # Main application component
├── App.css         # Application styles
├── index.js        # React entry point
└── index.css       # Global styles
public/
└── index.html      # HTML template
```

## Notes

- Favorites are stored in browser localStorage
- Beer data is currently mocked (100 beers) - can be connected to a real API
- Filtering is done client-side for better performance
- Google OAuth requires a valid Client ID to work
