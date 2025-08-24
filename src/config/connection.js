import { createAppKit } from "@reown/appkit/react";

import { EthersAdapter } from "@reown/appkit-adapter-ethers";

import { defineChain } from "@reown/appkit/networks";

// 1. Get projectId

const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID;

// Define CrossFi Testnet

const crossFiTestnet = defineChain({

  id: 4157,

  caipNetworkId: "eip155:4157",

  chainNamespace: "eip155",

  name: "CrossFi Testnet",

  nativeCurrency: {

    decimals: 18,

    name: "XFI",

    symbol: "XFI",

  },

  rpcUrls: {

    default: {

      http: ["https://rpc.testnet.ms"],

    },

  },

  blockExplorers: {

    default: {

      name: "XFI Scan",

      url: "https://test.xfiscan.com",

    },

  },

});


// Set the networks

const networks = [crossFiTestnet];


// Metadata for the dApp

const metadata = {

  name: "Buy Me a Coffee",

  description: "Support creators by buying them coffee with XFI",

  url: "https://mywebsite.com",

  icons: ["https://avatars.mywebsite.com/"],

};


// Initialize AppKit

createAppKit({

  adapters: [new EthersAdapter()],

  networks,

  chainImages: {

    [crossFiTestnet.id]:

      "https://s2.coinmarketcap.com/static/img/coins/64x64/26202.png",

  },

  metadata,

  projectId,

  allWallets: "SHOW",

  defaultNetwork: crossFiTestnet,

  enableEIP6963: true,

  themeMode: "dark",

  themeVariables: {

    "--w3m-accent": "#000000",

    "--w3m-border-radius-master": "10px",

  },

  features: {

    analytics: true,

    legalCheckbox: true,

  },

});

