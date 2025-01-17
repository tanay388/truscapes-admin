// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTa2Qt-DwbuWaww7kUB10iaB9wD-TfS_w",
  authDomain: "tru-scapes-1858e.firebaseapp.com",
  projectId: "tru-scapes-1858e",
  storageBucket: "tru-scapes-1858e.appspot.com",
  messagingSenderId: "1091380969651",
  appId: "1:1091380969651:web:d15fecb064a2abea8c30c6",
  measurementId: "G-HQFZ4WMVHJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth, analytics };
