  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDJgjxxSHG4z3Xj_sy39yH-w9XmwnWluZw",
    authDomain: "mapboxgl-getachew.firebaseapp.com",
    databaseURL: "https://mapboxgl-getachew.firebaseio.com",
    projectId: "mapboxgl-getachew",
    storageBucket: "mapboxgl-getachew.appspot.com",
    messagingSenderId: "629112070935"
    
  };
  firebase.initializeApp(config);
  // alert('Firebase Database Initialized!!!')

  // Link: https://nwas-regional-breakdown.firebaseio.com
  
  // Declare Database Connection Reference
  var fbRef = firebase.database().ref();
  

