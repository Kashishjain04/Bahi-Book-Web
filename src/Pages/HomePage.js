import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Modal from "@material-ui/core/Modal";
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { io } from "socket.io-client";

import { getFcmToken } from "../utils/Notifications";
import DisplayCustomer from "../Components/DisplayCustomer";
import AddCustomer from "../Components/AddCustomer";
import AddCustomerCard from "../Components/AddCard";
import HomeStats from "../Components/HomeStats";
import CustomerLoadingCard from "../Components/CustomerLoadingCard";
import ForegroundNotification from "../Components/ForegroundNotification";
import firebase from "../firebase";
import "../assets/css/Home.css";

const auth = firebase.auth;

function HomePage() {
	const _isMounted = useRef(true),
		user = useSelector(selectUser),
		[sent, setSent] = useState(0),
		[received, setReceived] = useState(0),
		[customers, setCustomers] = useState([]),
		[modalVisible, setModalVisible] = useState(false),
		[custLoading, setCustLoading] = useState(true);

	useEffect(() => {
		const socket = io(process.env.REACT_APP_API_BASE_URL);

		socket.emit("userDoc", { user }, (err) => {
			console.log(err);
		});
		socket.emit("customersCol", { user }, (err) => {
			console.log(err);
		});

		socket.on("userDoc", ({ data }) => {
			setSent(data?.sent);
			setReceived(data?.received);
		});
		socket.on("customersCol", ({ data }) => {
			setCustomers(data);
			setCustLoading(false);
		});

		return () => {
			_isMounted.current = false;
			setCustomers([]);
			setCustLoading(true);
			socket.off();
		};
	}, [user]);

	// // // // // // OLD PUSHER CODE NOW USING SOCKET.IO // // // // // //
	// useEffect(() => {
	// const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
	//   cluster: "ap2",
	// });

	// const userDocChannel = pusher.subscribe("userDoc"),
	//   customersColChannel = pusher.subscribe("customersCol");

	// userDocChannel.bind("update", ({ data }) => {
	//   setSent(data?.sent);
	//   setReceived(data?.received);
	// });
	// customersColChannel.bind("update", ({ data }) => {
	//   setCustomers(data);
	//   setCustLoading(false);
	// });

	// fetch(`${process.env.REACT_APP_API_BASE_URL}/api/userDoc`, {
	//   body: JSON.stringify({ user: user }),
	//   method: "POST",
	//   crossDomain: true,
	//   headers: { "Content-Type": "application/json" },
	// }).catch((err) => console.log(err));

	// fetch(`${process.env.REACT_APP_API_BASE_URL}/api/customersCol`, {
	//   body: JSON.stringify({ user: user }),
	//   method: "POST",
	//   crossDomain: true,
	//   headers: { "Content-Type": "application/json" },
	// }).catch((err) => console.log(err));

	// return () => {
	//   _isMounted.current = false;
	//   setCustomers([]);
	//   setCustLoading(true);
	//   userDocChannel.unbind_all();
	//   userDocChannel.unsubscribe();
	//   customersColChannel.unbind_all();
	//   customersColChannel.unsubscribe();
	// };
	// }, [user]);
	// // // // // // // // // // // // // // /// // // // // // // // //

	useEffect(() => {
		getFcmToken()
			.then((tokenData) => {
				if (tokenData.message === "success") {
					fetch(`${process.env.REACT_APP_API_BASE_URL}/api/updateUser`, {
						method: "POST",
						body: JSON.stringify({
							user: { ...user, tokenType: "fcmTokens", token: tokenData.token },
						}),
						headers: { "Content-Type": "application/json" },
						crossDomain: true,
					}).catch((err) => console.log(err));
				}
			})
			.catch((err) => console.log(err));
	}, [user]);
	// // // // // // // // // // // // // // // // // // // // //

	const logout = () => {
		auth()
			.signOut()
			.catch((err) => console.log(err.message));
	};

	return (
		<div className="home">
			<ForegroundNotification />
			<div className="head">
				<Avatar className="avatar" alt={user.name} src={user.image} />
				<h2 className="head__text">{user.name}</h2>
				<IconButton className="logout" onClick={logout}>
					<LogoutOutlined />
				</IconButton>
			</div>
			<HomeStats sent={sent} received={received} />
			<h1 className="subheading">Customers</h1>
			<div className="customers">
				{custLoading === false ? (
					<>
						<AddCustomerCard onClick={() => setModalVisible(true)} />
						{customers.map((cust) => (
							<DisplayCustomer key={cust.id} details={cust} />
						))}
					</>
				) : (
					<CustomerLoadingCard />
				)}
			</div>
			<Modal
				open={modalVisible}
				onClose={() => setModalVisible(false)}
				aria-labelledby="add-customer"
				aria-describedby="simple-modal-description"
			>
				<AddCustomer hideModal={() => setModalVisible(false)} />
			</Modal>
			<div className="contactus-link">
				<Link to="/contact-us">Contact Us</Link>
			</div>
		</div>
	);
}

export default HomePage;
