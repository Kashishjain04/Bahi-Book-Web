import React, { useEffect, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { io } from "socket.io-client";

import { getFcmToken } from "../utils/Notifications";
import DisplayCustomer from "../Components/DisplayCustomer";
import AddCustomer from "../Components/AddCustomer";
import AddCustomerCard from "../Components/AddCard";
import HomeStats from "../Components/HomeStats";
import CustomerLoadingCard from "../Components/CustomerLoadingCard";
// import ForegroundNotification from "../Components/ForegroundNotification";
import "../assets/css/Home.css";
import DialogContent from "@mui/material/DialogContent";

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

	return (
		<div className="home">
			{/* <ForegroundNotification /> */}
			{/* Home Page UserName */}
			{/* <div className="head">
				<Avatar className="avatar" alt={user.name} src={user.image} />
				<h2 className="head__text">{user.name}</h2>
			</div> */}
			<HomeStats sent={sent} received={received} />
			<h1 className="subheading">Friends</h1>
			<div className="customers">
				{custLoading === false ? (
					<>
						<AddCustomerCard onClick={() => setModalVisible(true)} />
						{customers.map((cust) => (
							<DisplayCustomer key={cust.id} details={cust} />
						))}
					</>
				) : (
					<>
					<CustomerLoadingCard />
					<CustomerLoadingCard />
					<CustomerLoadingCard />
					<CustomerLoadingCard />
					</>
				)}
			</div>
			<Modal
				open={modalVisible}
				onClose={() => setModalVisible(false)}
				aria-labelledby="add-customer"
				aria-describedby="simple-modal-description"
			>
				<DialogContent>
					<AddCustomer hideModal={() => setModalVisible(false)} />
				</DialogContent>
			</Modal>
		</div>
	);
}

export default HomePage;
