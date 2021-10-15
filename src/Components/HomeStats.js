import { Statistic } from "antd";
import "../assets/css/HomeStats.css";

function HomeStats({ sent, received }) {
	return (
		<div className="numbers">
			<div className="number__item">
				<Statistic
					prefix={<span>₹ </span>}
          precision={1}
					title="You Got"
					value={received}
					valueStyle={{ color: "#3f8600", textAlign: "center" }}
				/>
			</div>
			<div className="number__item">
				<Statistic
					prefix={<span>₹ </span>}
          precision={1}
					title="You Gave"
					value={sent}
					valueStyle={{ color: "#cf1322", textAlign: "center" }}
				/>
			</div>
			<div className="number__item">
				<Statistic
					prefix={<span>₹ </span>}
          precision={1}
					title={
						received === sent
							? "Balance"
							: received >= sent
							? "You Will Give"
							: "You Will Get"
					}
					value={Math.abs(received - sent)}
					valueStyle={{
						color: received >= sent ? "#3f8600" : "#cf1322",
						textAlign: "center",
					}}
				/>
			</div>
		</div>
	);
}

export default HomeStats;
