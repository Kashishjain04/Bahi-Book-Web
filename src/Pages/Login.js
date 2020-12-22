// import { Button } from "@material-ui/core";
import React from "react";
import firebase from "../firebase";
import "../assets/css/Login.css";

const db = firebase.firestore,
  auth = firebase.auth,
  provider = new firebase.auth.GoogleAuthProvider();

const Login = () => {
  const login = () => {
    auth()
      .signInWithPopup(provider)
      .then(({ additionalUserInfo }) => {
        if (additionalUserInfo.isNewUser) {
          db()
            .collection("users")
            .doc(additionalUserInfo.profile.email)
            .set({ name: additionalUserInfo.profile.name }, { merge: true });
        }
      })
      .catch((err) => alert(err.message));
  };

  const button = (
    <div onClick={login} className="google-btn">
      <div className="google-icon-wrapper">
        <img
          alt="google-icon"
          className="google-icon"
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
        />
      </div>
      <p className="btn-text">
        <b>Sign in with google</b>
      </p>
    </div>
  );

  return (
    <div className="login">
      <div className="login__logo">
        <img alt="logo" src="/icon.ico" />
        <h1 className="logo__text">Bahi Book</h1>
      </div>
      {button}
    </div>
  );
};

export default Login;
