import React from 'react';
import { motion } from 'framer-motion';
import image from '../assets/healthcareImage.png';
import { Link } from 'react-router-dom';
import About from './About';
import Footer from '../component/Footer';
import Header from '../component/Header';
import GetDoctor from './GetAllDoctors';

const Home = () => {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Twinkling Star Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff22_1px,transparent_1px)] [background-size:18px_18px] animate-twinkle z-0" />

      {/* Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001f3f] via-black via-[#00ced1] to-[#800000] z-0" />

      {/* Main App Content */}
      <div className="relative z-10">
        {/* <Header /> */}

        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center pt-28 px-4">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between gap-10 p-8 bg-white/10 backdrop-blur-lg rounded-3xl shadow-xl max-w-7xl w-full"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            {/* Text Section */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <motion.h1
                className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-blue-950 bg-clip-text text-transparent"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                Welcome to HealthChain
              </motion.h1>

              <motion.h2
                className="text-2xl font-semibold text-green-600"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                Secure, Transparent & Decentralized Medical Records
              </motion.h2>

              <motion.p
                className="text-gray-200 text-md"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
              >
                HealthChain puts your medical records where they belong — in your hands. Using blockchain & IPFS,
                we provide tamper-proof, secure, and accessible health data for both patients and doctors.
              </motion.p>

              <div className="bg-white/10 p-4 rounded-xl mt-2 backdrop-blur-sm">
                <p>
                  Register as a <span className="font-bold text-blue-300">Doctor</span> or{' '}
                  <span className="font-bold text-green-300">Patient</span> to begin.
                </p>
                <p>
                  Already registered? Book appointments or get a diagnosis below.
                </p>
              </div>

              <motion.div
                className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
              >
                <button className="bg-green-300 hover:bg-green-700 text-black font-bold py-3 px-6 rounded-full transition">
                  <Link to='/patient'>Get Started</Link>
                </button>

                <Link to="/medical">
                  <button className="bg-green-700 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-full transition">
                    Get Diagnosis
                  </button>
                </Link>

                <Link to="/booking">
                  <button className="bg-green-300 hover:bg-green-700 text-black font-semibold py-3 px-6 rounded-full transition">
                    Book Appointment
                  </button>
                </Link>
              </motion.div>
            </div>

            {/* Image Section */}
            <motion.div
              className="flex-1"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              <img
                src={image}
                alt="Healthcare Illustration"
                className="rounded-2xl shadow-lg w-full h-auto object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Additional Sections */}
          <div className="w-full mt-16">
            <GetDoctor />
            <About />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

