import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./redux/userSlice";
import { useMediaQuery } from "react-responsive";
import firebase from "./firebase";
import "./assets/css/variables.css";

const Navbar = lazy(() => import("./Components/Navbar"));
const ContactPage = lazy(() => import("./Pages/ContactPage"));
const CustomerPage = lazy(() => import("./Pages/CustomerPage"));
const HomePage = lazy(() => import("./Pages/HomePage"));
const Login = lazy(() => import("./Pages/Login"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const Denied = lazy(() => import("./Pages/Denied"));
// import CustomerPage from "./Pages/CustomerPage";
// import HomePage from "./Pages/HomePage";
// import Login from "./Pages/Login";
// import NotFound from "./Pages/NotFound";
// import Denied from "./Pages/Denied";

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

	// Mock login
	// useEffect(() => {
	// auth().signInWithEmailAndPassword("test@user.com", "123456");
	// }, []);

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
			<Route path="/friend/:custID" exact component={Denied} />
			<Route path="/contact-us" exact component={ContactPage} />
			<Route path="*" component={NotFound} />
		</Switch>
	);
	const appRoute = (
		<Switch>
			<Route path="/" exact component={HomePage} />
			<Route path="/friend/:custID" exact component={CustomerPage} />
			<Route path="/contact-us" exact component={ContactPage} />
			<Route path="*" component={NotFound} />
		</Switch>
	);

	return (
		<div>
			{loading ? (
				<CircularProgress
					style={{ position: "absolute", top: "45vh", left: "45vw" }}
				/>
			) : (
				<BrowserRouter>
					<Suspense
						fallback={
							<CircularProgress
								style={{ position: "absolute", top: "45vh", left: "45vw" }}
							/>
						}
					>
						<Navbar />
						{user ? appRoute : authRoute}
					</Suspense>
				</BrowserRouter>
			)}
		</div>
	);
}

export default App;
