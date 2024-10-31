import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_ISQMT3kJ2ZnjMqq2tJl1CoMO9bSns24",
  authDomain: "todoapp-5c99e.firebaseapp.com",
  projectId: "todoapp-5c99e",
  storageBucket: "todoapp-5c99e.appspot.com",
  messagingSenderId: "77706127238",
  appId: "1:77706127238:web:9c78e33dc81c9f5a45ae07",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const db = getFirestore(app);

export default app;
