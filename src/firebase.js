import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    authDomain: "instagram-clone-react-540a4.firebaseapp.com",
    apiKey: "AIzaSyAzzvIm6CQk3vufpjTg6IGS9i_ndgju_EA",
    databaseURL: "https://instagram-clone-react-540a4.firebaseio.com",
    projectId: "instagram-clone-react-540a4",
    storageBucket: "instagram-clone-react-540a4.appspot.com",
    messagingSenderId: "548699609603",
    appId: "1:548699609603:web:3358af3cdc4ba015688c36"
});


const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export { db, auth, storage};