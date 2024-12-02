import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc, getDocs , deleteDoc , doc , updateDoc,getDoc,serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDX-c_1Ej0vA3N55Mon1qSxcR604DkEnPc",
    authDomain: "fir-project1-2068e.firebaseapp.com",
    projectId: "fir-project1-2068e",
    storageBucket: "fir-project1-2068e.firebasestorage.app",
    messagingSenderId: "123685578462",
    appId: "1:123685578462:web:bd6016666675c70e1e444f",
    measurementId: "G-6Z4CKCP4QQ"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc , getDocs , deleteDoc ,doc , updateDoc,getDoc,serverTimestamp};
