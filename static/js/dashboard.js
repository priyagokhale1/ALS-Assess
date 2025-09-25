
// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";


import { getDatabase, ref, set, update, child, get, remove } 
from "https://www.gstatic.com/firebasejs/9.17.2/firebase-database.js";

import {getUsername} from './navbar.js';
// import {userID} from './signIn.js';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvS-xmqI6LqWGpzY5oBNa5h0D2uh6tiuI",
  authDomain: "wearablesensor-8f6fb.firebaseapp.com",
  databaseURL: "https://wearablesensor-8f6fb-default-rtdb.firebaseio.com",
  projectId: "wearablesensor-8f6fb",
  storageBucket: "wearablesensor-8f6fb.appspot.com",
  messagingSenderId: "685131725700",
  appId: "1:685131725700:web:2bd19d7ed3540a778b7bd1"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
const auth = getAuth();

// Return instance of your app's FRD
const db = getDatabase(app);

// ---------------------// Get reference values ----------------------------
let welcome = document.getElementById('welcome'); // welcome header
let currentUser = null;     // Initialize currentUser to null



let myChart;


// ---------------------------Get a data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph
async function getDataSet(userID, day, month, year){
  
  const time = [];
  const sensorReadings = [];
  const tbodyEl = document.getElementById("tbody-2"); //Select tbody

  const dbref = ref(db);      //firebase parameter required for 'get'

  //Wait for all data to be pulled from FRD
  //Provide path through the nodes
  
  await get(child(dbref, 'users/' + userID + '/data/' + '/' + day + '-' + month + '-' + year)).then(snapshot => {
    if(snapshot.exists()){
      snapshot.forEach(child => {
        //Push values to correct arrays
        time.push(child.key);
        sensorReadings.push(child.val().trim());    // use trim to remove any carriage returns

      });
      
    } else {
      alert('No data found.');
      // window.location.reload();
    }
  }).catch((error) => {
    alert('unsuccessful, error ' + error);
  });

  //Dynamically add table rows to HTML
  

  // use innerHTML to add doughnut chart
  return {time, sensorReadings}
}
async function createChart(userID, day, month, year){
  // var check = document.getElementById('myChart').getContext('2d');
  
  const data = await getDataSet(userID, day, month, year);       // createChart() will wait until getData() processes
  const ctx = document.getElementById('myChart').getContext('2d');
  
  if (myChart) {
    myChart.destroy()
  }

  myChart = new Chart(ctx, {      // creates line chart
    type: 'line',
      data: {
        labels: data.time,
        datasets: [
            {
                label: `Myoware Muscle Sensor EMG Readings Over Time`,
                data: data.sensorReadings,
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 1
            }
    ]
    },
    options: {
        responsive: true,                 // Re-size based on screen size
        scales: {                           // x & y axes display options
            x: {
                title: {
                    display: true,
                    text: 'Time',
                    font: {

                      size: 20,
                      color: 'black'
                                    },
                }, 
                ticks: {
                    callback: function(val, index) {
                        return index % 5 === 0 ? this.getLabelForValue(val) : '';
                    },
                    font: {
                        size: 16
                    }
                }
            },
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Myoware Muscle Sensor Readings',
                    font: {
                      size: 20,
                      color: 'black'
                    },
                }, 
                ticks: {
                    maxTicksLimit: data.sensorReadings.length/10,
                    font: {
                      size: 12
                    }
                }
            }
        },
        plugins: {                          // title and legend display options
            title: {
                display: true,
                text: `Myoware Muscle Sensor EMG Readings Over Time`,
                font: {
                    size: 24,
                    color: 'black'
                },
                padding: {
                    top: 10,
                    bottom: 30
                }
            },
            legend: {
                position: 'top'
            }
        }
    }
  })
  document.querySelector(".grab-me").classList.add("set-background");



}



  
// --------------------------- Home Page Loading -----------------------------
window.onload = function(){
  currentUser = getUsername();

  // Set Welcome Message
  welcome.innerText = "Welcome " + currentUser.firstname;

  
  //Get the data set
  document.getElementById('getDataSet').onclick = function() {
    
    const userID = currentUser.uid;
    let date = document.getElementById("date").value;
    
    let year = date.split("-")[0];
    let month = date.split("-")[1];
    let day = date.split("-")[2];

    
    createChart(userID, day, month, year);

  };

  
// when the start recording button is clicked, the data is added to the firebase
  document.getElementById('start-recording').onclick = function() {
    const userID = currentUser.uid;
    console.log(userID);
    get(ref(db, 'users/' + userID + '/accountInfo')).then((snapshot)=> {
      if(snapshot.exists()) {
          const user = snapshot.val();
          firebaseConfig.userID = user.uid; 
          fetch('/test', {
            "method": "POST",
            "headers": {"Content-Type": "application/json"},
            "body": JSON.stringify(firebaseConfig),
        })

      } else {
          console.log("User does not exist.")
      }
  })
  .catch((error)=>{
      console.log(error);
  })
// the stop recording button shows up while the data is recording
  document.querySelector("#stop-recording").classList.add("active");
  document.querySelector("#start-recording").classList.remove("active");
    
  }
// when the stop recording button is pressed, the userID becomes null and then data is stopped being added to the firebase
  document.getElementById('stop-recording').onclick = function() {
    firebaseConfig.userID = '';
    // start recording button will show up if the user wants to begin recording again
    document.querySelector("#stop-recording").classList.remove("active");
    document.querySelector("#start-recording").classList.add("active");
    fetch('/test', {
      "method": "POST",
      "headers": {"Content-Type": "application/json"},
      "body": JSON.stringify(firebaseConfig),
  })
  }
}
  
    
 
// document.getElementById("date").onchange = function() {
//   createChart()
// }