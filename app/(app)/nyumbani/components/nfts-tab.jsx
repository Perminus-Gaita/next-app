"use client";
import React from 'react';

const NFTsTab = () => {
  const dummyNFTs = [
    {
      id: 1,
      name: "Golden Trophy #001",
      description: "Exclusive NFT for tournament winners",
      price: 500,
      currency: "KSH",
      image: "/placeholder-nft1.jpg"
    },
    {
      id: 2,
      name: "Diamond Badge #045",
      description: "Premium membership badge",
      price: 1000,
      currency: "KSH",
      image: "/placeholder-nft2.jpg"
    }
  ];

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">NFTs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyNFTs.map(nft => (
          <div key={nft.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="h-48 bg-gradient-to-br from-purple-400 to-pink-600"></div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{nft.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{nft.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-primary">{nft.price} {nft.currency}</span>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-sm">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTsTab;
