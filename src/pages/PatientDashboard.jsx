import React, { useEffect, useState } from "react";
import useMyPatientProfile from "../hooks/useMyPatientProfile";
import useContractInstance from "../hooks/useContractInstance";
import { useAppKitAccount } from "@reown/appkit/react";
import useDeleteMedicalRecord from "../hooks/useDeleteMedicalRecord"; // ✅ Import it

const PatientDashboard = () => {
  const { profile, loading, errorMsg } = useMyPatientProfile();
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const deleteMedicalRecord = useDeleteMedicalRecord(); 

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [recordLoading, setRecordLoading] = useState(true);
  const [recordError, setRecordError] = useState("");

  const fetchRecords = async () => {
    if (!contract || !profile || !address) return;

    setRecordLoading(true);
    try {
      const patientId = await contract.addressToPatientId(address);
      const records = await contract.getPatientMedicalRecords(patientId);
      setMedicalRecords(records);
      setRecordError("");
    } catch (err) {
      console.error(" Error fetching medical records:", err);
      setRecordError("Failed to fetch medical records.");
      setMedicalRecords([]);
    } finally {
      setRecordLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [contract, profile, address]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this medical record?");
    if (!confirm) return;

    await deleteMedicalRecord(id);
    fetchRecords(); 
  };

  if (loading) return <p className="text-center mt-10 text-gray-600 relative top-28">Loading profile...</p>;
  if (errorMsg) return <p className="text-center mt-10 text-red-500">{errorMsg}</p>;

  return (
    <div className="min-h-screen px-6 py-10 md:px-16 bg-gradient-to-br relative top-20 from-indigo-200 via-white to-pink-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-800">
         Welcome {profile.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        <div className="bg-white rounded-2xl shadow-lg p-6 col-span-1">
          <div className="flex flex-col items-center">
            <img
              src={profile.avatar}
              alt="avatar"
              className="w-32 h-32 rounded-full object-cover border-4 border-indigo-300 mb-4"
            />
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-700">{profile.name}</p>
              <p className="text-sm text-gray-500">Age {profile.age}</p>
              <p className="text-sm text-gray-500">Gender {profile.gender}</p>
            </div>
          </div>
        </div>

    
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-indigo-700 mb-4"> Medical Records & Prescriptions</h2>

          {recordLoading ? (
            <p className="text-gray-600">Loading medical records...</p>
          ) : recordError ? (
            <p className="text-red-500">{recordError}</p>
          ) : medicalRecords.length === 0 ? (
            <p className="text-gray-500">No medical records found.</p>
          ) : (
            <ul className="space-y-6">
              {medicalRecords.map((record, index) => (
                <li key={index} className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                  <p className="text-sm"><strong>Record ID</strong> {record.id.toString()}</p>
                  <p className="text-sm mt-1"><strong>Diagnosis</strong> {record.diagnosis}</p>
                  <p className="text-sm mt-1">
                    <strong>View Image:</strong>{" "}
                    <a
                      href={record.ipfsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View File
                    </a>
                  </p>
                  <p className="text-sm mt-1">
                    <strong>Prescribed Medicine:</strong>{" "}
                    {record.prescription || (
                      <span className="italic text-gray-400">Not yet prescribed</span>
                    )}
                  </p>

                  
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="mt-3 flex flex-end text-sm text-red-600 hover:underline"
                  >
                    Delete Record
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
