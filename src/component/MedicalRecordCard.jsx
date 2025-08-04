import React, { useState } from "react";
import useCreatePrescription from "../hooks/useCreatePrescription";
import useDeleteMedicalRecord from "../hooks/useDeleteMedicalRecord";
import { toast } from "react-toastify";

const MedicalRecordCard = ({ record }) => {
  const formattedDate = new Date(record.timestamp * 1000).toLocaleDateString();
  const [prescriptionText, setPrescriptionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prescribe = useCreatePrescription();
  const deleteMedicalRecord = useDeleteMedicalRecord();

  const handlePrescribe = async () => {
    if (!prescriptionText) return;
    setIsSubmitting(true);
    await prescribe(record.id, prescriptionText);
    setIsSubmitting(false);
    setPrescriptionText("");
  };

  const handleDelete = async () => {
    const confirm = window.confirm("Are you sure you want to delete this medical record?");
    if (!confirm) return;

    await deleteMedicalRecord(record.id);
    // No need to show toast here — the hook already does
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
      <p className="text-sm text-gray-600">Record ID: #{record.id}</p>
      <p className="text-sm text-gray-600">Patient Name: {record.patientName}</p>
      <p className="text-md font-medium">Diagnosis: {record.diagnosis}</p>
      <p className="text-sm text-gray-500">Date: {formattedDate}</p>

      <a
        href={record.ipfsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline mt-2 block cursor-pointer"
      >
        View Record File
      </a>

      {record.prescription ? (
        <p className="text-sm mt-2 text-green-600">Prescription: {record.prescription}</p>
      ) : (
        <div className="mt-4 space-y-2">
          <textarea
            placeholder="Write prescription..."
            value={prescriptionText}
            onChange={(e) => setPrescriptionText(e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
            rows={2}
          />

          <div className="flex justify-between items-center">
            <button
              onClick={handlePrescribe}
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              {isSubmitting ? "Submitting..." : "Add Prescription"}
            </button>

            <button
              onClick={handleDelete}
              className="text-red-500 text-sm hover:underline"
            >
              Delete Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordCard;




