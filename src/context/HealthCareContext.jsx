import { createContext, useCallback, useContext, useEffect, useState } from "react";
import useContractInstance from "../hooks/useContractInstance";
import { useAppKitAccount } from "@reown/appkit/react";
import { toast } from "react-toastify";
import { isAddress } from "ethers"
import { ethers } from "ethers";

const HealthCareContext = createContext();

export const HealthCareProvider = ({ children }) => {

  const appName = "Healthcare System";

  const [healthcare, setHealthcare] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loggedInPatient, setLoggedInPatient] = useState(null);
  const [allDoctors, setAllDoctors] = useState([]);
  const [patientRecords, setPatientRecords] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState();
  const [doctorAssignedRecords, setDoctorAssignedRecords] = useState([]);

  

  const { address } = useAppKitAccount();
  const contract = useContractInstance(true);

  // 🧑‍⚕️ Fetch all doctors
  const fetchAllDoctors = useCallback(async () => {
    if (!contract) return;
    try {
      const doctors = await contract.getAllDoctors();
      const formatted = doctors.map(doc => ({
        id: Number(doc.id),
        name: doc.name,
        specialization: doc.specialization,
        licenseId: doc.licenseId,
        account: doc.account,
        biography: doc.biography,
        avatar:doc.avatar,
        isDeleted: doc.isDeleted,
      }));
      setAllDoctors(formatted);
    } catch (err) {
      console.error("Error fetching doctors", err);
    }
  }, [contract]);

  useEffect(() => {
    fetchAllDoctors();
  }, [fetchAllDoctors]);

const getPatientMedicalRecords = useCallback(async (patientId, viewerAddress = address) => {
  if (!contract || !patientId) return;
  try {
    const canView = await contract.canView(patientId, viewerAddress);
    if (!canView) {
      toast.error("You are not authorized to view this patient's medical records");
      setPatientRecords([]);
      return;
    }

    const records = await contract.getPatientMedicalRecords(patientId);
    const formatted = records.map(rec => ({
      id: Number(rec.id),
      patientId: Number(rec.patientId),
      doctorId: Number(rec.doctorId),
      ipfsUrl: rec.ipfsUrl,
      patientName: rec.patientName,
      diagnosis: rec.diagnosis,
      prescription: rec.prescription,
      timestamp: Number(rec.timestamp),
      isDeleted: rec.isDeleted,
    }));
    setPatientRecords(formatted);
  } catch (err) {
    console.error("Error fetching medical records", err);
    setPatientRecords([]);
  }
}, [contract, address]);


useEffect(() => {
  const storedPatient = localStorage.getItem("selectedPatient");
  if (storedPatient) {
    setSelectedPatient(JSON.parse(storedPatient));
  }
}, []);

useEffect(() => {
  if (selectedPatient) {
    localStorage.setItem("selectedPatient", JSON.stringify(selectedPatient));
  }
}, [selectedPatient]);

const fetchSinglePatient = useCallback(async (patientId) => {
  if (!contract || !patientId) return;

   console.log("Calling getSinglePatient with ID:", patientId);
    localStorage.clear();
    sessionStorage.clear();
    indexedDB.databases().then(dbs =>
      dbs.forEach(db => indexedDB.deleteDatabase(db.name))
    );
  const numericId = typeof patientId === 'bigint' ? Number(patientId) : patientId;

  if (!numericId || isNaN(numericId) || numericId <= 0) {
    toast.error("Invalid patient ID");
    return;
  }

  console.log("Calling getSinglePatient with ID:", numericId);

  try {
    const patient = await contract.getSinglePatient(numericId);

    if (patient.isDeleted) {
      toast.error("This patient record is deleted");
      return;
    }

    const formatted = {
      id: numericId,
      name: patient.name,
      age: Number(patient.age),
      wallet: patient.wallet,
      isDeleted: patient.isDeleted,
    };

    setSelectedPatient(formatted);
    console.log("✅ Selected patient:", formatted);
    return formatted;

  } catch (err) {
    console.error("❌ Error fetching patient by ID:", err);
    toast.error("Patient not found or invalid");
  }
}, [contract]);


const getMyPatientProfile = useCallback(async () => {
  if (!contract || !address) return;
  try {
    const patient = await contract.getMyPatientProfile();

    const formatted = {
      id: Number(patient.id),
      name: patient.name,
      age: Number(patient.age),
      wallet: patient.wallet,
      isDeleted: patient.isDeleted,
    };

    setLoggedInPatient(formatted);
    console.log("✅ Logged in patient profile:", formatted);
    return formatted;

  } catch (err) {
    console.error("❌ Error fetching patient profile", err);
    toast.error("Failed to load patient profile");
  }
}, [contract, address]);

const getAllPatients = useCallback(async () => {
  if (!contract || !address) return;
  try {
     const adminRole = await contract.DEFAULT_ADMIN_ROLE();
    if (!adminRole || isAddress(address)) {
      console.warn("Invalid role or address");
      return;
    }

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
      wallet: p.wallet,
      isDeleted: p.isDeleted,
    }));
    console.log("🩺 All registered patients:", formatted); // ✅ <--- this line
    setAllRecords(formatted);
  } catch (err) {
    console.error("❌ Error fetching all patients", err);
    toast.error("Failed to fetch registered patients");
  }
}, [contract]);

 useEffect(() => {
    getAllPatients();
  }, []);


const fetchDoctorProfile = useCallback(async () => { 
if(!address   || !contract) return;
  try {
    const doctor = await contract.getMyDoctorProfile();
    if (!doctor || doctor.isDeleted) {
      toast.error("You are not registered as a doctor");
      return;
    }
    const formatted = {
      id: Number(doctor.id),
      name: doctor.name,
      specialization: doctor.specialization,
      licenseId: doctor.licenseId,
      biography: doctor.biography,
      avatar: doctor.avatar,
      account: doctor.account,
      isDeleted: doctor.isDeleted,
    };
    setDoctorProfile(formatted);
  } catch (err) {
    console.error("Error fetching doctor profile", err);
    toast.error("Failed to fetch your doctor profile");
  }

},[])
useEffect(() => {
  fetchDoctorProfile();
}, [fetchDoctorProfile]);

const getMyAssignedMedicalRecords = useCallback(async () => {
  if (!contract || !doctorProfile?.id) return;

  try {
    const records = await contract.getMedicalRecordsByDoctor(doctorProfile.id);
    const formatted = records.map((rec) => ({
      id: Number(rec.id),
      patientId: Number(rec.patientId),
      doctorId: Number(rec.doctorId),
      ipfsUrl: rec.ipfsUrl,
      patientName: rec.patientName,
      diagnosis: rec.diagnosis,
      prescription: rec.prescription,
      timestamp: Number(rec.timestamp),
      isDeleted: rec.isDeleted,
    }));
    setDoctorAssignedRecords(formatted); 
  } catch (err) {
    console.error("Failed to fetch doctor-assigned records", err);
    toast.error("Could not fetch assigned patient prescriptions.");
  }
}, [contract, doctorProfile]);

// useEffect(() => {

//     getMyAssignedMedicalRecords();
//   }, [ getMyAssignedMedicalRecords]);
  return (
    <HealthCareContext.Provider value={{
      appName,
      healthcare,
      allDoctors,
      allRecords,
      patientRecords,
      selectedPatient,
      loggedInPatient,
      address,
      doctorProfile,
      doctorAssignedRecords,
      getPatientMedicalRecords,
      getAllPatients,
      getMyPatientProfile,
      fetchSinglePatient,
      getMyAssignedMedicalRecords
    }}>
      {children}
    </HealthCareContext.Provider>
  );
};

export const useHealthcare = () => useContext(HealthCareContext);