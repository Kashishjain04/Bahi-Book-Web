import moment from "moment";
import { Link } from "react-router-dom";
import "../assets/css/CustomerCard.css";

function DisplayCustomer({ details }) {
	return (
		<Link className="customer__card" to={"/customer/" + details.id}>
			<p className="customer__time">
				{moment(details?.lastActivity?._seconds * 1000).fromNow()}
			</p>
			<h2 className="customer__name">{details.name}</h2>
			<p>
				{details.balance === 0
					? "Balance: "
					: details.balance > 0
					? "You Will Give: "
					: "You Will Get: "}
				<span className={details.balance >= 0 ? "positive" : "negative"}>
					{Math.abs(details.balance)}
				</span>
			</p>
		</Link>
	);
}

export default DisplayCustomer;
