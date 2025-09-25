
  // Project Name: Wearable Sensor ALS Assess
  // Team Members: Priya Gokhale, Emme Cai, Haley Deng, Bernice Zhao
  // Date Due: May 31st
  // File Name: register.js
  // Task Description: individual js file that is in charge of registration of a new user

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";

import { getDatabase, ref, set, update, child, get } 
from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvS-xmqI6LqWGpzY5oBNa5h0D2uh6tiuI",
  authDomain: "wearablesensor-8f6fb.firebaseapp.com",
  projectId: "wearablesensor-8f6fb",
  storageBucket: "wearablesensor-8f6fb.appspot.com",
  databaseURL: "https://wearablesensor-8f6fb-default-rtdb.firebaseio.com",
  messagingSenderId: "685131725700",
  appId: "1:685131725700:web:2bd19d7ed3540a778b7bd1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth();

// Return an instance of your app's FRD (firebase realtime database)
const db = getDatabase(app);

// ---------------- Register New Uswer --------------------------------//
document.getElementById('submitData').onclick = function() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('userEmail').value;

  // Firebase will require a password of at least 6 characters
  const password = document.getElementById('userPass').value;

  // Validate user inputs
  if (!validation(firstName, lastName, email, password)) {
    return;
  };

  // Create new app user
  createUserWithEmailAndPassword(auth, email, password)
  .then(async (userCredential) => {
    // Signed in 
    const user = userCredential.user;
    
    // Add user account info to realtime database
    // 'Set' will create a new reference or completely replace an existing one
    // each new user will be placed under the 'users' node
    await set(ref(db, 'users/' + user.uid + '/accountInfo'), {
      uid: user.uid,    // save userID for home.js reference 
      email: email,
      password: encryptPass(password),
      firstname: firstName, 
      lastname: lastName
    })
    .then(() => {
      //Data saved successfully
      alert('User created successfully!')
      document.querySelector(".register-popup").classList.remove("active");
      document.querySelector(".signIn-popup").classList.add("active");
      document.querySelector("#signin-modal-home").classList.add("active");
      document.querySelector("#register-modal-home").classList.remove("active");
    })
    .catch((error)=> {
      alert(error)
    });


    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });

}



// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str){
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//
function validation(firstName, lastName, email, password) {
  let fNameRegex = /^[a-zA-Z]+$/;
  let lNameRegex = /^[a-zA-Z]+$/;
  let emailRegex = /^[a-zA-Z0-9]+@ctemc\.org$/;

  if(isEmptyorSpaces(firstName) || isEmptyorSpaces(lastName) || isEmptyorSpaces(email) || isEmptyorSpaces(password)) {
    alert("Please complete all fields.");
    return false;
  }

  if(!fNameRegex.test(firstName)) {
    alert("The first name should only contain letters.");
    return false;
  }

  if(!lNameRegex.test(lastName)) {
    alert("The last name should only contain letters.");
    return false;
  }

  if(!emailRegex.test(email)) {
    alert("Please enter a valid email.");
    return false;
  }

  return true;
}

// --------------- Password Encryption -------------------------------------//
function encryptPass(password) {
  let encrypted = CryptoJS.AES.encrypt(password, password)
  return encrypted.toString();
}

function decryptPass(password) {
  let decrypted = CryptoJS.AES.decrypt(password, password)
  return decrypted.toString();
}


// --------------- Popup functionality for register -------------------------------------//

document.querySelector("#show-register").addEventListener("click", function() {
  document.querySelector(".register-popup").classList.add("active");
  document.querySelector(".signIn-popup").classList.remove("active");
  document.querySelector("#signin-modal-home").classList.remove("active");
  document.querySelector("#register-modal-home").classList.add("active");
});
document.querySelector(".register-popup .register-close-btn").addEventListener("click",function() {
  document.querySelector(".register-popup").classList.remove("active");
  document.querySelector("#register-modal-home").classList.remove("active");
});

document.querySelector("#reveal-login").addEventListener("click", function() {
  document.querySelector(".register-popup").classList.remove("active");
  document.querySelector(".signIn-popup").classList.add("active");
  document.querySelector("#signin-modal-home").classList.add("active");
  document.querySelector("#register-modal-home").classList.remove("active");
});