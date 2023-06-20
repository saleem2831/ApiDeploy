const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

// Add Firebase SDK Snippet

// const firebaseConfig={
//   apiKey: "AIzaSyDE5k1iKKrHLmzbWHF25XzBk7CVzArE3HM",
//   authDomain: "fir-auth-17e9e.firebaseapp.com",
//   projectId: "fir-auth-17e9e",
//   storageBucket: "fir-auth-17e9e.appspot.com",
//   messagingSenderId: "576680614708",
//   appId: "1:576680614708:web:ed9af5d2e163c008966361"

// };

const firebaseConfig = {
  apiKey: "AIzaSyBr5Wb_3oi5RbumL1T6xh2pEYQEiD5g8rw",
  authDomain: "fir-auth2-8cf98.firebaseapp.com",
  projectId: "fir-auth2-8cf98",
  storageBucket: "fir-auth2-8cf98.appspot.com",
  messagingSenderId: "483928182896",
  appId: "1:483928182896:web:59cdf8a48d63ea398824b5"
};

firebase.initializeApp(firebaseConfig);

// const db =firebase.firestore();
// const user = db.collection("users");

module.exports = firebase;
