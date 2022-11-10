import './App.css';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, FacebookAuthProvider, } from "firebase/auth";
import firebaseConfig from './firebase-config';
import { useState } from 'react';

initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const fbProvider = new FacebookAuthProvider();

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
    error: '',
    success: false,
  });

  const auth = getAuth();

  //////// forGoogleSignIn
  const handleSignin = () => {
    signInWithPopup(auth, provider)
      .then(res => {
        const { photoURL, displayName, email } = res.user;

        setUser({
          isSignIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const handleSignout = () => {
    signOut(auth)
      .then(() => {
        const outUser = {
          isSignIn: false,
          name: '',
          email: '',
          photo: '',
          password: '',
          error: '',
          success: '',
        }

        setUser(outUser);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  /////// ForFacebookSignIN
  const handleFbSignIN = () => {
    signInWithPopup(auth, fbProvider)
      .then((res) => {
        console.log(res.user);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  /////// Submit handler
  const handleSubmit = (e) => {

    ////////// Sign UP code
    if (newUser && user.name && user.email && user.password) {
      createUserWithEmailAndPassword(auth, user.email, user.password, user.name)
        .then((res) => {
          const updateSucess = { ...user };
          const successMessage = true;
          updateSucess.success = successMessage;
          updateSucess.error = '';

          setUser(updateSucess);
          updateName(user.name);
        })
        .catch((error) => {
          const userInfo = { ...user };
          const errorMessage = error.message;
          userInfo.error = errorMessage;
          userInfo.success = false;

          setUser(userInfo);
        });
    }

    if (!newUser && user.email && user.password) {
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((res) => {
          const updateSucess = { ...user };
          const successMessage = true;
          updateSucess.success = successMessage;
          updateSucess.error = '';

          setUser(updateSucess);
          console.log(res.user);
        })
        .catch((error) => {
          const userInfo = { ...user };
          const errorMessage = error.message;
          userInfo.error = errorMessage;
          userInfo.success = false;

          setUser(userInfo);
        });
    }
    e.preventDefault();

    const updateName = name => {
      updateProfile(auth.currentUser, {
        displayName: name,
      }).then(() => {
        console.log('Username Update successfully');
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  ///// Handle change
  // const handleChange = (e) => {
  //   console.log(e.target.name, e.target.value);
  // }

  //// handle blur, lekha shes howar por kaj korbe.
  const handleBlur = (e) => {
    let isFieldValid = true;

    if (e.target.name === 'email') {
      isFieldValid = /^\S+@\S+\.\S+/.test(e.target.value);
    }
    if (e.target.name === 'password') {
      const isPassChar = e.target.value.length > 7;
      const isPassNum = /\d{1}/.test(e.target.value);

      isFieldValid = isPassChar && isPassNum;
    }

    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;

      setUser(newUserInfo);
    }
  }

  return (
    <div>
      {
        user.isSignIn ?
          <button onClick={handleSignout}>Sign Out</button> :
          <button onClick={handleSignin}>Sign in with google</button>
      }
      <br></br>
      <button onClick={handleFbSignIN}>Sign in with facebook</button>

      {
        user.isSignIn && <div>
          <h2>Name: {user.name}</h2>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <br></br>
      <br></br>

      <form onSubmit={handleSubmit}>
        <input onChange={() => setNewUser(!newUser)} type="checkbox" name="newUser" id="signUP" />
        <label htmlFor="signUp">For new user</label>
        <br></br>
        {newUser && <input type="text" onBlur={handleBlur} name="name" id="" placeholder='Your name' required />}
        <br></br>
        <input type="email" onBlur={handleBlur} placeholder='Write your Email' name="email" id="email" required />
        <br></br>
        <input type="password" onBlur={handleBlur} name="password" id="password" placeholder='Password' required />
        <br></br>
        <input type="submit" value={newUser ? 'Sign Up' : "Sign in"} />
      </form>

      {
        user.error && <p style={{ color: 'red' }}>{user.error}</p>
      }
      {
        user.success && <p style={{ color: 'green' }}>User {newUser ? 'created' : 'Login'} successfully</p>
      }

    </div>
  );
}

export default App;
