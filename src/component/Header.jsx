import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppKitAccount } from '@reown/appkit/react';
import useContractInstance from '../hooks/useContractInstance';
import { useHealthcare } from '../context/HealthCareContext';
// import Alert from './Alert';
import { Bell } from 'lucide-react';

const Header = () => {
  const { address } = useAppKitAccount();
  const contract = useContractInstance();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const { appName,resetAlerts,alertCount } = useHealthcare();
  const [sidebarOpen, setSidebarOpen] = useState(false);

    

useEffect(() => {
  const fetchRoles = async () => {
    if (!contract || !address) return;
    try {
      const adminRole = await contract.DEFAULT_ADMIN_ROLE();
      const doctorRole = await contract.DOCTOR_ROLE();
      const patientRole = await contract.PATIENT_ROLE();

      const isAdminRole = await contract.hasRole(adminRole, address);
      const isDoctorRole = await contract.hasRole(doctorRole, address);
      const isPatientRole = await contract.hasRole(patientRole, address);

      setIsAdmin(isAdminRole);
      setIsDoctor(isDoctorRole);
      setIsPatient(isPatientRole);
      
console.log("Doctor:", isDoctorRole, "Patient:", isPatientRole);
    } catch (err) {
      console.error('Header fetch error:', err);
    }
  };

  fetchRoles();
}, [contract, address]);

  const handleRegisterSelect = (val) => {
    setShowRegisterMenu(false);
    
    if (val === 'patient') navigate('/patient');
    if (val === 'doctor') navigate('/doctor');
    if (val === 'booking') navigate('/booking');
    if (val === 'medical') navigate('/medical');
    
  };

  const handleViewSelect = (val) => {
    setShowViewMenu(false);
  
    if (val === 'individual') navigate('/doctor-list');
    if (val === 'patient-view') navigate('/patient-view');
    if (val === 'doctor-dashboard') navigate('/doctor-dashboard');
    if (val === 'all-patients' && isAdmin) navigate('/allPatient');
  };
     
  return (
    <header className="relative z-50">
      {/* Shimmer Dot Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff25_1px,transparent_1px)]
       [background-size:18px_18px] animate-pulse z-0" />

      {/* Gradient Bar */}
      <div className="bg-gradient-to-r from-[#001f3f] via-black via-[#00ced1] to-[#b11616]
       p-4 fixed w-full flex justify-between items-center backdrop-blur-md shadow-lg z-10 text-white">
        <h1
          className="text-2xl font-extrabold
           bg-[linear-gradient(to_right,#00ced1,#ffffff,#800000)] 
           bg-clip-text text-transparent bg-[length:300%_100%] animate-shimmer"
        >
          {appName}
        </h1>

        <nav className="hidden lg:flex items-center space-x-4 relative z-10">
          <Link to="/" className="text-white hover:text-[#FFD700] transition">Home</Link>
        
        
          <div className="relative">
            <button
              onClick={() => { 
                setShowRegisterMenu((prev) => !prev)
                setShowViewMenu(false)
              }}
              className="text-white bg-white/10 px-3 py-1 cursor-pointer rounded-md hover:bg-white/20"
            >
              Register
            </button>
            {showRegisterMenu && (
              <ul className="absolute top-10 left-0 bg-white text-black w-48 rounded  shadow-lg z-20">
                <li className="p-2 hover:bg-gray-100 " onClick={() => handleRegisterSelect('patient')}>Register as Patient</li>
                <li className="p-2 hover:bg-gray-100 " onClick={() => handleRegisterSelect('doctor')}>Register as Doctor</li>
                <li className="p-2 hover:bg-gray-100 " onClick={() => handleRegisterSelect('booking')}>Book Appointment</li>
                <li className="p-2 hover:bg-gray-100 " onClick={() => handleRegisterSelect('medical')}>Get Diagnosis</li>

              </ul>
            )}
          </div>

      
          <div className="relative cursor-pointer">
            <button
              onClick={() =>{ setShowViewMenu((prev)=> !prev )
                setShowRegisterMenu(false) 
              
              }}
              className="text-white bg-white/10 px-3 py-1 rounded-md hover:bg-white/20"
            >
              View Record
            </button>
            {showViewMenu && (
              <ul className="absolute top-10 left-0 bg-white text-black w-48 rounded shadow-lg z-20">
                <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleViewSelect('individual')}>Available Doctors</li>
                {isDoctor && (
                    <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleViewSelect('doctor-dashboard')}>Doctor Dashboard</li>

                )}
                {isPatient && (
                     <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleViewSelect('patient-view')}>Patient Dashboard</li>
                )}
                {isAdmin && (
                  <li className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleViewSelect('all-patients')}>All Patients</li>
                )}
              </ul>
            )}
          </div>
  
      
          <appkit-button className="px-3 py-1 rounded-full bg-cyan-950 hover:bg-gray-900 transition" />
          {/* Hamburger menu for small screens */}
  </nav>
<div className="lg:hidden ">
  <button
    onClick={() => setSidebarOpen(true)}
    className="text-white p-2 bg-white/10 rounded-md"
  >
    ☰
  </button>
</div>

        {/* Sidebar (visible on small screens) */}
{sidebarOpen && (
  
  <div className="fixed inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500
   z-50 animate-slide-in flex flex-col p-6 space-y-4">
    <button
      onClick={() => setSidebarOpen(false)}
      className="self-end text-xl font-bold"
    >
      ✕
    </button>

    <Link to="/" onClick={() => setSidebarOpen(false)} className="hover:text-yellow-300">Home</Link>

    <div>
      
      <div className="space-y-2 cursor-pointer ">
        <p className="border-b pb-4" onClick={() => { setSidebarOpen(false); navigate('/patient'); }}>Register as Patient</p>
        <p  className="border-b pb-4"onClick={() => { setSidebarOpen(false); navigate('/doctor'); }}>Register as Doctor</p>
        <p className="border-b pb-4" onClick={() => { setSidebarOpen(false); navigate('/booking'); }}>Book Appointment</p>
        <p className="border-b pb-4" onClick={() => { setSidebarOpen(false); navigate('/medical'); }}>Get Diagnosis</p>
      </div>
    </div>

    <div>
    
      <div className="space-y-2 cursor-pointer">
        <p   className="border-b pb-4"onClick={() => { setSidebarOpen(false); navigate('/doctor-list'); }}>Available Doctors</p>
        {isDoctor && <p  className="border-b pb-4" onClick={() => { setSidebarOpen(false); navigate('/doctor-dashboard') }}>Doctor Dashboard</p>}
        {isPatient && <p  className="border-b pb-4" onClick={() => { setSidebarOpen(false); navigate('/patient-view') }}>Patient Dashboard</p>}
        {isAdmin && <p   className="border-b pb-4"onClick={() => { setSidebarOpen(false); navigate('/allPatient') }}>All Patients</p>}
      </div>
    </div>
  </div>
)}

      </div>
      
    </header>
  );
};

export default Header;


