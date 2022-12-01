import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBt3Uy8X41IVBw3_KJxYIwNaNadCmixswg",
    authDomain: "titan-dfac7.firebaseapp.com",
    databaseURL: "https://titan-dfac7.firebaseio.com",
    projectId: "titan-dfac7",
    storageBucket: "titan-dfac7.appspot.com",
    messagingSenderId: "960271134865",
    appId: "1:960271134865:web:5ea899b18b2884d62a8f30",
};

initializeApp(firebaseConfig)
const db = getFirestore();
const auth = getAuth();

// firebase collections
// const $turnos = db.collection("titan_turnos");
// const $ph_usuarios = db.collection("usuarios");
// const $ph_asambleas = db.collection("asambleas");
// const $ph_preguntas = db.collection("preguntas");
// const $ph_respuestas = db.collection("respuestas");

// export {
//     firebaseObj,
//     db,
//     $turnos,
//     $ph_usuarios,
//     $ph_asambleas,
//     $ph_preguntas,
//     $ph_respuestas,
// };

export {
    db,
    auth
}