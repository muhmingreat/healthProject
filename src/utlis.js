import axios from 'axios'  
  
  export const uploadToIPFS = async (file) => {
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