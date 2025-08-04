import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import NETS from 'vanta/src/vanta.net';
import * as THREE from 'three';
import axios from 'axios';
import useRegisterDoctor from '../hooks/useRegisterDoctor';
import { uploadToIPFS } from '../utlis';

const RegisterDoctor = () => {

  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        NETS({
          el: vantaRef.current,
          THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          color: 0xffffff,
          backgroundColor: 0x000000,
        })
      );
    }
    return () => vantaEffect && vantaEffect.destroy();
  }, [vantaEffect]);

  
  const [fields, setFields] = useState({
    name: '',
    specialisation: '',
    license: '',
    biography: '',
    avatar: null,
  });
  const [previewURL, setPreviewURL] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, specialisation, license, biography, avatar } = fields;
  const handleChange = (e, key) =>
    setFields((p) => ({ ...p, [key]: e.target.value }));
  const handleAvatar = (file) => {
    setFields((p) => ({ ...p, avatar: file }));
    setPreviewURL(URL.createObjectURL(file));
  };

  
  // const uploadToIPFS = async (file) => {
  //   const form = new FormData();
  //   form.append('file', file);
  //   const res = await axios.post(
  //     'https://api.pinata.cloud/pinning/pinFileToIPFS',
  //     form,
  //     {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
  //         pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
  //       },
  //     }
  //   );
  //   return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  // };

  const handleRegisterDoctor = useRegisterDoctor();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (biography.length > 200) {
      alert('Biography should be not greter than 200 characters');
      return;
    }
    setLoading(true);
    try {
      const ipfsUrl = avatar ? await uploadToIPFS(avatar) : '';

      await handleRegisterDoctor(name, specialisation, license,ipfsUrl,  biography, );
      setFields({ name: '', specialisation: '', license: '', biography: '', avatar: null });
      setPreviewURL('');
    } catch (err) {
      console.error('Doctor registration error', err);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div ref={vantaRef} className="w-full min-h-screen flex items-center justify-center">
  <form
  onSubmit={handleSubmit}
  className="w-full max-w-2xl mx-auto px-4 py-10 mt-16 rounded-3xl shadow-xl bg-white 
             grid gap-6 grid-cols-1 sm:grid-cols-2"
>
  <h1 className="text-2xl font-bold text-center text-gray-800 mb-4 sm:col-span-2">
    Register Doctor
  </h1>

  {/* Name */}
  <input
    type="text"
    value={name}
    placeholder="Name"
    onChange={(e) => handleChange(e, 'name')}
    className="w-full rounded-md p-3 border border-gray-300 text-gray-800 placeholder-gray-500
               focus:outline-none focus:ring-2 focus:ring-orange-400"
    required
  />

  {/* Specialisation */}
  <input
    type="text"
    value={specialisation}
    placeholder="Area of Specialisation"
    onChange={(e) => handleChange(e, 'specialisation')}
    className="w-full rounded-md p-3 border border-gray-300 text-gray-800 placeholder-gray-500
               focus:outline-none focus:ring-2 "
    required
  />

  {/* License */}
  

  {/* Avatar */}
  <div className="flex flex-col gap-2">
    <label className="text-gray-700">Avatar:</label>
    <input
      type="file"
      accept="image/*, .pdf"
      onChange={(e) => handleAvatar(e.target.files[0])}
      className="text-sm text-gray-700"
      required
    />
    {previewURL && (
      <img
        src={previewURL}
        alt="Preview"
        className="h-12 w-12 rounded-full object-cover"
      />
    )}
  </div>

  {/* Biography */}
  <textarea
    value={biography}
    placeholder="Biography (max 200 chars)"
    onChange={(e) => handleChange(e, 'biography')}
    className="sm:col-span-1 h-28 rounded-md p-3 resize-none border border-gray-300 text-gray-800
               placeholder-gray-500 focus:outline-none focus:ring-2 "
    maxLength={200}
    required
  />
<select
    value={license}
    onChange={(e) => handleChange(e, 'license')}
    className="w-full rounded-md p-3 border border-gray-300 text-gray-800
               focus:outline-none focus:ring-2 "
    required
  >
    <option value="" disabled>Select license type</option>
    {[
      'Medical', 'Surgical', 'Ophthalmologist', 'Pediatrician', 'Endocrinologist',
      'Orthopedic Surgeon/Orthopedist', 'Pulmonologist', 'Neurologist', 'Cardiologist', 'Other'
    ].map((opt) => (
      <option key={opt} value={opt}>{opt}</option>
    ))}
  </select>
  {/* Submit Button */}
  <div className="sm:col-span-2 flex justify-center">
    <button
      type="submit"
      disabled={loading}
      className="col-span-1 py-3 px-6 rounded-lg bg-green-500 hover:bg-green-900 text-white
                 font-semibold transition disabled:opacity-50"
    >
      {loading ? (
        <span className="flex justify-center items-center gap-2">
          <Loader2 className="animate-spin h-5 w-5" />
          Processing…
        </span>
      ) : (
        'Register Doctor'
      )}
    </button>
  </div>
</form>



    </div>
  );
};


export default RegisterDoctor;










// import { useState, useRef, useEffect } from 'react';
// import { Loader2 } from 'lucide-react';
// import NETS from 'vanta/src/vanta.net';
// import * as THREE from 'three';
// import axios from 'axios';
// import useRegisterDoctor from '../hooks/useRegisterDoctor';
// import { Link } from 'react-router-dom';

// const RegisterDoctor = () => {

//   const vantaRef = useRef(null);
//   const [vantaEffect, setVantaEffect] = useState(null);
//   useEffect(() => {
//     if (!vantaEffect) {
//       setVantaEffect(
//         NETS({
//           el: vantaRef.current,
//           THREE,
//           mouseControls: true,
//           touchControls: true,
//           gyroControls: false,
//           color: 0xffffff,
//           backgroundColor: 0x000000,
//         })
//       );
//     }
//     return () => vantaEffect && vantaEffect.destroy();
//   }, [vantaEffect]);

  
//   const [fields, setFields] = useState({
//     name: '',
//     specialisation: '',
//     license: '',
//     biography: '',
//     avatar: null,
//   });
//   const [previewURL, setPreviewURL] = useState('');
//   const [loading, setLoading] = useState(false);

//   const { name, specialisation, license, biography, avatar } = fields;
//   const handleChange = (e, key) =>
//     setFields((p) => ({ ...p, [key]: e.target.value }));
//   const handleAvatar = (file) => {
//     setFields((p) => ({ ...p, avatar: file }));
//     setPreviewURL(URL.createObjectURL(file));
//   };

  
//   const uploadToIPFS = async (file) => {
//     const form = new FormData();
//     form.append('file', file);
//     const res = await axios.post(
//       'https://api.pinata.cloud/pinning/pinFileToIPFS',
//       form,
//       {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
//           pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
//         },
//       }
//     );
//     return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
//   };

//   const handleRegisterDoctor = useRegisterDoctor();

  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (biography.length > 200) {
//       alert('Biography should be not greter than 200 characters');
//       return;
//     }
//     setLoading(true);
//     try {
//       const ipfsUrl = avatar ? await uploadToIPFS(avatar) : '';

//       await handleRegisterDoctor(name, specialisation, license,ipfsUrl,  biography, );
//       setFields({ name: '', specialisation: '', license: '', biography: '', avatar: null });
//       setPreviewURL('');
//     } catch (err) {
//       console.error('Doctor registration error', err);
//     } finally {
//       setLoading(false);
//     }
//   };

  
//   return (
//     <div ref={vantaRef} className="w-full min-h-screen flex items-center justify-center">
//       <form
//         onSubmit={handleSubmit}
//         className=" w-full max-w-md mx-4 p-8 rounded-3xl shadow-xl  relative top-20
//                    bg-gradient-to-tr from-orange-600 via-blue-900 to-black bg-[length:200%_200%] 
//                    animate-[gradient_10s_ease_infinite]"
//       >
//         <h1 className="text-3xl font-bold text-center mb-8 text-white drop-shadow">Register Doctor</h1>

//         {/* Name */}
//         <input
//           type="text"
//           value={name}
//           placeholder="Name"
//           onChange={(e) => handleChange(e, 'name')}
//           className="mb-4 w-full rounded-md p-3 bg-gradient-to-r from-black to-orange-700
//                      text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
//           required
//         />

//         {/* Specialisation */}
//         <input
//           type="text"
//           value={specialisation}
//           placeholder="Area of specialisation"
//           onChange={(e) => handleChange(e, 'specialisation')}
//           className="mb-4 w-full rounded-md p-3 bg-gradient-to-r from-black to-orange-700
//                      text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
//           required
//         />

//         {/* License select */}
//         <select
//           value={license}
//           onChange={(e) => handleChange(e, 'license')}
//           className="mb-4 w-full rounded-md p-3 bg-gradient-to-r from-black to-orange-700
//                      text-white bg-black focus:outline-none focus:ring-2 focus:ring-orange-400"
//           required
//         >
//           <option value="" disabled>Select license type</option>
//           {[
//             'Medical','Surgical','Ophthalmologist','Pediatrician','Endocrinologist',
//             'Orthopedic Surgeon/Orthopedist','Pulmonologist','Neurologist','Cardiologist','Other'
//           ].map((opt) => (
//             <option key={opt} value={opt}>{opt}</option>
//           ))}
//         </select>

      
//         <textarea
//           value={biography}
//           placeholder="Biography (max 200 chars)"
//           onChange={(e) => handleChange(e, 'biography')}
//           className="mb-4 w-full h-28 rounded-md p-3 resize-none bg-gradient-to-r from-black to-orange-700
//                      text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
//           maxLength={200}
//           required
//         />

    
//         <div className="mb-6 flex items-center gap-4">
//           <label className="text-white">Avatar:</label>
//           <input
//             type="file"
//             accept="image/* pdf"
//             onChange={(e) => handleAvatar(e.target.files[0])}
//             className="text-sm text-white"
            
//             required
//           />
//           {previewURL && (
//             <img src={previewURL} alt="Preview" className="h-12 w-12 rounded-full object-cover" />
//           )}
//         </div>

        
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full py-3 rounded-lg bg-black/70 hover:bg-black/90 text-orange-400
//                      font-semibold transition disabled:opacity-50"
//         >
//           {loading ? (
//             <span className="flex justify-center items-center gap-2">
//               <Loader2 className="animate-spin h-5 w-5" />
//               Processing…
//             </span>
//           ) : (
//             'Register Doctor'
//           )}
//         </button>
//         <Link to='/' className='test-white text-center block mt-4 hover:underline'>
//         Back Home</Link>
//       </form>
//     </div>
//   );
// };


// export default RegisterDoctor;







