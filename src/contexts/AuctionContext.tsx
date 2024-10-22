import React, { createContext, useContext, useState, useEffect } from 'react';
import pool from '../db/connection';
import { sendAuctionEndNotification } from '../utils/mailer';

interface Auction {
  id: string;
  title: string;
  description: string;
  image: string;
  currentBid: number;
  endTime: string;
  bidders: number;
}

interface AuctionContextType {
  auctions: Auction[];
  getAuction: (id: string) => Promise<Auction | undefined>;
  placeBid: (id: string, amount: number, userId: string) => Promise<void>;
  endAuction: (id: string) => Promise<void>;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auctions, setAuctions] = useState<Auction[]>([]);

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM auctions');
      setAuctions(rows as Auction[]);
    } catch (error) {
      console.error('Error fetching auctions:', error);
    }
  };

  const getAuction = async (id: string): Promise<Auction | undefined> => {
    try {
      const [rows] = await pool.query('SELECT * FROM auctions WHERE id = ?', [id]);
      return (rows as Auction[])[0];
    } catch (error) {
      console.error('Error fetching auction:', error);
    }
  };

  const placeBid = async (id: string, amount: number, userId: string): Promise<void> => {
    try {
      await pool.query('START TRANSACTION');
      
      // Update auction
      await pool.query(
        'UPDATE auctions SET current_bid = ?, bidders = bidders + 1 WHERE id = ? AND current_bid < ?',
        [amount, id, amount]
      );
      
      // Insert bid
      await pool.query(
        'INSERT INTO bids (user_id, auction_id, amount) VALUES (?, ?, ?)',
        [userId, id, amount]
      );
      
      await pool.query('COMMIT');
      
      // Refresh auctions
      fetchAuctions();
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Error placing bid:', error);
    }
  };

  const endAuction = async (id: string): Promise<void> => {
    try {
      await pool.query('START TRANSACTION');

      // Get auction details
      const [auctionRows] = await pool.query('SELECT * FROM auctions WHERE id = ?', [id]);
      const auction = (auctionRows as Auction[])[0];

      // Get winner details
      const [winnerRows] = await pool.query(
        'SELECT users.email FROM bids JOIN users ON bids.user_id = users.id WHERE auction_id = ? ORDER BY amount DESC LIMIT 1',
        [id]
      );
      const winner = winnerRows[0];

      // Get all bidder emails
      const [bidderRows] = await pool.query(
        'SELECT DISTINCT users.email FROM bids JOIN users ON bids.user_id = users.id WHERE auction_id = ?',
        [id]
      );
      const bidderEmails = bidderRows.map((row: any) => row.email);

      // Send notifications
      await sendAuctionEndNotification(winner.email, bidderEmails, auction.title, auction.currentBid);

      // Update auction status (you might want to add a 'status' column to your auctions table)
      await pool.query('UPDATE auctions SET status = "ended" WHERE id = ?', [id]);

      await pool.query('COMMIT');

      // Refresh auctions
      fetchAuctions();
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error('Error ending auction:', error);
    }
  };

  return (
    <AuctionContext.Provider value={{ auctions, getAuction, placeBid, endAuction }}>
      {children}
    </AuctionContext.Provider>
  );
};

export const useAuction = () => {
  const context = useContext(AuctionContext);
  if (context === undefined) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
};