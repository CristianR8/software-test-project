import { getAuth  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes} from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBvjzCNnPz8xCISplV_gpNZauQwzTHJ5D0",
  authDomain: "agrocontrol-a09a5.firebaseapp.com",
  projectId: "agrocontrol-a09a5",
  storageBucket: "agrocontrol-a09a5.appspot.com",
  messagingSenderId: "377743417541",
  appId: "1:377743417541:web:8957f59dd2ef629ee450ac",
  measurementId: "G-GT9GDV669C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

