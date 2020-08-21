import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: 'AIzaSyDnC_NYGC-n2H7pkAxg9SFGiz6FGoH7sVE',
    authDomain: 'react-instagram-clone-55c8f.firebaseapp.com',
    databaseURL: 'https://react-instagram-clone-55c8f.firebaseio.com',
    projectId: 'react-instagram-clone-55c8f',
    storageBucket: 'react-instagram-clone-55c8f.appspot.com',
    messagingSenderId: '192201377738',
    appId: '1:192201377738:web:3a445449ff9734549fb133',
    measurementId: 'G-4KP6M7F3M5'
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };