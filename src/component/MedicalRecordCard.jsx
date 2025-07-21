import React, { useState } from "react";
import useCreatePrescription from "../hooks/useCreatePrescription"; 
import useDeleteMedicalRecord from "../hooks/useDeleteMedicalRecord";

const MedicalRecordCard = ({ record }) => {
  const formattedDate = new Date(record.timestamp * 1000).toLocaleDateString();
  const [prescriptionText, setPrescriptionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const prescribe = useCreatePrescription();
  const handleDeleteMedical = useDeleteMedicalRecord()

  const handlePrescribe = async () => {
    if (!prescriptionText) return;
    setIsSubmitting(true);
    await prescribe(record.id, prescriptionText);
    setIsSubmitting(false);
    setPrescriptionText("");
    
  };

  const handleDelete = async (id) => {
    const confirm = window.alert('Are you sure you want to delete medical records')
    if(!confirm) return ;

    await handleDeleteMedical(id)
    toast.success(`Medical with ${id} deleted`)

  } 
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
        <div className="mt-4">
          <textarea
            placeholder="Write prescription..."
            value={prescriptionText}
            onChange={(e) => setPrescriptionText(e.target.value)}
            className="w-full p-2 border rounded-md text-sm"
            rows={2}
          />
          <div className="flex justify-around items-center" >
          <button
            onClick={handlePrescribe}
            disabled={isSubmitting}
            className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            <button className="text-red-500 " onClick={handleDelete}>{record.isDelete}</button>
            {isSubmitting ? "Submitting..." : "Add Prescription"}
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordCard;



// import React from "react";

// const MedicalRecordCard = ({ record }) => {
//   const formattedDate = new Date(record.date * 1000).toLocaleDateString();

//   return (
//     <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
//       <p className="text-sm text-gray-600">Record ID: #{record.id}</p>
//       <p className="text-sm text-gray-600">Patiemt Name: {record.patientName}</p>
//       <p className="text-md font-medium">Diagnosis: {record.diagnosis}</p>
//       <p className="text-sm text-gray-500">Date: {formattedDate}</p>
//       {record.prescription && (
//         <p className="text-sm mt-2 text-green-600">Prescription: {record.prescription}</p>
//       )}
//       <a
//         href={record.ipfsUrl}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="text-blue-600 underline mt-2 block cursor-pointer"
//       >
//         View Record File
//       </a>
//     </div>
//   );
// };

// export default MedicalRecordCard;
