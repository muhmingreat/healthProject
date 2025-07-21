import React, { useCallback, useEffect, useState } from "react";
import useContractInstance from "../hooks/useContractInstance";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import useDeletePatient from "../hooks/useDeletePatient";

const AllPatients = () => {
  const contract = useContractInstance(true);
  const { address } = useAppKitAccount();
  const [patients, setPatients] = useState([]);
  const handleDeletePatient = useDeletePatient();

  const getAllPatients = useCallback(async () => {
    if (!contract || !address) return;

    try {
      const adminRole = await contract.DEFAULT_ADMIN_ROLE();
      const isAdmin = await contract.hasRole(adminRole, address);

      if (!isAdmin) {
        toast.error("⛔ You are not an admin");
        return;
      }

      const rawPatients = await contract.getAllPatientsRecords();

      const formatted = rawPatients.map((p) => ({
        id: Number(p.id),
        name: p.name,
        age: Number(p.age),
        gender: p.gender,
        wallet: p.account || p.wallet,
        avatar: p.avatar,
        isDeleted: p.isDeleted,
      }));

      setPatients(formatted);
    } catch (err) {
      console.error("❌ Error fetching all patients", err);
      toast.error("Failed to fetch registered patients");
    }
  }, [contract, address]);

  useEffect(() => {
    getAllPatients();
  }, [getAllPatients]);

  // 🧹 Handle delete
  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this patient?");
    if (!confirmed) return;

    try {
      await handleDeletePatient(id);
      toast.success(`Patient with ID ${id} deleted.`);
      getAllPatients(); 
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete patient");
    }
  };

  return (
    <div className="p-6 relative top-15">
      <h2 className="text-2xl font-semibold mb-4">🩺 All Registered Patients</h2>
      {patients.length === 0 ? (
        <p>No patient records found or you're unauthorized.</p>
      ) : (
        <table className="w-full border border-gray-200 text-left text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Age</th>
              <th className="p-2 border">Gender</th>
              <th className="p-2 border">Wallet</th>
              <th className="p-2 border">Avatar</th>
              <th className="p-2 border">Status</th>
               <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-2 border">{p.id}</td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.age}</td>
                <td className="p-2 border">{p.gender}</td>
                <td className="p-2 border">{p.wallet}</td>
                <td className="p-2 border">{p.avatar}</td>
                <td className="p-2 border">
                  {p.isDeleted ? (
                    <span className="text-red-500">Deleted</span>
                  ) : (
                    <span className="text-green-600">Active</span>
                  )}
                </td>
                <td className="p-2 border">
                  {!p.isDeleted && (
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllPatients;

