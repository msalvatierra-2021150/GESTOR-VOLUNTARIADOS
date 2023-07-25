const {getStorage, ref, uploadBytes, getDownloadURL,deleteObject} = require('firebase/storage');
const {v4} = require('uuid');
const { initializeApp }= require( "firebase/app");
//key de proyecto en firebase web
//cambiar esto si quisieran usar otra 
const firebaseConfig = {
    apiKey: "AIzaSyD1Go1pZfYc8JJi1mpYUUU9iF53iOQvuX0",
    authDomain: "backend-voluntariados.firebaseapp.com",
    projectId: "backend-voluntariados",
    storageBucket: "backend-voluntariados.appspot.com",
    messagingSenderId: "723006313779",
    appId: "1:723006313779:web:0b4878d5bdca8364fa1a46",
    measurementId: "G-RP833KQFGM"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const storage = getStorage(app);
//agregar archivos a firebase
 const uploadFile = async(file)=>{
    const storageRef= ref(storage,v4())
     await uploadBytes(storageRef, file)
    const url = await getDownloadURL(storageRef);
    return url
 
 }
//eliminar archivo
 const  eliminarFile= async (name)=>{
    const storage = getStorage();
    const desertRef = ref(storage, name);

    deleteObject(desertRef).then(()=>{
        console.log("todo bien");
    }).catch((Error)=>{
        console.log("todo mal");
    })
}
module.exports = {
    eliminarFile
  }

