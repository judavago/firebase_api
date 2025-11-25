import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
apiKey: "AIzaSyDZlyUENeMrgDL9djUzdTqlI34BmhjrIx8",
  authDomain: "fir-api-942fa.firebaseapp.com",
  projectId: "fir-api-942fa",
  storageBucket: "fir-api-942fa.firebasestorage.app",
  messagingSenderId: "730615718668",
  appId: "1:730615718668:web:71c29ada57c9cf9740df29",
  measurementId: "G-3FW2TC1XS7"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };