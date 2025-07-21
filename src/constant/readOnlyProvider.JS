import { JsonRpcProvider } from "ethers";

export const readOnlyProvider = new JsonRpcProvider(
  
  import.meta.env.VITE_CELO_RPC_URL
  
);