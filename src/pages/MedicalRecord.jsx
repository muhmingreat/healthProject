import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import NETS from 'vanta/src/vanta.net';
import useMedicalRecord from '../hooks/useMedicalRecord';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import { Camera, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useHealthcare } from '../context/HealthCareContext';
import { toast } from 'react-toastify';
import useContractInstance from '../hooks/useContractInstance';
import { useAppKitAccount } from '@reown/appkit/react';
import { uploadToIPFS } from '../utlis';

const MedicalRecord = () => {
  const vantaRef = useRef(null);
  const [vantaEffect, setVantaEffect] = useState(null);
  const handleMedicalRecord = useMedicalRecord();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [patientName, setPatientName] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [loading, setLoading] = useState(false);

  const { address } = useAppKitAccount();
  
  
const contract = useContractInstance();
  

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
          color: 0xffffff,
          backgroundColor: 0x000000,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedFile]);

  const handleUploadToIPFS = async () => {
  if (!selectedFile) return;

  try {
    const compressed = await imageCompression(selectedFile, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    });

    const url = await uploadToIPFS(compressed);
    if (url) {
      setIpfsUrl(url);
    } else {
      toast.error('Failed to upload file to IPFS');
    }
  } catch (err) {
    console.error('IPFS upload error:', err);
    toast.error('Failed to compress or upload file');
  }
};


  useEffect(() => {
    if (selectedFile) {
      handleUploadToIPFS();
    }
  }, [selectedFile]);

  // const handl
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!ipfsUrl || !patientName || !diagnosis) return;
  setLoading(true);

  try {
    
    await handleMedicalRecord(ipfsUrl, patientName, diagnosis);
    
    setIpfsUrl('');
    setPatientName('');
    setDiagnosis('');
    setSelectedFile(null);
  
  } catch (err) {
    console.error(" Error during medical record submission:", err);
  
  } finally {
    setLoading(false);
  }
};


  return (
    <div ref={vantaRef} className="w-full min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl w-[480px] bg-white md:w-[480px] md:max-w-2xl sm:w-[150px] rounded-xl shadow-lg p-8 mt-24"
      >
        <h1 className="text-2xl font-bold text-center">Medical Record</h1>

        
<div className="flex justify-center my-4">
  <input
    type="file"
    accept="image/*,application/pdf"
    hidden
    id="file-input"
    onChange={(e) => setSelectedFile(e.target.files[0])}
  />
  <label
    htmlFor="file-input"
    className="rounded-full w-32 h-32 bg-gray-100 flex items-center 
    justify-center cursor-pointer relative overflow-hidden"
  >
    {selectedFile ? (
      selectedFile.type.startsWith('image/') ? (
        <img
          src={previewUrl}
          alt="Selected File"
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <span className="text-xs text-center text-gray-600 px-2">
          PDF Selected
        </span>
      )
    ) : (
      <span className="relative flex w-16 h-16">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-75"></span>
        <Camera className="w-16 h-16 relative inline-flex rounded-full text-blue-600" />
      </span>
    )}
  </label>
</div>

 <div>
          <label className="block text-sm font-medium text-gray-700">Patient Name</label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="John Doe"
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g. Malaria"
            className="mt-1 w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

       

        <button
          type="submit"
          disabled={ loading}
          className="w-full bg-green-600 text-white p-2 rounded-md mt-4 hover:bg-green-800 transition"
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2 bg-green-300">
              <Loader2 className="animate-spin h-4 w-4" />
              Adding...
            </span>
          ) : (
            'Add Record'
          )}
        </button>
      </form>
    </div>
  );
};

export default MedicalRecord;



