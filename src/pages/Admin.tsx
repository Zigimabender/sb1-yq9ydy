import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAuction } from '../contexts/AuctionContext';
import { PlusCircle, Edit, Trash2, StopCircle } from 'lucide-react';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { auctions, endAuction } = useAuction();

  if (!user || !user.isAdmin) {
    return <div className="text-red-500">Access denied. Admin privileges required.</div>;
  }

  const handleEndAuction = async (id: string) => {
    if (window.confirm('Are you sure you want to end this auction?')) {
      await endAuction(id);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Admin Panel</h1>
      <div className="mb-6">
        <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center hover:bg-green-700 transition-colors duration-300">
          <PlusCircle className="mr-2" size={18} />
          Add New Auction
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-3 text-white">Title</th>
              <th className="p-3 text-white">Current Bid</th>
              <th className="p-3 text-white">End Time</th>
              <th className="p-3 text-white">Actions</th>
            </tr>
          </thead>
          <tbody>
            {auctions.map((auction) => (
              <tr key={auction.id} className="border-b border-gray-700">
                <td className="p-3 text-gray-300">{auction.title}</td>
                <td className="p-3 text-gray-300">{auction.currentBid} coins</td>
                <td className="p-3 text-gray-300">{auction.endTime}</td>
                <td className="p-3">
                  <button className="text-blue-400 hover:text-blue-300 mr-2">
                    <Edit size={18} />
                  </button>
                  <button className="text-red-400 hover:text-red-300 mr-2">
                    <Trash2 size={18} />
                  </button>
                  <button
                    className="text-yellow-400 hover:text-yellow-300"
                    onClick={() => handleEndAuction(auction.id)}
                  >
                    <StopCircle size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;