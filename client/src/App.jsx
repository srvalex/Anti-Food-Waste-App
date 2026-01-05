import { useState } from 'react'
import './App.css'
import UserForm from './components/UserForm'
import ProductList from './components/ProductList'
import FriendsPage from './components/FriendsPage'
import CommunityPage from './components/CommunityPage'

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [activePage, setActivePage] = useState('products'); // 'products', 'community', or 'friends'

  const handleUserLogin = (user) => {
    setLoggedInUser(user);
    console.log('User logged in:', user);
  };

  return (
    <div className="app-container">
      {!loggedInUser ? (
        <UserForm onUserSelect={handleUserLogin} />
      ) : (
        <div className="dashboard-container">
          <div className="welcome-header">
            <div className="welcome-info">
              <h1>Bine ai venit, {loggedInUser.username}! 🎉</h1>
              <p className="user-email">📧 {loggedInUser.email}</p>
            </div>
            <button
              onClick={() => setLoggedInUser(null)}
              className="logout-btn"
            >
              🚪 Logout
            </button>
          </div>

          <div className="navigation-tabs">
            <button
              onClick={() => setActivePage('products')}
              className={`nav-tab ${activePage === 'products' ? 'active' : ''}`}
            >
              🍎 Produsele Mele
            </button>
            <button
              onClick={() => setActivePage('community')}
              className={`nav-tab ${activePage === 'community' ? 'active' : ''}`}
            >
              🌍 Comunitate
            </button>
            <button
              onClick={() => setActivePage('friends')}
              className={`nav-tab ${activePage === 'friends' ? 'active' : ''}`}
            >
              👥 Prieteni
            </button>
          </div>

          {activePage === 'products' && <ProductList userId={loggedInUser.id} />}
          {activePage === 'community' && <CommunityPage userId={loggedInUser.id} />}
          {activePage === 'friends' && <FriendsPage userId={loggedInUser.id} />}
        </div>
      )}
    </div>
  )
}

export default App
