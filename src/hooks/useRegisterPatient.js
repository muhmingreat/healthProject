



import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
// import { baseSepolia } from "@reown/appkit/networks";
import { celoAlfajores } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";

const useCreatePatient = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  return useCallback(
    async (name, age, gender, avatar) => {
      if (!name || !age || !gender || !avatar) {
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
        toast.error("You're not connected to celoAfajores");
        return;
      }

      try {
        const estimatedGas = await contract.registerPatient.estimateGas(
          name, Number(age), gender, avatar
        );
        const tx = await contract.registerPatient(name, Number(age), gender,avatar, {
          gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
        });


        const receipt = await tx.wait();

        if (receipt.status === 1) {
     
        toast.success(`Patient${name} registered successfully`);
        return true;
      }

        toast.error("Failed to register patient");
        return false;
      } catch (error) {
        const errorDecoder = ErrorDecoder.create();
        const decodeError = await errorDecoder.decode(error);
        console.error("Error from creating patient", error);
        toast.error(decodeError.reason);
      }
    },
    [contract, address, chainId]
  );
};

export default useCreatePatient;