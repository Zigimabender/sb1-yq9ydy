import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Auction from './pages/Auction';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import { AuthProvider } from './contexts/AuthContext';
import { AuctionProvider } from './contexts/AuctionContext';

function App() {
  return (
    <AuthProvider>
      <AuctionProvider>
        <Router>
          <div className="min-h-screen nightly-gradient">
            <Header />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auction/:id" element={<Auction />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuctionProvider>
    </AuthProvider>
  );
}

export default App;