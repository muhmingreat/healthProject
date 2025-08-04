import { useState, useRef, useEffect } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import NETS from 'vanta/src/vanta.net';
import * as THREE from 'three';
import useRegisterDoctor from '../hooks/useRegisterDoctor';
import { uploadToIPFS } from '../utlis';

const RegisterDoctor = () => {
  const vantaRef = useRef(null);
  const fileInputRef = useRef(null);

  const [vantaEffect, setVantaEffect] = useState(null);
  const [previewURL, setPreviewURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    name: '',
    specialisation: '',
    license: '',
    biography: '',
    avatar: null,
  });

  const { name, specialisation, license, biography, avatar } = fields;

  const handleRegisterDoctor = useRegisterDoctor();

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

  const handleChange = (e, key) =>
    setFields((p) => ({ ...p, [key]: e.target.value }));

  const handleAvatar = (file) => {
    setFields((p) => ({ ...p, avatar: file }));
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleClickUpload = () => fileInputRef.current?.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (biography.length > 200) {
      alert('Biography should be not greater than 200 characters');
      return;
    }
    setLoading(true);
    try {
      const ipfsUrl = avatar ? await uploadToIPFS(avatar) : '';
      await handleRegisterDoctor(name, specialisation, license, ipfsUrl, biography);
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
        className="w-full max-w-2xl mx-auto px-6 py-10 mt-7 rounded-3xl shadow-xl relative top-7  bg-white grid gap-6 grid-cols-1 sm:grid-cols-2"
      >
        <h1 className="text-xl font-bold text-center text-gray-800 mb-3 sm:col-span-2">
          Register Doctor
        </h1>

        {/* Avatar Upload */}
       

        {/* Name */}
        <input
          type="text"
          value={name}
          placeholder="Full Name"
          onChange={(e) => handleChange(e, 'name')}
          className="w-full rounded-md p-3 border border-gray-500 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        {/* Specialisation */}
        <input
          type="text"
          value={specialisation}
          placeholder="Area of Specialisation"
          onChange={(e) => handleChange(e, 'specialisation')}
          className="w-full rounded-md p-3 border border-gray-500 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2"
          required
        />

        {/* License */}
       

        {/* Biography */}
      
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
  {/* Biography Textarea */}
  <textarea
    value={biography}
    placeholder="Biography (max 200 chars)"
    onChange={(e) => handleChange(e, 'biography')}
    className="col-span-1 h-32 rounded-2xl p-4 border border-gray-500 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none shadow-sm"
    maxLength={200}
    required
  />

  {/* Avatar Upload */}
  <div className="col-span-1 flex flex-col items-center  justify-center border-gray-500 gap-2">
    {/* Hidden File Input */}
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      onChange={(e) => handleAvatar(e.target.files[0])}
      className="hidden"
      required
    />

    {/* Upload Button */}
    <div
      onClick={handleClickUpload}
      className="w-26 h-26 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer relative overflow-hidden hover:ring-2 hover:ring-indigo-300 transition"
    >
      {avatar ? (
        <img
          src={previewURL}
          alt="Avatar Preview"
          className="w-full h-full object-cover border-gray-500 rounded-full"
        />
      ) : (
        <span className="relative flex w-16 h-16">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-75"></span>
          <Camera className="w-12 h-12 relative text-indigo-600" />
        </span>
      )}
    </div>

  </div>
</div>

       <select
          value={license}
          onChange={(e) => handleChange(e, 'license')}
          className=" w-fulllg:col-span-2 sm:col-span-2 rounded-md p-3 border border-gray-500 text-gray-800
           focus:outline-none focus:ring-2"
          required
        >
          <option value="" disabled>
            Select license type
          </option>
          {[
            'Medical',
            'Surgical',
            'Ophthalmologist',
            'Pediatrician',
            'Endocrinologist',
            'Orthopedic Surgeon/Orthopedist',
            'Pulmonologist',
            'Neurologist',
            'Cardiologist',
            'Other',
          ].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {/* Submit Button */}
    
        <div className="sm:col-span-2 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 rounded-lg bg-green-600 hover:bg-green-800 text-white font-semibold transition disabled:opacity-50"
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
// import { uploadToIPFS } from '../utlis';

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
//   <form
//   onSubmit={handleSubmit}
//   className="w-full max-w-2xl mx-auto px-4 py-10 mt-16 rounded-3xl shadow-xl bg-white 
//              grid gap-6 grid-cols-1 sm:grid-cols-2"
// >
//   <h1 className="text-2xl font-bold text-center text-gray-800 mb-4 sm:col-span-2">
//     Register Doctor
//   </h1>

//   {/* Name */}
//   <input
//     type="text"
//     value={name}
//     placeholder="Name"
//     onChange={(e) => handleChange(e, 'name')}
//     className="w-full rounded-md p-3 border border-gray-300 text-gray-800 placeholder-gray-500
//                focus:outline-none focus:ring-2 focus:ring-orange-400"
//     required
//   />

//   {/* Specialisation */}
//   <input
//     type="text"
//     value={specialisation}
//     placeholder="Area of Specialisation"
//     onChange={(e) => handleChange(e, 'specialisation')}
//     className="w-full rounded-md p-3 border border-gray-300 text-gray-800 placeholder-gray-500
//                focus:outline-none focus:ring-2 "
//     required
//   />

//   {/* License */}
  

//   {/* Avatar */}
//   <div className="flex flex-col gap-2">
//     <label className="text-gray-700">Avatar:</label>
//     <input
//       type="file"
//       accept="image/*, .pdf"
//       onChange={(e) => handleAvatar(e.target.files[0])}
//       className="text-sm text-gray-700"
//       required
//     />
//     {previewURL && (
//       <img
//         src={previewURL}
//         alt="Preview"
//         className="h-12 w-12 rounded-full object-cover"
//       />
//     )}
//   </div>

//   {/* Biography */}
//   <textarea
//     value={biography}
//     placeholder="Biography (max 200 chars)"
//     onChange={(e) => handleChange(e, 'biography')}
//     className="sm:col-span-1 h-28 rounded-md p-3 resize-none border border-gray-300 text-gray-800
//                placeholder-gray-500 focus:outline-none focus:ring-2 "
//     maxLength={200}
//     required
//   />
// <select
//     value={license}
//     onChange={(e) => handleChange(e, 'license')}
//     className="w-full col-span-2 rounded-md p-3 border border-gray-300 text-gray-800
//                focus:outline-none focus:ring-2 "
//     required
//   >
//     <option value="" disabled>Select license type</option>
//     {[
//       'Medical', 'Surgical', 'Ophthalmologist', 'Pediatrician', 'Endocrinologist',
//       'Orthopedic Surgeon/Orthopedist', 'Pulmonologist', 'Neurologist', 'Cardiologist', 'Other'
//     ].map((opt) => (
//       <option key={opt} value={opt}>{opt}</option>
//     ))}
//   </select>
//   {/* Submit Button */}
//   <div className="sm:col-span-2 flex justify-center">
//     <button
//       type="submit"
//       disabled={loading}
//       className="col-span-1 py-3 px-6 rounded-lg bg-green-500 hover:bg-green-900 text-white
//                  font-semibold transition disabled:opacity-50"
//     >
//       {loading ? (
//         <span className="flex justify-center items-center gap-2">
//           <Loader2 className="animate-spin h-5 w-5" />
//           Processing…
//         </span>
//       ) : (
//         'Register Doctor'
//       )}
//     </button>
//   </div>
// </form>



//     </div>
//   );
// };


// export default RegisterDoctor;









