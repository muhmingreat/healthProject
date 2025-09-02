import React from 'react';
import { motion } from 'framer-motion';
import image from '../assets/healthcareImage.png';
import { Link } from 'react-router-dom';
import About from './About';
import Footer from '../component/Footer';
import GetDoctor from './GetAllDoctors';

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Twinkling Star Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff22_1px,transparent_1px)] [background-size:18px_18px] animate-twinkle z-0" />

      {/* Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f] via-black to-black z-0" />

      {/* Main App Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-4 sm:px-6 md:px-10">
          <motion.div
            className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 sm:gap-10 p-4 sm:p-8 bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl max-w-7xl w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* Text Section */}
            <div className="flex-1 text-center md:text-left space-y-3 sm:space-y-4">
              <motion.h1
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-950 bg-clip-text text-transparent"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                Welcome to HealthCare System
              </motion.h1>

              <motion.h2
                className="text-lg sm:text-xl md:text-2xl font-semibold text-green-400"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                Secure, Transparent & Decentralized Medical Records
              </motion.h2>

              <motion.p
                className="text-sm sm:text-base text-gray-200"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
              >
                HealthCare System puts your medical records where they belong  in your hands.<br/> Using blockchain & IPFS,
                we provide tamper proof, secure, and accessible health data for both patients and doctors.
              </motion.p>

              <div className="bg-white/10 p-3 sm:p-4 rounded-xl mt-2 backdrop-blur-sm text-sm sm:text-base">
                <p>
                  Register as a <span className="font-bold text-blue-300">Doctor</span> or{' '}
                  <span className="font-bold text-green-300">Patient</span> to begin.
                </p>
                <p>
                  Already registered? Book appointments or get a diagnosis below.
                </p>
              </div>

              <motion.div
                className="flex flex-wrap gap-3 sm:gap-4 mt-5 justify-center md:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
              >
                <Link to='/patient'>
                  <button className="bg-green-300 hover:bg-green-700 text-black 
                  font-bold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition">
                    Get Started
                  </button>
                </Link>

                <Link to="/medical">
                  <button className="bg-green-700 hover:bg-green-900 
                  text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition">
                    Get Diagnosis
                  </button>
                </Link>

                <Link to="/booking">
                  <button className="bg-green-300 hover:bg-green-700
                   text-black font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-full transition">
                    Book Appointment
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Image Section */}
            <motion.div
              className="flex-1 w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <img
                src={image}
                alt="Healthcare Illustration"
                className="w-full h-auto max-h-[400px] sm:max-h-[500px] object-contain rounded-2xl shadow-lg"
              />
            </motion.div>
          </motion.div>

        
            <GetDoctor />
            <About />
            <Footer />
    
        </div>
      </div>
    </div>
  );
};

export default Home;



