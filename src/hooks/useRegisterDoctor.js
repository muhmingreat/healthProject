import { useCallback } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { crossFi } from "../config/crossFi"
import { ErrorDecoder } from "ethers-decode-error";

const useCreatePatient = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  return useCallback(
    async (name, specialization, licenseId, avatar,biography ) => {
      if (!name || !specialization || !licenseId || !biography || !avatar) {
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
//       try {
//   // callStatic avoids the estimateGas step
//   await contract.callStatic.addPrescription(1, 'paracetamol');
// } catch (err) {
//   // Attempt to parse with the contract interface (includes OZ errors in build)
//   const decoded = contract.interface.parseError(err.data);
//   console.log(decoded);  // should print AccessControlUnauthorizedAccount(...)
// }


      try {
        const estimatedGas = await contract.registerDoctor.estimateGas(
         name, specialization, licenseId ,biography, avatar
        );
        const tx = await contract.registerDoctor(name, specialization, licenseId ,biography,avatar,{
          gasLimit: (estimatedGas * BigInt(120)) / BigInt(100),
        });
        // toast.info("Registering patient...");

        const receipt = await tx.wait();

        if (receipt.status === 1) {
          toast.success(`Doctor ${name} registered successfull`);
          return true;
        }

        toast.error("Failed to register Doctor");
        return false;
      } catch (error) {
        const errorDecoder = ErrorDecoder.create();
        const decodeError = await errorDecoder.decode(error);
        console.error("Error from Register doctor", error);
        toast.error(decodeError.reason);
      }
    },
    [contract, address, chainId,]
  );
};

export default useCreatePatient;

