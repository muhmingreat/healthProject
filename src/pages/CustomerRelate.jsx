import React from "react";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const ADMIN_NUMBER = "+2348140806540"; // Replace with admin's phone number
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/GdPR7O3fsUTGw6PBZv6tEX"; // Replace with your group invite link

export default function WhatsAppConnect() {
  // const callAdmin = () => {
  //   window.open(`tel:${ADMIN_NUMBER}`, "_blank");
  // };
  const whatsappAdmin = () => {
  window.open(`https://wa.me/${ADMIN_NUMBER.replace("+", "")}`, "_blank");
};

  const joinGroup = () => {
    window.open(WHATSAPP_GROUP_LINK, "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 text-center w-80">
        <h2 className="text-xl font-bold mb-4">Connect with Us</h2>
        <p className="text-gray-600 mb-6">
          You can either call our admin directly or join our WhatsApp community.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={whatsappAdmin}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition"
          >
            <FaPhoneAlt /> Call Admin
          </button>

          <button
            onClick={joinGroup}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition"
          >
            <FaWhatsapp /> Join WhatsApp Group
          </button>
        </div>
      </div>
    </div>
  );
}



// import React, { useState } from 'react';
// import { FaWhatsapp, FaPhoneAlt, FaComments, FaVideo } from 'react-icons/fa';
// import Chat from '../component/Chat';

// const SUPPORT_PHONE = '+2348140806540'; // Change to your support number
// const WHATSAPP_NUMBER = '+2349070565906'; // Must include country code
// const JITSI_ROOM = 'CustomerSupportRoom123'; // Unique room name

// export default function CustomerRelate() {
//   const [showChat, setShowChat] = useState(false);
//   const [showVideo, setShowVideo] = useState(false);

//   const openWhatsApp = () => {
//     const url = `https://wa.me/${WHATSAPP_NUMBER}`;
//     window.open(url, '_blank');
//   };

//   const callSupport = () => {
//     window.location.href = `tel:${SUPPORT_PHONE}`;
//   };

//   const toggleChat = () => {
//     setShowChat(!showChat);
//   };

//   const toggleVideo = () => {
//     setShowVideo(!showVideo);
//   };

//   return (
//     <div className='flex flex-row items-center justify-center h-screen'>
//     <div className=" space-y-3 p-4 bg-white shadow-lg rounded-2xl w-80 border z-50">
//       <h2 className="text-xl font-bold text-gray-800">Need Help?</h2>

//       <div className="flex flex-col gap-3">
//         <button onClick={toggleChat} className="flex items-center gap-2 p-2 bg-blue-100 hover:bg-blue-200 rounded-xl">
//           <FaComments /> <span>Live Chat</span>
//         </button>

//         <button onClick={callSupport} className="flex items-center gap-2 p-2 bg-green-100 hover:bg-green-200 rounded-xl">
//           <FaPhoneAlt /> <span>Call Us</span>
//         </button>

//         <button onClick={openWhatsApp} className="flex items-center gap-2 p-2 bg-emerald-100 hover:bg-emerald-200 rounded-xl">
//           <FaWhatsapp /> <span>WhatsApp</span>
//         </button>

//         <button onClick={toggleVideo} className="flex items-center gap-2 p-2 bg-purple-100 hover:bg-purple-200 rounded-xl">
//           <FaVideo /> <span>Video Call</span>
//         </button>
//       </div>

//       {showChat && (
//         <div className="mt-3 border p-2 rounded bg-gray-50 text-sm">
//           <p>Live chat not implemented — integrate with services like Intercom, Twilio, or Firebase.</p>
//         </div>
//       )}

//       {showVideo && (
//         <div className="mt-3">
//           <iframe
//             title="Video Call"
//             src={`https://meet.jit.si/${JITSI_ROOM}`}
//             allow="camera; microphone; fullscreen; display-capture"
//             style={{ width: '100%', height: '400px', borderRadius: '12px' }}
//           />
//         </div>
//       )}
      
//     </div>
//      <Chat /> 
      
//       </div>
//   );
// }
