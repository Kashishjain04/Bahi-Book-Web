import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUser } from "../redux/userSlice";
import Modal from "@material-ui/core/Modal";

import AddCard from "../Components/AddCard";
import AddTransaction from "../Components/AddTransaction";
import DisplayTransaction from "../Components/DisplayTransaction";
import TransactionLoadingCard from "../Components/TransactionLoadingCard";
import HomeStats from "../Components/HomeStats";
import NotFound from "./NotFound";
// import Pusher from "pusher-js";

import "../assets/css/CustomerPage.css";
import { io } from "socket.io-client";

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
				{transLoading === false ? (
					<>
						<AddCard onClick={() => setModalVisible(true)} />
						{trans.map((t) => (
							<DisplayTransaction
								key={t.id}
								details={t}
								userName={user?.name}
								custId={custID}
							/>
						))}
					</>
				) : (
					<TransactionLoadingCard />
				)}
			</div>
			<Modal
				open={modalVisible}
				onClose={() => setModalVisible(false)}
				aria-labelledby="add-customer"
				aria-describedby="simple-modal-description"
			>
				<AddTransaction hideModal={() => setModalVisible(false)} />
			</Modal>
		</div>
	);
}

export default CustomerPage;
