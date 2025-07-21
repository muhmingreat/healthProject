// components/CycleContent.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const contentList = [
  {
    title: "Welcome to HealthChain",
    description:
      "HealthChain is your trusted partner in managing medical records with complete control and transparency. Our blockchain-powered system ensures that your data is always secure, traceable, and easily accessible. Say goodbye to scattered paperwork and disconnected systems—welcome to the future of healthcare record management, where everything is in one place.",
    button: "Learn More",
  },
  {
    title: "Secure & Private",
    description:
      "Your privacy matters. HealthChain uses cutting-edge encryption to safeguard your medical data. Only you and your approved healthcare providers can access your information. Every record access is logged immutably, providing full transparency and peace of mind that your sensitive information is never compromised or shared without your permission.",
    button: "See How It Works",
  },
  {
    title: "Accessible Anywhere",
    description:
      "Never lose access to your medical history again. HealthChain lets you retrieve and share your health data from any device, whether you're visiting a local doctor or traveling abroad. Your records follow you—not the other way around—making emergencies, referrals, and second opinions seamless and stress-free.",
    button: "Access Records",
  },
  {
    title: "Blockchain Powered",
    description:
      "Our system is built on Ethereum smart contracts, ensuring full auditability and automation of record permissions. With decentralized storage and tamper-proof logs, HealthChain redefines trust in healthcare. Doctors, patients, and institutions can collaborate without the friction of legacy systems or third-party intermediaries slowing down the process.",
    button: "Explore Technology",
  },
];


export default function CycleContent() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % contentList.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black p-4">
      <div className="text-center max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 1.05 }}
            transition={{ duration: 0.7 }}
            className="text-white bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-extrabold">{contentList[index].title}</h2>
            <p className="text-lg text-white/90">{contentList[index].description}</p>
            <button className="mt-4 px-6 py-2 bg-white text-indigo-700 font-semibold rounded-full shadow-md hover:scale-105 transition-transform duration-300">
              {contentList[index].button}
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

