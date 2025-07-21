import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import NETS from 'vanta/src/vanta.net';
import { Loader2 } from 'lucide-react';
import useRegisterPatient from '../hooks/useRegisterPatient';
import { useNavigate } from 'react-router-dom';
import { useAppKitAccount } from '@reown/appkit/react';
import useContractInstance from '../hooks/useContractInstance';
import axios from 'axios';

const RegisterPatient = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleRegisterPatient = useRegisterPatient();
  const contract = useContractInstance();
  const { address } = useAppKitAccount();

  (() => {
  const _setValues = THREE.Material.prototype.setValues;
  THREE.Material.prototype.setValues = function (values) {
    if (values && values.vertexColors === undefined) delete values.vertexColors;
    _setValues.call(this, values);
  };
})();
  // Vanta Background Setup
  // console.log("✅ Listener bound to contract:", contract?.address);

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
          color: 0x00cc99,
          backgroundColor: 0x000000,
          vertexColors: false,
        })
      );
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  // Preview logic
  useEffect(() => {
    if (!avatar) return;
    const objectUrl = URL.createObjectURL(avatar);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [avatar]);

  const uploadToIPFS = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
        },
      });
      return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
    } catch (err) {
      console.error('IPFS upload error:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !age || !gender || !avatar) return;

    setLoading(true);
    try {
      const ipfsUrl = await uploadToIPFS(avatar);
      const result = await handleRegisterPatient(name, age, gender, ipfsUrl);
      if (result) {
        setName('');
        setAge('');
        setGender('');
        setAvatar(null);
        setPreviewUrl('');
        navigate('/booking');
      }
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={vantaRef} className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-90 p-8 rounded-xl shadow-xl w-full relative top-10 max-w-md mx-4"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Register Patient</h1>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Your Age"
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white"
              required
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Avatar (Image)</label>
            <div className="mt-2 flex items-center gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="text-sm"
                required
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-12 w-12 rounded-full object-cover border"
                />
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              Loading...
            </span>
          ) : (
            'Register Patient'
          )}
        </button>
      </form>
    </div>
  );
};

export default RegisterPatient;
