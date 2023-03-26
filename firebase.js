// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword ,onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
import { collection, getFirestore, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBLdDI-Dt94krmMlKra6x95t3mduJaQBVI",
  authDomain: "event-3ff27.firebaseapp.com",
  projectId: "event-3ff27",
  storageBucket: "event-3ff27.appspot.com",
  messagingSenderId: "518289219631",
  appId: "1:518289219631:web:50c7455060756c52c8a6da",
  measurementId: "G-CF5MPWTRTM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);



//----------------- Different pages js functions ------------------------//
if(isloginpage) {
  //----------------- user login authentication ------------------------//
  document.getElementById("loginbtn").addEventListener('click',function() {
    const loginemail= document.getElementById('username').value;
    const password= document.getElementById('password').value;
    signInWithEmailAndPassword(auth,loginemail,password)
    .then((userCredential)=>{
      const user = userCredential.user;
      location.replace("../homepage/");
    })
    .catch((error)=>{
      const errorCode = error.code;
      const errorMessage = error.errorMessage;
      alert(errorMessage);
    })
  });


  //----------------- user signup authentication ------------------------//
  const signupform= document.querySelector('.sign-up-form')
  signupform.addEventListener('submit',(e)=>{
    e.preventDefault()

    const naam = document.getElementById('naam').value;
    const email_signup = document.getElementById('email-signup').value;
    const phn = document.getElementById('phn').value;
    const pass_sgn = document.getElementById('pass-signup').value;
    const dob = document.getElementById('dob').value;
    if(naam=="" || email_signup=="" || phn=="" || pass_sgn=="" || !dob){
      alert("Enter All Fields");
    }
    else{ 
      createUserWithEmailAndPassword(auth,email_signup,pass_sgn)
        .then( (cred)=> {
          const userRef1 =  doc(db, "users", cred.user.uid);
          //----------------- Adding user profile to user database ------------------------//
          setDoc(userRef1, {
            name: naam,
            email: email_signup,
            phone: phn,
            dob: dob,
          })
            .then(() => {
              alert("User added");
            })
            .catch((err) => {
              alert(err.message);
            })
          signupform.reset();
        })
        .catch((err)=>{
          alert(err.message);
        })
    }
  })
}
else if(ishomepage){

  //----------------- user id printing in homepage ------------------------//
  onAuthStateChanged(auth, (user) => {
    //----------------- session implementation ------------------------//
    if (user) {
      const uid = user.email;
      document.getElementById("num").innerHTML= "hello "+ uid;
    } 
    else{
      location.replace("./login-signup/index.html");
    }
  });
  
  //----------------- user logout authentication ------------------------//
  document.getElementById("logoutbtn").onclick = function(){
    auth.signOut();
    navigate("/");
  }
}


else if(isprofile){
  //----------------- user id finding in profile ------------------------//
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userid = user.uid;
      const userRef = doc(db, 'users',userid);
      getDoc(userRef)
        .then((doc) => {
          if(doc.exists()){
            const data = doc.data();
            document.getElementById("name").innerHTML= data.name;
            document.getElementById("nameFront").innerHTML=data.name;
            // document.getElementById("dob").innerHTML=data.dob;
            document.getElementById("email").innerHTML=data.email;
            document.getElementById("phone").innerHTML=data.phone;
            document.getElementById("description").innerHTML=data.description;
            document.getElementById("proimg").src = data.image;
          }
          else{
            console.log("NO SUCH USER EXIST");
          }
        })
        .catch((err) => {
          // console.log("Error getting document: ",err);
          alert("select query error");
        });
    } 
    else{
      location.replace("./login-signup/index.html");
    }
  });
  
  //----------------- user logout authentication ------------------------//
  function logoutProfile(){
    auth.signOut();
    navigate("/");
  }
}