import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { crossFi } from "../config/crossFi"
import { ErrorDecoder } from "ethers-decode-error";
import { ethers } from "ethers";

const useCreatePrescription = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  return useCallback(
    async (recordId, prescription) => {
      if (!prescription || !recordId) {
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

      if (Number(chainId) !== Number(crossFi.id)) {
        toast.error("You're not connected to baseSepolia");
        return;
      }
      
      
      
      
      try {
        const DOCTOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("DOCTOR_ROLE"));
        const isDoctor = await contract.hasRole(DOCTOR_ROLE, address);
  
        if (!isDoctor) {
          toast.error("You must be connected as a doctor to prescribe medicine.");
          return;
        }
        const estimatedGas = await contract.prescribeMedicine.estimateGas(recordId, prescription);

        const tx = await contract.prescribeMedicine(recordId, prescription, {
          gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
        });

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Prescription added successfully");
          return;
        }

        toast.error("Failed to add prescription");
      } catch (error) {
        const errorDecoder = ErrorDecoder.create();
        const decodeError = await errorDecoder.decode(error);
        console.error("Error adding prescription", error);
        toast.error(decodeError.reason || "Unknown error");
        console.log(`${decodeError.reason}`);
      }
    },
    [contract, address, chainId]
  );
};

export default useCreatePrescription;
