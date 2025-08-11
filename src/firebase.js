import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC2G0hYdF20WoX9nqNKax8NSuKhM3th0I8",
    authDomain: "vue-project01-c12a3.firebaseapp.com",
    projectId: "vue-project01-c12a3",
    storageBucket: "vue-project01-c12a3.firebasestorage.app",
    messagingSenderId: "700582114311",
    appId: "1:700582114311:web:6b45e920ff5b8af9b0e6a2",
    measurementId: "G-2DRHPQY390"
};

const fireApp = initializeApp(firebaseConfig);
const db = getFirestore(fireApp);

export { db, serverTimestamp };