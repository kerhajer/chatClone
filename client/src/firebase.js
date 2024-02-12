import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {   
    apiKey: "AIzaSyCky8cNgMgSGUc8pseJpNsO3b5zTmcOvFo",
    authDomain: "clone-26ca2.firebaseapp.com",
    projectId: "clone-26ca2",
    storageBucket: "clone-26ca2.appspot.com",
    messagingSenderId: "878996871593",
    appId: "1:878996871593:web:4309da2c1511b0385c8cb8",
    measurementId: "G-1W59XR9QG9"
};
 export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export { auth };

