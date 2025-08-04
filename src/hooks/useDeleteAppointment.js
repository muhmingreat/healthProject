import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { crossFi } from "@reown/appkit/networks";
import { crossFi } from "../config/crossFi"
import { ErrorDecoder } from "ethers-decode-error";

const useDeleteAppointment = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  return useCallback(
    async (appointmentId) => {
      

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
        const estimatedGas = await contract.useDeleteAppointment.estimateGas(
            appointmentId
        );

        const tx = await contract.useDeleteAppointment(appointmentId, {
          gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
        });

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success("Appointment deleted successfully");
          return;
        }

        toast.error("Failed to delete appointment");
        return;
      } catch (error) {
        const errorDecoder = ErrorDecoder.create();
        const decodeError = await errorDecoder.decode(error);
        console.error("Error from deleting appointment", error);
        toast.error(decodeError.reason);
      }
    },
    [contract, address, chainId]
  );
};

export default useDeleteAppointment;