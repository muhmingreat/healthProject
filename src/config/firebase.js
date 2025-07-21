// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6Qs3LwtLoNNUNa6EZoTiiztcDrwn01pw",
  authDomain: "mern-estate1-e63f0.firebaseapp.com",
  projectId: "mern-estate1-e63f0",
  storageBucket: "mern-estate1-e63f0.appspot.com",
  messagingSenderId: "634184868981",
  appId: "1:634184868981:web:cee914710bb0ee7f4a843c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
