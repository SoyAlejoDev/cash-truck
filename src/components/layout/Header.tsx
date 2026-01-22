import React from 'react';
import { Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Truck size={28} className="text-amber-400" />
            <h1 className="text-xl font-bold">TruckerFinance</h1>
          </Link>
          
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="hover:text-amber-300 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-amber-300 transition-colors">
                  Reports
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;