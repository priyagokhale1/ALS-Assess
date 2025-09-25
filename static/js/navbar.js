
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



// ----------------------- Get User's Name'Name ------------------------------
function getUsername(){
  //Grab the value for the 'keep logged in' switch
  let keepLoggedIn = localStorage.getItem('keepLoggedIn');
  
  //Grab user info passed in from signIn.js
  if(keepLoggedIn == 'yes'){
    currentUser = JSON.parse(localStorage.getItem('user'));
  }else{
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }

  return currentUser;
}

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD

function signOutUser(){
  sessionStorage.removeItem('user');    //Clear the session storage
  localStorage.removeItem('user');      //Clear local storage
  localStorage.removeItem('keepLoggedIn');
  window.location="/"; // Browser redirect to the home page via /home route in app.py
  signOutLink(auth).then(() => {
      //Sign out successful
  }).catch((error)=>{
      //Error occurred
  })

}

export {getUsername};

// ----------------------- Get reference values -----------------------------
let signInOutLink = document.getElementById('signInOut');       //Sign out Link
let dashboard = document.getElementById('dashboard');                 //Take the quiz link
let currentUser = null;                                     //Initialize currentUser to null

// --------------------------- Page Loading -----------------------------
window.addEventListener('load', () => {
  // ------------------------- Set Welcome Message -------------------------
  currentUser = getUsername();
  //console.log(currentUser);
  if(currentUser == null){
    signInOutLink.innerText = 'LOGIN';

    dashboard.innerText = '';
    dashboard.href = '';
    dashboard.classList.add("px-0");
    // upcoming code controls all the modals for sign in and register
    document.querySelector(".show-login").addEventListener("click", function() {
      document.querySelector(".signIn-popup").classList.add("active");
      document.querySelector("#signin-modal-home").classList.add("active");
  });
  
  document.querySelector(".signIn-popup .signIn-close-btn").addEventListener("click",function() {
      document.querySelector(".signIn-popup").classList.remove("active");
      document.querySelector("#signin-modal-home").classList.remove("active");
  });

  } else {
    signInOutLink.innerText = 'SIGN OUT';
    document.querySelector(".remove-for-sign-out").classList.remove("active");
      document.getElementById('signInOut').onclick = function(){
        signOutUser();
      }
      signInOutLink.href = '/';
// when signed in, the navbar shows dashboard as a page to navigate to
    dashboard.innerText = 'DASHBOARD';
    dashboard.href = 'dashboard';
    dashboard.classList.remove("px-0");


    
  }


document.getElementById('dashboard-button').onclick = function() {
  currentUser = getUsername();
  console.log(currentUser)
  //console.log(currentUser);
  if(currentUser == null){
    document.querySelector(".signIn-popup").classList.add("active");
    document.querySelector("#signin-modal-home").classList.add("active");

  
}
else {
  window.location="dashboard"; // Browser redirect to the home page
}

}
});


