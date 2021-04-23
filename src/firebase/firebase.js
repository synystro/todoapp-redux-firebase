import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBaNJs1UMN12HA1DlyvvrlwPYNB7A8NpDQ",
    authDomain: "todoappredux-bb607.firebaseapp.com",
    projectId: "todoappredux-bb607",
    storageBucket: "todoappredux-bb607.appspot.com",
    messagingSenderId: "151957332036",
    appId: "1:151957332036:web:eadff27d0b315f442b5c11",
    measurementId: "G-4BSPL5H47J"
};

let app;

if(!firebase.apps.length) {
    app = firebase.initializeApp(firebaseConfig)
} else {
    app = firebase.app();
}

const auth = firebase.auth()
const db = firebase.firestore(app)
const usersDb = db.collection("users")

export {auth, usersDb}
export default firebase;