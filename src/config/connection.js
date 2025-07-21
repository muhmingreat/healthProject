import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';


const projectId = import.meta.env.VITE_APPKIT_PROJECT_ID;


const alfajores = {
  id: 44787,
  name: 'Celo Alfajores',
  network: 'celo-alfajores',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://alfajores-forno.celo-testnet.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'CeloScan',
      url: 'https://alfajores.celoscan.io',
    },
  },
  testnet: true,
};

const celo = {
  id: 42220,
  name: 'Celo Mainnet',
  network: 'celo-mainnet',
  nativeCurrency: {
    name: 'CELO',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://forno.celo.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'CeloScan',
      url: 'https://celoscan.io',
    },
  },
  testnet: false,
};


const networks = [alfajores, celo];

const metadata = {
  name: 'My Healthcare DApp',
  description: 'Healthcare Record System on CELO',
  url: 'http://localhost:5173', 
  icons: ['https://myhealthcareapp.com/icon.png'] ,


};


createAppKit({
  adapters: [new EthersAdapter()],
  networks,
  metadata,
  projectId,
  features: {
    analytics: true 
  },
  themeVariables: {
    "--w3m-accent": "black",
    "--w3m-border-radius-master": "1px",
  },
  themeMode: "dark",
  themeVariables: {

        "--w3m-accent": "black",
    
        "--w3m-border-radius-master": "1px",
    
      },
});

