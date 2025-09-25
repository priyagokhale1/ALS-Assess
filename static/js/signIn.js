
  // Project Name: Wearable Sensor ALS Assess
  // Team Members: Priya Gokhale, Emme Cai, Haley Deng, Bernice Zhao
  // Date Due: May 31st
  // File Name: signIn.js
  // Task Description: individual js file that controls the sign in of an exisiting user 

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

// Return instance of your app's FRD
const db = getDatabase(app);

let userID = "";


// ---------------------- Sign-In User ---------------------------------------//
document.getElementById('signIn').onclick = function() {
    // Get user's email and password for sign in
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Attempt to sign a user in
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Create a user and store the user ID
        const user = userCredential.user;
        userID = user.uid;
        console.log(userID);
        // Log sign in date in DB
        // update will only add the last_login info and won't overwrite anything else
        let logDate = new Date();
        update(ref(db, 'users/' + user.uid + '/accountInfo'), {
            last_login: logDate, 
        })
        .then(() => {
            // User signed in
            document.querySelector(".remove-for-sign-out").classList.remove("show-login");
            console.log(document.querySelector(".remove-for-sign-out").classList.value);
            alert('User signed in sucessfully!');

            // Get snapshot of all the user info and pass it to the login() function and stored in session or local storage
            get(ref(db, 'users/' + user.uid + '/accountInfo')).then((snapshot)=> {
                if(snapshot.exists()) {
                    console.log(snapshot.val());
                    logIn(snapshot.val(), firebaseConfig)
                } else {
                    console.log("User does not exist.")
                }
            })
            .catch((error)=>{
                console.log(error);
            })
        })
        .catch((error) => {
            // Sign in failed...
            alert(error);
        });
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    });
}
console.log(userID);
export {userID};


// ---------------- Keep User Logged In ----------------------------------//
function logIn(user, fbcfg) { // User = user info, fbcfg = firebase config
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;

    fbcfg.userID = user.uid;    // Add userID to FB config so taht it is passed to Flask

    // Session storage is temporary (only active while browser open)
    // Information saved as a string (must convert JS object to string)
    // Session stroage will be cleared with a signOut() function in home.js
    if(!keepLoggedIn) {
        sessionStorage.setItem('user', JSON.stringify(user));
        
        // Send Firebase config and unique user ID to app.py using POST method
        // fetch('/test', {
        //     "method": "POST",
        //     "headers": {"Content-Type": "application/json"},
        //     "body": JSON.stringify(fbcfg),
        // })
        // alert(fbcfg); // Debug only
        window.location="dashboard"; // Browser redirect to the home page via /home route in app.py
    }
    
    // Local storage is permanent (unless you signOut)
    else {
        localStorage.setItem('keepLoggedIn', 'yes')
        localStorage.setItem('user', JSON.stringify(user));

        // Send Firebase config and unique user ID to app.py using POST method
        // fetch('/test', {
        //     "method": "POST",
        //     "headers": {"Content-Type": "application/json"},
        //     "body": JSON.stringify(fbcfg),
        // })
        // alert(fbcfg); // Debug only
        window.location="dashboard"; // Browser redirect to the home page
    }
}



