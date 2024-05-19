import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./App.css"
import "react-toastify/dist/ReactToastify.css";
import heroimg from './assets/Images/hero.png'
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db, provider } from "../firebase-config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Tasks from "./Components/Tasks/Task";
import { GoogleAuthProvider } from "firebase/auth/cordova";
import Task from "./Components/Tasks/Task";
import { Cookies } from "react-cookie";

function App() {
  const cookies = new Cookies();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [currentForm, setCurrentForm] = useState("login");
  const [isAuth, setIsAuth] = useState(cookies.get("auth-token"));
  const [userdata, setUserData] = useState("");

  const switchToSignup = () => setCurrentForm("signup");
  const switchToLogin = () => setCurrentForm("login");

  const handleGoogleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      cookies.set("auth-token", response._tokenResponse.refreshToken);

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          username,
          email,
          todos:[]
        });


        toast.success("Successfully Logged In and User Data Stored");
      } else {
        toast.info("Successfully Logged In");
      }

      setIsAuth(true);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (email.length === 0 || password.length === 0) {
      toast.warning("Please fill all the fields");
    } else {
      try {
        const response = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        cookies.set("auth-token", response._tokenResponse.refreshToken);
        toast.success("Successfully Logged In");
        setUserData(response.user.uid); 
        setIsAuth(true);
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    if (email.length === 0 || password.length === 0 || username.length === 0) {
      toast.warning("Please fill all the fields");
    } else {
      try {
        const response = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        setUserData(response.user.uid);

        await setDoc(doc(db, "users", response.user.uid), {
          username,
          email,
          todos:[]
        });


        if (!response.user.emailVerified) {
          await sendEmailVerification(response.user);
          toast.info("Verification email sent. Please verify your email.");
        } else {
          toast.info("Email already verified.");
        }

        toast.success(`Congratulations, You're Successfully Registered`);
      } catch (error) {
        toast.error(`Error during sign-up: ${error.message}`);
      }
    }
  };

  if (isAuth) {
    return <Tasks authUser={userdata} />;
  } else {
    return (
      <div id="main">
        <div id="hero">
          <div id="hero-content">
            <div id="hero-text">
            <h1>Tackleit</h1>
            <h5>Your Ultimate Taskmaster! 🏋️‍♂️✨</h5>
           
              <p>
              Unleash Your Productivity Potential with Tackleit 🚀
              </p>
            </div>
              <img src={heroimg} alt="hero image" id="hero-image" />
           
          </div>
          <div id="hero-form">
            {currentForm === "login" && (
              <form
                id="loginform"
                className="container"
                onSubmit={handleLoginSubmit}
              >
                <h1>Welcome Back</h1>
                <input
                  className="inputs"
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="inputs"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="login-btn" type="submit">
                  Log in
                </button>
                <p>OR</p>
                <button className="google-btn" onClick={handleGoogleSignin}>
                  {/* <img src={googleIcon} alt="googleicon" /> */}
                  Log in with Google
                </button>
                <h4>
                  Don't have an account?{" "}
                  <a href="#" onClick={switchToSignup}>
                    Signup
                  </a>
                </h4>
              </form>
            )}
            {currentForm === "signup" && (
              <form
                id="signup"
                className="container"
                onSubmit={handleSignupSubmit}
              >
                <h1>Create an Account</h1>
                <input
                  className="inputs"
                  type="text"
                  placeholder="Name"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  className="inputs"
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="inputs"
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button className="login-btn" type="submit">
                  Sign up
                </button>
                <p>OR</p>
                <button className="google-btn" onClick={handleGoogleSignin}>
                  {/* <img src={googleIcon} alt="googleicon" />  */}
                  Sign up with Google
                </button>
                <h4>
                  Already have an account?{" "}
                  <a href="#" onClick={switchToLogin}>
                    Login
                  </a>
                </h4>
              </form>
            )}
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
