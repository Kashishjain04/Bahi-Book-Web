import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import CustomerPage from "./Pages/CustomerPage";
import HomePage from "./Pages/HomePage";
import firebase from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./redux/userSlice";
import Login from "./Pages/Login";

const auth = firebase.auth;

function App() {
  const dispatch = useDispatch(),
    user = useSelector(selectUser);

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        const obj = {
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
        };
        dispatch(login(obj));
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  const authRoute = (
    <Switch>
      <Route path="/" exact component={Login} />
    </Switch>
  );
  const appRoute = (
    <Switch>
      <Route path="/" exact component={HomePage} />
      <Route path="/customer/:custID" exact component={CustomerPage} />
    </Switch>
  );

  return (
    <div>
      <BrowserRouter>{user ? appRoute : authRoute}</BrowserRouter>
    </div>
  );
}

export default App;
