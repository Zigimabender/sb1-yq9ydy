import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Laptop, User, LogOut, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Laptop className="mr-2" />
          TechBid
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-blue-300">Home</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/profile" className="hover:text-blue-300 flex items-center">
                    <User className="mr-1" size={18} />
                    Profile
                  </Link>
                </li>
                {user.isAdmin && (
                  <li>
                    <Link to="/admin" className="hover:text-blue-300 flex items-center">
                      <Settings className="mr-1" size={18} />
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <button onClick={logout} className="hover:text-blue-300 flex items-center">
                    <LogOut className="mr-1" size={18} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button onClick={() => {/* Implement SSO login */}} className="hover:text-blue-300">
                  Login with SSO
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;