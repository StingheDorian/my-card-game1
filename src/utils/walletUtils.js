export const switchToBlast = async () => {
  const provider = window.ethereum;
  if (!provider) {
    alert("MetaMask not detected.");
    return;
  }

  try {
    await provider.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x13e31", // Blast Mainnet (hex for 81649) - double check this if you're using testnet
          chainName: "Blast L2",
          nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.blast.io"],
          blockExplorerUrls: ["https://blastscan.io/"],
        },
      ],
    });
  } catch (error) {
    console.error("Blast switch error:", error);
  }
};
