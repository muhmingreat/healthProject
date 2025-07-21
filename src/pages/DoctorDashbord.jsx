import { useEffect, useState, useCallback } from "react";
import { useAppKitAccount, useAppKitNetwork } from "@reown/appkit/react";
import { celoAlfajores } from "@reown/appkit/networks";
import { toast } from "react-toastify";
import useContractInstance from "../hooks/useContractInstance";
import MedicalRecordCard from "../component/MedicalRecordCard";
import { Loader2 } from "lucide-react";
import { ethers } from "ethers";

const DoctorDashboard = () => {
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const contract = useContractInstance(true);

  const [doctorProfile, setDoctorProfile] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctorData = useCallback(async () => {
    if (!contract || !address) return;
    try {
      setLoading(true);
      const DOCTOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("DOCTOR_ROLE"));
      const isDoctor = await contract.hasRole(DOCTOR_ROLE, address);
      if (!isDoctor) return toast.error("You must be a registered doctor.");

      const doctor = await contract.getDoctorProfile();
      const doctorId = Number(doctor.id);
      const assigned = await contract.getMedicalRecordsByDoctor(doctorId);

      const formatted = assigned.map((rec) => ({
        id: Number(rec.id),
        patientName: rec.patientName,
        diagnosis: rec.diagnosis,
        prescription: rec.prescription,
        ipfsUrl: rec.ipfsUrl,
        timestamp: Number(rec.timestamp),
      }));

      setDoctorProfile(doctor);
      setRecords(formatted);
    } catch (err) {
      console.error("Failed to load doctor dashboard:", err);
      toast.error("Something went wrong loading your dashboard.");
    } finally {
      setLoading(false);
    }
  }, [contract, address]);

  useEffect(() => {
    if (address && Number(chainId) === Number(celoAlfajores.id)) {
      fetchDoctorData();
    } else if (chainId && Number(chainId) !== Number(celoAlfajores.id)) {
      toast.error("Please connect to Celo Alfajores network.");
    }
  }, [fetchDoctorData, address, chainId]);

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-8 bg-gradient-to-br from-[#e0f7fa] via-[#f3e5f5] to-[#fce4ec]">
       <h1 className="text-2xl text-center font-bold text-gray-800 mb-7">
              Welcome, Dr. {doctorProfile?.name}
            </h1>

      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
          <p className="text-blue-800 font-medium">Loading your dashboard...</p>
        </div>
      ) : doctorProfile ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Doctor Info */}
          <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-6 w-full lg:w-1/3">
           
            <p className="mb-2">
              <span className="font-semibold">Specialization:</span> {doctorProfile.specialization}
            </p>
            <p>
              <span className="font-semibold">Biography:</span> {doctorProfile.biography}
            </p>
          <img src={doctorProfile.avatar} alt={doctorProfile.id} />
          </div>

          {/* Records Section */}
          <div className="w-full lg:w-2/3">

            <h2 className="text-xl font-semibold text-gray-800 mb-4">Assigned Medical Records</h2>
            <div className="grid gap-4">
              {records.length > 0 ? (
                records.map((record) => (
                  <MedicalRecordCard key={record.id} record={record} />
                ))
              ) : (
                <p className="text-gray-600">No patient records assigned to you yet.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center mt-12">No doctor profile found.</p>
      )}
    </div>
  );
};

export default DoctorDashboard;
