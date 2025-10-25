const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock beer data - In production, this would come from a database
const beers = [];
const generateMockBeers = () => {
  const beerStyles = ['IPA', 'Lager', 'Stout', 'Pale Ale', 'Wheat Beer', 'Pilsner', 'Porter', 'Amber Ale', 'Belgian Ale', 'Sour'];
  const breweries = ['Mountain Brewery', 'Coastal Craft', 'Urban Hops', 'Valley Brewing', 'Highland Beer Co.', 'Riverside Brewery', 'Peak Beer Works', 'Sunset Brewing', 'Forest Ales', 'Desert Hops'];
  
  for (let i = 1; i <= 100; i++) {
    const style = beerStyles[Math.floor(Math.random() * beerStyles.length)];
    const brewery = breweries[Math.floor(Math.random() * breweries.length)];
    beers.push({
      id: i,
      name: `${brewery} ${style} #${i}`,
      style: style,
      brewery: brewery,
      abv: (Math.random() * 8 + 3).toFixed(1),
      ibu: Math.floor(Math.random() * 80 + 20),
      description: `A delicious ${style.toLowerCase()} crafted by ${brewery} with unique character and flavor.`
    });
  }
};

generateMockBeers();

// In-memory storage for user favorites (In production, use a database)
const userFavorites = {};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'BetterBeer API' });
});

// Get all beers
app.get('/api/beers', (req, res) => {
  const { page = 1, limit = 30, search = '', style = '' } = req.query;
  
  let filteredBeers = beers;
  
  // Filter by search term
  if (search) {
    const searchLower = search.toLowerCase();
    filteredBeers = filteredBeers.filter(beer =>
      beer.name.toLowerCase().includes(searchLower) ||
      beer.brewery.toLowerCase().includes(searchLower)
    );
  }
  
  // Filter by style
  if (style) {
    filteredBeers = filteredBeers.filter(beer => beer.style === style);
  }
  
  // Pagination
  const startIndex = (page - 1) * parseInt(limit);
  const endIndex = page * parseInt(limit);
  
  const paginatedBeers = filteredBeers.slice(startIndex, endIndex);
  
  res.json({
    beers: paginatedBeers,
    total: filteredBeers.length,
    page: parseInt(page),
    totalPages: Math.ceil(filteredBeers.length / parseInt(limit))
  });
});

// Get a single beer
app.get('/api/beers/:id', (req, res) => {
  const beer = beers.find(b => b.id === parseInt(req.params.id));
  if (beer) {
    res.json(beer);
  } else {
    res.status(404).json({ error: 'Beer not found' });
  }
});

// Get available beer styles
app.get('/api/styles', (req, res) => {
  const styles = [...new Set(beers.map(beer => beer.style))].sort();
  res.json(styles);
});

// Get user favorites
app.get('/api/favorites/:userId', (req, res) => {
  const userId = req.params.userId;
  const favorites = userFavorites[userId] || [];
  res.json(favorites);
});

// Add favorite
app.post('/api/favorites/:userId', (req, res) => {
  const userId = req.params.userId;
  const { beerId } = req.body;
  
  if (!userFavorites[userId]) {
    userFavorites[userId] = [];
  }
  
  if (!userFavorites[userId].includes(beerId)) {
    userFavorites[userId].push(beerId);
  }
  
  res.json({ message: 'Favorite added', favorites: userFavorites[userId] });
});

// Remove favorite
app.delete('/api/favorites/:userId/:beerId', (req, res) => {
  const userId = req.params.userId;
  const beerId = parseInt(req.params.beerId);
  
  if (userFavorites[userId]) {
    userFavorites[userId] = userFavorites[userId].filter(id => id !== beerId);
  }
  
  res.json({ message: 'Favorite removed', favorites: userFavorites[userId] || [] });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`BetterBeer API server running on port ${PORT}`);
});

module.exports = app;
