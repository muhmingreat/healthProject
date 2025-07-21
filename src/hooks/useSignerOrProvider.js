import { useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";
import { useEffect, useMemo, useRef, useState } from "react";
import { readOnlyProvider } from "../constant/readOnlyProvider";

const useSignerOrProvider = () => {
  const [signer, setSigner] = useState(null);
  const { walletProvider } = useAppKitProvider("eip155");

  const providerRef = useRef(null);

  
  const provider = useMemo(() => {
    if (!walletProvider) return null;

    
    if (!providerRef.current || providerRef.current.connection !== walletProvider) {
      providerRef.current = new BrowserProvider(walletProvider);
    }

    return providerRef.current;
  }, [walletProvider]);

  useEffect(() => {
    let cancelled = false;

    const getSigner = async () => {
      if (!provider) {
        setSigner(null);
        return;
      }

      try {
        const newSigner = await provider.getSigner();
        if (!cancelled) {
          setSigner((prev) => {
            if (!prev || prev.address !== newSigner.address) {
              return newSigner;
            }
            return prev;
          });
        }
      } catch (e) {
        console.error("Failed to get signer", e);
        if (!cancelled) setSigner(null);
      }
    };

    getSigner();

    return () => {
      cancelled = true;
    };
  }, [provider]);

  return { signer, provider, readOnlyProvider };
};

export default useSignerOrProvider;
