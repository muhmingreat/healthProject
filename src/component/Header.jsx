import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react";
import useContractInstance from "../hooks/useContractInstance";
import { useHealthcare } from "../context/HealthCareContext";
import { Menu, X } from "lucide-react";

const Header = () => {
  const { address } = useAppKitAccount();
  const contract = useContractInstance();
  const navigate = useNavigate();
  const { appName } = useHealthcare();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [isPatient, setIsPatient] = useState(false);

  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      if (!contract || !address) return;
      try {
        const adminRole = await contract.DEFAULT_ADMIN_ROLE();
        const doctorRole = await contract.DOCTOR_ROLE();
        const patientRole = await contract.PATIENT_ROLE();

        setIsAdmin(await contract.hasRole(adminRole, address));
        setIsDoctor(await contract.hasRole(doctorRole, address));
        setIsPatient(await contract.hasRole(patientRole, address));
      } catch (err) {
        console.error("Header fetch error:", err);
      }
    };

    fetchRoles();
  }, [contract, address]);

  // Handlers
  const handleRegisterSelect = (val) => {
    setShowRegisterMenu(false);
    navigate(`/${val}`);
  };

  const handleViewSelect = (val) => {
    setShowViewMenu(false);
    if (val === "all-patients" && !isAdmin) return;
    navigate(`/${val}`);
  };

  return (
    <header className="relative z-50">
      {/* Background dots shimmer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff25_1px,transparent_1px)] [background-size:18px_18px] animate-pulse z-0" />

      {/* Top Bar */}
      <div className="bg-gradient-to-r from-[#001f3f] via-black via-[#00ced1] to-[#b11616] p-4 fixed w-full flex justify-between items-center backdrop-blur-md shadow-lg z-10 text-white">
        <h1
          className="text-2xl font-extrabold bg-[linear-gradient(to_right,#00ced1,#ffffff,#800000)] 
           bg-clip-text text-transparent bg-[length:300%_100%] animate-shimmer"
        >
          {appName}
        </h1>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-4 relative z-10">
          <Link to="/" className="hover:text-[#FFD700] transition">
            Home
          </Link>

          {/* Register Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRegisterMenu((prev) => !prev);
                setShowViewMenu(false);
              }}
              className="bg-white/10 px-3 py-1 rounded-md hover:bg-white/20"
            >
              Register
            </button>
            {showRegisterMenu && (
              <ul className="absolute top-10 left-0 bg-white text-black w-48 rounded shadow-lg z-20">
                {["patient", "doctor", "booking", "medical"].map((val) => (
                  <li
                    key={val}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleRegisterSelect(val)}
                  >
                    {`Register as ${val.charAt(0).toUpperCase() + val.slice(1)}`}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* View Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowViewMenu((prev) => !prev);
                setShowRegisterMenu(false);
              }}
              className="bg-white/10 px-3 py-1 rounded-md hover:bg-white/20"
            >
              View Record
            </button>
            {showViewMenu && (
              <ul className="absolute top-10 left-0 bg-white text-black w-48 rounded shadow-lg z-20">
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleViewSelect("doctor-list")}
                >
                  Available Doctors
                </li>
                {isDoctor && (
                  <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleViewSelect("doctor-dashboard")}
                  >
                    Doctor Dashboard
                  </li>
                )}
                {isPatient && (
                  <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleViewSelect("patient-view")}
                  >
                    Patient Dashboard
                  </li>
                )}
                {isAdmin && (
                  <li
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleViewSelect("allPatient")}
                  >
                    All Patients
                  </li>
                )}
              </ul>
            )}
          </div>

          <appkit-button className="rounded-full bg-black hover:bg-gray-900 transition" />
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white p-2 bg-white/10 rounded-md"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 text-white z-50 flex flex-col p-6 space-y-6 animate-slide-in">
          <button
            onClick={() => setSidebarOpen(false)}
            className="self-end text-2xl font-bold"
          >
            <X size={28} />
          </button>

          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="hover:text-yellow-300"
          >
            Home
          </Link>

          {/* Register Section */}
          <div className="space-y-4">
            <p
              onClick={() => {
                setSidebarOpen(false);
                navigate("/patient");
              }}
              className="border-b pb-2 cursor-pointer"
            >
              Register as Patient
            </p>
            <p
              onClick={() => {
                setSidebarOpen(false);
                navigate("/doctor");
              }}
              className="border-b pb-2 cursor-pointer"
            >
              Register as Doctor
            </p>
            <p
              onClick={() => {
                setSidebarOpen(false);
                navigate("/booking");
              }}
              className="border-b pb-2 cursor-pointer"
            >
              Book Appointment
            </p>
            <p
              onClick={() => {
                setSidebarOpen(false);
                navigate("/medical");
              }}
              className="border-b pb-2 cursor-pointer"
            >
              Get Diagnosis
            </p>
          </div>

          {/* View Section */}
          <div className="space-y-4">
            <p
              onClick={() => {
                setSidebarOpen(false);
                navigate("/doctor-list");
              }}
              className="border-b pb-2 cursor-pointer"
            >
              Available Doctors
            </p>
            {isDoctor && (
              <p
                onClick={() => {
                  setSidebarOpen(false);
                  navigate("/doctor-dashboard");
                }}
                className="border-b pb-2 cursor-pointer"
              >
                Doctor Dashboard
              </p>
            )}
            {isPatient && (
              <p
                onClick={() => {
                  setSidebarOpen(false);
                  navigate("/patient-view");
                }}
                className="border-b pb-2 cursor-pointer"
              >
                Patient Dashboard
              </p>
            )}
            {isAdmin && (
              <p
                onClick={() => {
                  setSidebarOpen(false);
                  navigate("/allPatient");
                }}
                className="border-b pb-2 cursor-pointer"
              >
                All Patients
              </p>
            )}
          </div>

          <appkit-button className="px-3 py-2 rounded-full bg-black hover:bg-gray-900 transition" />
        </div>
      )}
    </header>
  );
};

export default Header;ad