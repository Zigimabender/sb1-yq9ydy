import React from 'react';
import { Link } from 'react-router-dom';
import { useAuction } from '../contexts/AuctionContext';
import { Clock, DollarSign } from 'lucide-react';

const Home: React.FC = () => {
  const { auctions } = useAuction();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Active Auctions</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <Link key={auction.id} to={`/auction/${auction.id}`} className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <img src={auction.image} alt={auction.title} className="w-full h-48 object-cover rounded-t-lg" />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-white">{auction.title}</h2>
              <p className="text-gray-400 mb-4">{auction.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  {auction.endTime}
                </span>
                <span className="flex items-center font-semibold text-green-400">
                  <DollarSign size={16} className="mr-1" />
                  {auction.currentBid} coins
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;