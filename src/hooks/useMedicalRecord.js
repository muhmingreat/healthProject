import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { celoAlfajores } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";

const useMedicalRecord = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  return useCallback(
    async ( ipfsUrl, patientName, diagnosis) => {
      if ( !ipfsUrl || !patientName || !diagnosis) {
        toast.error("All fields are required");
        return;
      }

      if (!address) {
        toast.error("Please connect your wallet");
        return;
      }

      if (!contract) {
        toast.error("Contract not found");
        return;
      }

      if (Number(chainId) !== Number(celoAlfajores.id)) {
        toast.error("You're not connected to celoAlfajores");
        return;
      }
      
      try {
        const patientId = await contract.addressToPatientId(address);
        if(patientId === 0n){
    
          console.log("You are not registered as a patient")
          return;
        }
        

        const estimatedGas = await contract.addMedicalRecord.estimateGas(
          patientId,
        
          ipfsUrl,
          patientName,
          diagnosis
        );

        const tx = await contract.addMedicalRecord(patientId,  ipfsUrl, patientName, diagnosis, {
          gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
        });

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Medical record created successfully");
          return;
        }

        toast.error("Failed to create medical record");
        return;
      } catch (error) {
        const errorDecoder = ErrorDecoder.create();
        const decodeError = await errorDecoder.decode(error);
        console.error("Error from creating medical record", error);
        toast.error(decodeError.reason);
      }
    },
    [contract, address, chainId]
  );
};

export default useMedicalRecord;