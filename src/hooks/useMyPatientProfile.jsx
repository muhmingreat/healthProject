import { useState, useEffect } from "react";
import useContractInstance from "./useContractInstance";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";

const useMyPatientProfile = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!contract || !address) return;

      setLoading(true);
      try {
        const patient = await contract.getMyPatientProfile();
        setProfile(patient);
        setErrorMsg("");
      } catch (error) {
        console.warn("⚠️ Not registered as patient or deleted:", error?.reason || error);
        setProfile(null);
        setErrorMsg("You are not registered as a patient or your profile was deleted.");
        // Don't show toast on mount silently unless you want to
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [contract, address]);

  return { profile, loading, errorMsg };
};

export default useMyPatientProfile;
