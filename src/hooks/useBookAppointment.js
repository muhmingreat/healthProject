import { useCallback } from "react";
import { toast } from "react-toastify";
import { ethers,Interface } from "ethers";
import { ErrorDecoder } from "ethers-decode-error";
import { celoAlfajores } from "@reown/appkit/networks";
import ABI from "../ABI/Healthcare.json";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";



const useBookAppointment = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
return useCallback(async (doctorAddress, timestamp, fee) => {
    if (!doctorAddress || !timestamp || !fee) {
      toast.error("All fields are required");
      return;
    }

    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!contract) {
      toast.error("Smart contract not found");
      return;
    }

    if (Number(chainId) !== Number(celoAlfajores.id)) {
      toast.error("You're not connected to celoAlfajores network");
      return;
    }


    console.log({
      from: address,
      to: contract.target || contract.address,
      doctorAddress,
      timestamp,
      msgValue: Number(fee),
    });

 
    try {
         const normalizedAddress = ethers.getAddress(address);
      const patientId = await contract.addressToPatientId(normalizedAddress);
      console.log("🩺 Patient ID:", patientId.toString());

      if (patientId === 0n || patientId.toString() === "0") {
        toast.error(" You must register as a patient before booking.");
        return;
      }

      const estimatedGas = await contract.bookAppointment.estimateGas(
        doctorAddress, timestamp,
        
        { value: fee }
      );


      const tx = await contract.bookAppointment(
        doctorAddress,
        timestamp,

        {
          gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
          value: fee 
        }
      );

      const receipt = await tx.wait();

      if (receipt.status === 1) {
        toast.success("Appointment booked successfully");
      } else {
        toast.error("Failed to book appointment");
      }
    } catch (error) {
      const errorDecoder = ErrorDecoder.create();
      const decoded = await errorDecoder.decode(error);
      console.error("Error while booking appointment:", error);
      toast.error(decoded?.reason || "Unknown error occurred");
    }
  },
    [contract, address, chainId]
  );
};

export default useBookAppointment;
