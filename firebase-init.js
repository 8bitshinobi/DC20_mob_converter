import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  // your existing config values
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

window.db = db;
window.auth = auth;
window.firebaseSignIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
window.firebaseSignOut = () => signOut(auth);
window.firebaseOnAuthStateChanged = (callback) => onAuthStateChanged(auth, callback);

console.log("Firebase connected successfully");