import { useState, useEffect } from "react";
import ShowMoreText from "react-show-more-text";
import ReceiptOutlined from "@material-ui/icons/ReceiptOutlined";
import { Statistic } from "antd";
import "../assets/css/TransactionCard.css";
import moment from "moment";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import IconButton from "@material-ui/core/IconButton";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import Loader from "./Loader";

function DisplayTransaction({ details, userName, custId }) {
	const user = useSelector(selectUser),
		[loading, setLoading] = useState(false),
		[mount, setMount] = useState(false);

	const validateImageUrl = (url) => url.includes("bahi-book.appspot.com");

	useEffect(() => {
		setMount(true);
		return () => {
			setMount(false);
		};
	}, []);

	const deleteTransaction = () => {
		const alert = window.confirm(
			"Are you sure you want to delete this transaction?"
		);
    console.log(alert);
		if (alert) {
			mount && setLoading(true);
			fetch(`${process.env.REACT_APP_API_BASE_URL}/api/deleteTransaction`, {
				method: "POST",
				body: JSON.stringify({
					user,
					custId,
					transId: details.id,
				}),
				crossDomain: true,
				headers: { "Content-Type": "application/json" },
			})
				.then(() => mount && setLoading(false))
				.catch((err) => {
					mount && setLoading(false);
					console.log(err);
				});
		}
	};

	return (
		<div className="trans__card">
			{loading && <Loader />}
			<p className="trans__time">
				{moment(details?.timestamp?._seconds * 1000).format("DD/MM/YY, HH:mm")}
			</p>
			<p className="trans__by">
				By: {details?.by === userName ? "You" : details?.by}
			</p>
			<div className="trans__details">
				<Statistic
					className={
						details.amount >= 0
							? "positive trans__amount"
							: "negative trans__amount"
					}
					value={Math.abs(details.amount)}
				/>
				{validateImageUrl(details.receipt) && (
					<a rel="noreferrer" href={details.receipt} target="_blank">
						<ReceiptOutlined className="trans__receipt" />
					</a>
				)}
				{details.desc !== "" && (
					<ShowMoreText
						className={
							details.receipt === "" ? "noreceipt trans__desc" : "trans__desc"
						}
						lines={2}
						more="More"
						less="Less"
						anchorClass="trans__desc"
						expanded={false}
					>
						{details.desc}
					</ShowMoreText>
				)}
			</div>
			<IconButton onClick={deleteTransaction} className="trans__delete">
				<DeleteOutlined fontSize="small" />
			</IconButton>
		</div>
	);
}

export default DisplayTransaction;
