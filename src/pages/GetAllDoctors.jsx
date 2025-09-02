import React from 'react';
import { useHealthcare } from '../context/HealthCareContext';
import { motion } from 'framer-motion';

const GetDoctor = () => {
  const { allDoctors } = useHealthcare();

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 md:px-10 py-12 relative top-15">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-sky-400 mb-10 sm:mb-12"
      >
        Meet Our Registered Doctors
      </motion.h1>

      {allDoctors.length === 0 ? (
        <div className="text-center text-gray-400">No doctors registered yet.</div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {allDoctors.map((doctor, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="flex flex-col sm:flex-row bg-gradient-to-br from-black via-blue-900 via-40% to-sky-600 
                         rounded-xl overflow-hidden shadow-xl transition-all duration-300"
            >
              {/* Avatar Section */}
              <div className="w-full sm:w-1/3 bg-gradient-to-b from-sky-800 to-indigo-950 p-4 flex justify-center items-center">
                <img
                  src={doctor.avatar}
                  alt={doctor.id}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-white shadow-md"
                />
              </div>

              {/* Info Section */}
              <div className="w-full sm:w-2/3 p-4 space-y-1 sm:space-y-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">{doctor.name}</h3>
                <p className="text-xs sm:text-sm text-gray-300">
                  <strong>Specialization:</strong> {doctor.specialization}
                </p>
                <p className="text-xs sm:text-sm text-gray-300">
                  <strong>License:</strong> {doctor.licenseId}
                </p>
                <p className="text-xs sm:text-sm text-gray-300">
                  <strong>Biography:</strong> {doctor.biography}
                </p>
                <p className="text-xs sm:text-sm text-gray-400">
                  <strong>Account:</strong> {doctor.account.slice(0, 10)}...
                </p>
                <p className="text-xs sm:text-sm text-gray-200">
                  <strong>Status:</strong>{' '}
                  {doctor.isDeleted ? (
                    <span className="text-red-400">Deleted</span>
                  ) : (
                    <span className="text-green-400">Active</span>
                  )}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default GetDoctor;


