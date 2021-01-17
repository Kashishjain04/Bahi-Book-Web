import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CustomerPage from "./Pages/CustomerPage";
import HomePage from "./Pages/HomePage";
import firebase from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./redux/userSlice";
import Login from "./Pages/Login";
import { CircularProgress } from "@material-ui/core";
import { useMediaQuery } from "react-responsive";
import "./App.css";
import "./assets/css/variables.css";

const auth = firebase.auth;

function App() {
  // Check System Theme
  const systemPrefersDark = useMediaQuery(
    {
      query: "(prefers-color-scheme: dark)",
    },
    undefined,
    (prefersDark) => {
      setIsDark(prefersDark);
    }
  );

  const dispatch = useDispatch(),
    user = useSelector(selectUser),
    [loading, setLoading] = useState(user ? false : true),
    [isDark, setIsDark] = useState(systemPrefersDark);

  // For Theme
  useEffect(() => {
    document.documentElement.classList.add(isDark ? "dark" : "light");
    document.documentElement.classList.remove(isDark ? "light" : "dark");
  }, [isDark]);

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        const obj = {
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
        };
        dispatch(login(obj));
        setLoading(false);
      } else {
        dispatch(logout());
        setLoading(false);
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
      {loading ? (
        <CircularProgress
          style={{ position: "absolute", top: "45vh", left: "45vw" }}
        />
      ) : (
        <BrowserRouter>{user ? appRoute : authRoute}</BrowserRouter>
      )}
    </div>
  );
}

export default App;
