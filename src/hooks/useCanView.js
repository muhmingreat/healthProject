import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { crossFi } from "../config/crossFi"
const useCanView = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  return useCallback(
    async (patientId, viewerAddress) => {
      if (!address) {
        toast.error("Please connect your wallet");
        return false;
      }

      if (!contract) {
        toast.error("Contract not found");
        return false;
      }

      if (Number(chainId) !== Number(crossFi.id)) {
        toast.error("You're not connected to celoAlfajores");
        return false;
      }

      try {
        const result = await contract.canView(patientId, viewerAddress);
        return result;
      } catch (error) {
        console.error("Error checking access", error);
        toast.error("Failed to check access");
        return false;
      }
    },
    [contract, address, chainId]
  );
};

export default useCanView;
