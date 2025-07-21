
import React, { useState, useEffect, useRef } from "react";
import { useHealthcare } from "../context/HealthCareContext";
import useBookAppointment from "../hooks/useBookAppointment";
import NETS from "vanta/src/vanta.net";
import * as THREE from "three";
import { Loader2 } from "lucide-react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

const BookAppointment = () => {
  const { allDoctors } = useHealthcare();
  const bookAppointment = useBookAppointment();

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [fee, setFee] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !appointmentDate || !fee) {
      alert("Please fill in all fields.");
      return;
    }
    const numericFee = parseFloat(fee);

    if (isNaN(numericFee) || numericFee <= 0) {
      alert("Fee must be a positive number.");
      return;
    }
    const now = Math.floor(Date.now() / 1000) + 3600
    const selectedTime = Math.floor(new Date(appointmentDate).getTime() / 1000);
    if (selectedTime < now) {
      alert("Please select a future date and time.");
      return;
    }

    const timestamp = selectedTime;
    const feeInWei = ethers.parseEther(numericFee.toFixed(6)); //
    try {

      setIsLoading(true)
      await bookAppointment(selectedDoctor, timestamp, feeInWei);



      setSelectedDoctor("");
      setAppointmentDate("");
      setFee("");
    } catch (err) {
      console.error("Error booking appointment", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NETS({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x00bfff,
          backgroundColor: 0x000000,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="w-full min-h-screen flex items-center justify-center  ">
      <form
        onSubmit={handleSubmit}
        className="
          w-full 
          sm:max-w-sm 
          md:max-w-md 
          
          
          2xl:max-w-2xl
          bg-white 
          rounded-2xl 
          shadow-2xl 
          p-6 
          sm:p-8 
          md:p-10 
          mt-10 
          mb-10
          relative top-10
        "
      >
        <h1 className="text-2xl sm:text-3xl md:text-1xl font-bold text-center mb-8 text-black">
          Book Appointment
        </h1>

        <div className="flex flex-col gap-6">
          {/* Doctor Selection */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Select Doctor</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-1 text-sm md:text-base"
              required
              disabled={isLoading}
            >
              <option value="">Choose Doctor</option>
              {allDoctors.map((doctor) => (
                <option key={doctor.account} value={doctor.account}>
                  {doctor.name} ({doctor.specialization})
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Date */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Appointment Date</label>
            <input
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm md:text-base"
              required
              disabled={isLoading}
            />
          </div>

          {/* Fee */}
          <div>
            <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">Fee (CELO)</label>
            <input
              type="number"
              placeholder="0.001"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm md:text-base"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="
            mt-8 w-full 
            bg-blue-600 
            text-white 
            py-3 
            rounded-lg 
            hover:bg-blue-700 
            transition 
            text-sm md:text-base 
            font-semibold
          "
        >
          {isLoading ? (
            <span className="flex justify-center items-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" />
              Processing...
            </span>
          ) : (
            "Book Appointment"
          )}

        </button>
        <div>
          <Link to='/medical'>
            click here to get daigonis
          </Link>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
