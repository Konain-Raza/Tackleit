import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3XomH1ROundT1Buqa2TPafZL0JeM_v1g",
  authDomain: "tackleit-72a7d.firebaseapp.com",
  projectId: "tackleit-72a7d",
  storageBucket: "tackleit-72a7d.appspot.com",
  messagingSenderId: "127789479004",
  appId: "1:127789479004:web:1ef37e2caaf069a0b66299",
  measurementId: "G-BVPL9ZFEXC",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };
