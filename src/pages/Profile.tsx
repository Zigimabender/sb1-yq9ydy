import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Coins } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Your Profile</h1>
      <div className="flex items-center mb-4">
        <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full mr-4" />
        <div>
          <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
          <p className="text-gray-400">{user.email}</p>
        </div>
      </div>
      <div className="flex items-center text-xl text-yellow-400">
        <Coins className="mr-2" />
        <span>{user.coins} coins available</span>
      </div>
    </div>
  );
};

export default Profile;