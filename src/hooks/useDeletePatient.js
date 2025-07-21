import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
// import { baseSepolia } from "@reown/appkit/networks";
import { celoAlfajores } from "@reown/appkit/networks";
import { ErrorDecoder } from "ethers-decode-error";

const useDeletePatient = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  return useCallback(
    async (patientId) => {
      

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
      // try {
  if (!contract.deletePatient || !contract.deletePatient.estimateGas) {
    toast.error("Contract method 'deletePatient' not found.");
    console.error("Contract method 'deletePatient' not found.");
    console.log("Contract method 'deletePatient' not found.");
    return;
  }
  console.log(contract.interface.getFunction("deletePatient"))
      try {
        const estimatedGas = await contract.deletePatient.estimateGas(
            patientId
        );

        const tx = await contract.deletePatient(patientId, {
          gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
        });

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Patient deleted successfully");
          return;
        }

        toast.error("Failed to delete patient");
        return;
      } catch (error) {
        const errorDecoder = ErrorDecoder.create();
        const decodeError = await errorDecoder.decode(error);
        console.error("Error from deleting patient", error);
        toast.error(decodeError.reason);
      }
    },
    [contract, address, chainId]
  );
};

export default useDeletePatient;