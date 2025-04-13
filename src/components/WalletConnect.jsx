// src/components/WalletConnect.jsx
import React, { useEffect, useState } from "react";

const BLAST_CHAIN_ID = "0x13e31"; // Blast Mainnet: 834512 in hex
const BLAST_PARAMS = {
  chainId: BLAST_CHAIN_ID,
  chainName: "Blast Mainnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.blast.io"],
  blockExplorerUrls: ["https://blastscan.io"],
};

const WalletConnect = ({ onWalletConnected }) => {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      setWalletAddress(address);
      onWalletConnected(address);

      const currentChain = await window.ethereum.request({ method: "eth_chainId" });

      if (currentChain !== BLAST_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: BLAST_CHAIN_ID }],
          });
        } catch (switchError) {
          // If Blast isn't added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [BLAST_PARAMS],
              });
            } catch (addError) {
              console.error("Could not add Blast chain:", addError);
            }
          } else {
            console.error("Could not switch to Blast chain:", switchError);
          }
        }
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  return (
    <div>
      {walletAddress ? (
        <p className="text-green-400">Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-black font-semibold"
        >
          🔗 Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
