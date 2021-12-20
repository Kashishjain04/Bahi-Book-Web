import { useEffect, useState } from "react";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import RightOutlined from "@ant-design/icons/RightOutlined";
import IconButton from "@mui/material/IconButton";
import moment from "moment";
import "../assets/css/TransTable.css";

const TransTable = ({ user, custId, transactions }) => {
	const [mount, setMount] = useState(false),
		[loading, setLoading] = useState(false),
        [pageIndex, setPageIndex] = useState(0),
        [filterTransactions, setFilterTransactions] = useState(transactions.slice(0,5));

	useEffect(() => {
		setMount(true);
		return () => {
			setMount(false);
		};
	}, []);

    useEffect(() => {        
        console.log(Math.floor(transactions.length/5))
        setFilterTransactions(transactions.slice(pageIndex*5, (pageIndex+1)*5));
    }, [pageIndex, transactions])

	const validateImageUrl = (url) => url?.includes("bahi-book.appspot.com");

	const deleteTransaction = (transId) => {
		const alert = window.confirm("Are you sure you want to delete this transaction?");
		if (alert) {
			mount && setLoading(true);
			fetch(`${process.env.REACT_APP_API_BASE_URL}/api/deleteTransaction`, {
				method: "POST",
				body: JSON.stringify({
					user,
					custId,
					transId,
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
		<div className="transTable__container">
            <div className="transTable__inner">
			<table className="transTable">
				<thead>
					<tr>
						<th>Date-Time</th>
						<th>Amount</th>
						<th>By</th>
						<th>Description</th>
						<th>Receipt</th>
						<th>Delete</th>
					</tr>
				</thead>
				<tbody>
					{filterTransactions.map((t, i) => (
						<tr key={t.id} className={`transTable__row row-${i % 2}`}>
							<td className="time">
								{moment(t?.timestamp?._seconds * 1000).format("MMM DD, YYYY - hh:mm A")}
							</td>
							<td className={t.amount < 0 ? "gave" : "got"}>₹ {Math.abs(t.amount)}</td>
							<td>{t.by}</td>
							<td className="desc">{t.desc || "No Description"}</td>
							<td>
								{validateImageUrl(t.receipt) ? (
									<a rel="noreferrer" href={t.receipt} target="_blank">
										<img src={t.receipt} alt="receipt" style={{ height: "50px" }} />
									</a>
								) : (
									"No Receipt"
								)}
							</td>
							<td>
								<IconButton onClick={() => deleteTransaction(t.id)}>
									<DeleteOutlined className="deleteBtn" />
								</IconButton>
							</td>
						</tr>
					))}
				</tbody>
			</table>
            </div>
			<div className="transTable__footer">
                <p className="pageInfo">{5*pageIndex + 1}-{Math.min((pageIndex + 1)*5, transactions.length)} of {transactions.length}</p>
				<div className="icons">
					<IconButton disabled={pageIndex === 0} onClick={() => setPageIndex((prev) => Math.max(prev-1, 0))}>
						<LeftOutlined className="pageIcon" />
					</IconButton>
					<IconButton disabled={pageIndex === Math.floor(transactions.length/5)} onClick={() => setPageIndex((prev) => Math.min(prev+1, Math.floor(transactions.length/5)))}>
						<RightOutlined className="pageIcon" />
					</IconButton>
				</div>
			</div>
		</div>
	);
};

export default TransTable;
