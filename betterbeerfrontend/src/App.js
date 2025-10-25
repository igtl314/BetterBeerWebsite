import React, { useState, useEffect, useMemo } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import './App.css';

// Mock beer data - in production, this would come from an API
const generateMockBeers = () => {
  const beerStyles = ['IPA', 'Lager', 'Stout', 'Pale Ale', 'Wheat Beer', 'Pilsner', 'Porter', 'Amber Ale', 'Belgian Ale', 'Sour'];
  const breweries = ['Mountain Brewery', 'Coastal Craft', 'Urban Hops', 'Valley Brewing', 'Highland Beer Co.', 'Riverside Brewery', 'Peak Beer Works', 'Sunset Brewing', 'Forest Ales', 'Desert Hops'];
  const beers = [];
  
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
  
  return beers;
};

function App() {
  const [user, setUser] = useState(null);
  const [beers] = useState(generateMockBeers());
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [beersPerPage, setBeersPerPage] = useState(30);
  const [searchTerm, setSearchTerm] = useState('');
  const [styleFilter, setStyleFilter] = useState('');

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('beerFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('beerFavorites', JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Local filtering
  const filteredBeers = useMemo(() => {
    return beers.filter(beer => {
      const matchesSearch = beer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          beer.brewery.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStyle = !styleFilter || beer.style === styleFilter;
      return matchesSearch && matchesStyle;
    });
  }, [beers, searchTerm, styleFilter]);

  // Pagination
  const indexOfLastBeer = currentPage * beersPerPage;
  const indexOfFirstBeer = indexOfLastBeer - beersPerPage;
  const currentBeers = filteredBeers.slice(indexOfFirstBeer, indexOfLastBeer);
  const totalPages = Math.ceil(filteredBeers.length / beersPerPage);

  // Get unique styles for filter dropdown
  const uniqueStyles = [...new Set(beers.map(beer => beer.style))].sort();

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setUser({
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture
      });
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const handleLoginError = () => {
    console.error('Login Failed');
  };

  const handleLogout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem('beerFavorites');
  };

  const toggleFavorite = (beerId) => {
    if (!user) {
      alert('Please login to add favorites!');
      return;
    }
    
    setFavorites(prev => {
      if (prev.includes(beerId)) {
        return prev.filter(id => id !== beerId);
      } else {
        return [...prev, beerId];
      }
    });
  };

  const isFavorite = (beerId) => favorites.includes(beerId);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBeersPerPageChange = (e) => {
    setBeersPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStyleFilterChange = (e) => {
    setStyleFilter(e.target.value);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <button key={1} onClick={() => handlePageChange(1)} className="pagination-btn">
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="pagination-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button key={totalPages} onClick={() => handlePageChange(totalPages)} className="pagination-btn">
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <div className="App">
        <header className="app-header">
          <h1>🍺 BetterBeer</h1>
          <div className="user-section">
            {user ? (
              <div className="user-info">
                <img src={user.picture} alt={user.name} className="user-avatar" />
                <span className="user-name">{user.name}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            ) : (
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                theme="filled_blue"
                size="large"
              />
            )}
          </div>
        </header>

        <main className="main-content">
          <div className="controls-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search beers or breweries..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
            
            <div className="filters">
              <select
                value={styleFilter}
                onChange={handleStyleFilterChange}
                className="filter-select"
              >
                <option value="">All Styles</option>
                {uniqueStyles.map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>

              <select
                value={beersPerPage}
                onChange={handleBeersPerPageChange}
                className="filter-select"
              >
                <option value={30}>30 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          <div className="results-info">
            Showing {indexOfFirstBeer + 1}-{Math.min(indexOfLastBeer, filteredBeers.length)} of {filteredBeers.length} beers
            {user && favorites.length > 0 && ` | ${favorites.length} favorites`}
          </div>

          <div className="beer-grid">
            {currentBeers.map(beer => (
              <div key={beer.id} className="beer-card">
                <div className="beer-header">
                  <h3 className="beer-name">{beer.name}</h3>
                  {user && (
                    <button
                      onClick={() => toggleFavorite(beer.id)}
                      className={`favorite-btn ${isFavorite(beer.id) ? 'favorited' : ''}`}
                      title={isFavorite(beer.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFavorite(beer.id) ? '❤️' : '🤍'}
                    </button>
                  )}
                </div>
                <div className="beer-details">
                  <p className="beer-brewery">🏭 {beer.brewery}</p>
                  <p className="beer-style">🍻 {beer.style}</p>
                  <div className="beer-stats">
                    <span className="stat">ABV: {beer.abv}%</span>
                    <span className="stat">IBU: {beer.ibu}</span>
                  </div>
                  <p className="beer-description">{beer.description}</p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn nav-btn"
              >
                ← Previous
              </button>
              
              {renderPagination()}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn nav-btn"
              >
                Next →
              </button>
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p>BetterBeer - Discover and track your favorite beers</p>
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
