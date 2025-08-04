import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { crossFi } from "../config/crossFi"
import { ErrorDecoder } from "ethers-decode-error";

const useDeleteMedicalRecord = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  return useCallback(
    async (recordId) => {
      

      if (!address) {
        toast.error("Please connect your wallet");
        return;
      }

      if (!contract) {
        toast.error("Contract not found");
        return;
      }

      if (Number(chainId) !== Number(crossFi.id)) {
        toast.error("You're not connected to celoAlfajores");
        return;
      }

      try {
        const estimatedGas = await contract.deleteMedicalRecord.estimateGas(
            recordId
        );

        const tx = await contract.deleteMedicalRecord(recordId, {
          gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
        });

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Medical record deleted successfully");
          return;
        }

        toast.error("Failed to delete medical record");
        return;
      } catch (error) {
        const errorDecoder = ErrorDecoder.create();
        const decodeError = await errorDecoder.decode(error);
        console.error("Error from deleting medical record", error);
        toast.error(decodeError.reason);
      }
    },
    [contract, address, chainId]
  );
};

export default useDeleteMedicalRecord;