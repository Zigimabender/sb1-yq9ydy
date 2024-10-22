import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuction } from '../contexts/AuctionContext';
import { useAuth } from '../contexts/AuthContext';
import { Clock, DollarSign, Users } from 'lucide-react';

const Auction: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAuction, placeBid } = useAuction();
  const { user } = useAuth();
  const [auction, setAuction] = useState<any>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);

  useEffect(() => {
    if (id) {
      const auctionData = getAuction(id);
      setAuction(auctionData);
    }
  }, [id, getAuction]);

  const handleBid = () => {
    if (auction && bidAmount > auction.currentBid) {
      placeBid(auction.id, bidAmount);
      setAuction({ ...auction, currentBid: bidAmount });
      setBidAmount(0);
    }
  };

  if (!auction) return <div>Loading...</div>;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={auction.image} alt={auction.title} className="w-full h-auto rounded-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4 text-white">{auction.title}</h1>
          <p className="text-gray-400 mb-6">{auction.description}</p>
          <div className="flex items-center mb-4 text-blue-300">
            <Clock className="mr-2" />
            <span>Ends in: {auction.endTime}</span>
          </div>
          <div className="flex items-center mb-4 text-green-400">
            <DollarSign className="mr-2" />
            <span className="text-2xl font-bold">{auction.currentBid} coins</span>
          </div>
          <div className="flex items-center mb-6 text-purple-400">
            <Users className="mr-2" />
            <span>{auction.bidders} bidders</span>
          </div>
          {user && (
            <div className="flex items-center">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="border bg-gray-700 text-white rounded-l px-4 py-2 w-full"
                placeholder="Enter bid amount"
              />
              <button
                onClick={handleBid}
                className="bg-blue-600 text-white px-6 py-2 rounded-r hover:bg-blue-700 transition-colors duration-300"
              >
                Place Bid
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auction;