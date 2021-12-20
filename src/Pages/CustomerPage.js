import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUser } from "../redux/userSlice";

import Modal from "@mui/material/Modal";
import AddCard from "../Components/AddCard";
import AddTransaction from "../Components/AddTransaction";
import HomeStats from "../Components/HomeStats";
import NotFound from "./NotFound";

import "../assets/css/CustomerPage.css";
import { io } from "socket.io-client";
import DialogContent from "@mui/material/DialogContent";
import TransactionsTable from "../Components/TransactionsTable";
import TransTable from "../Components/TransTable";

function CustomerPage() {
	const { custID } = useParams(),
		user = useSelector(selectUser),
		[name, setName] = useState(""),
		[trans, setTrans] = useState([]),
		[sent, setSent] = useState(0),
		[received, setReceived] = useState(0),
		[modalVisible, setModalVisible] = useState(false),
		[transLoading, setTransLoading] = useState(true),
		[exists, setExist] = useState(true);

	useEffect(() => {
		const socket = io(process.env.REACT_APP_API_BASE_URL);

		socket.emit("custDoc", { user, custId: custID }, (err) => console.log(err));
		socket.emit("transactionsCol", { user, custId: custID }, (err) =>
			console.log(err)
		);

		socket.on("custDoc", ({ data }) => {
			if (data) {
				setName(data?.name);
			} else {
				setExist(false);
			}
		});

		socket.on("transactionsCol", ({ data }) => {
			setTransLoading(false);
			setTrans(data?.transactions || []);
			setReceived(data?.received || 0);
			setSent(data?.sent || 0);
			setTransLoading(false);
		});

		return () => {
			setTrans([]);
			setTransLoading(true);
			socket.off();
		};
	}, [user, custID]);

	return !exists ? (
		<NotFound />
	) : (
		<div>
			<div className="head">
				<h1 className="customer__name">{name}</h1>
			</div>
			<HomeStats sent={sent} received={received} />
			<h1 className="subheading">Transactions</h1>
			<div className="transactions">
				<AddCard className="trans" onClick={() => setModalVisible(true)} />
				{!transLoading && (
					<TransTable user={user} custId={custID} transactions={trans} />
					// <TransactionsTable user={user} custId={custID} transactions={trans} />
				)}
			</div>
			<Modal
				open={modalVisible}
				onClose={() => setModalVisible(false)}
				aria-labelledby="add-customer"
				aria-describedby="simple-modal-description"
			>
				<DialogContent>
					<AddTransaction hideModal={() => setModalVisible(false)} />
				</DialogContent>
			</Modal>
		</div>
	);
}

export default CustomerPage;
