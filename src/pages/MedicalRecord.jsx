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

      const formData = new FormData();
      formData.append('file', compressed);

      const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key:        import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
        },
      });

      setIpfsUrl(`https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`);
    } catch (err) {
      console.error('IPFS upload error:', err);
      toast.error("Failed to upload to IPFS");
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

        <div className="flex justify-center">
  <input
    type="file"
    accept="image/*,application/pdf"
    hidden
    id="file-input"
    onChange={(e) => setSelectedFile(e.target.files[0])}
  />
  <label htmlFor="file-input" className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
    {selectedFile ? "File Selected" : "Upload Your PDF or Image"}
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

        {ipfsUrl && (
          <div>
            <label className="block text-sm font-medium text-gray-700">IPFS URL</label>
            <input
              type="text"
              value={ipfsUrl}
              readOnly
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={!ipfsUrl || loading}
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <Loader2 className="animate-spin h-4 w-4" />
              Submitting...
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



