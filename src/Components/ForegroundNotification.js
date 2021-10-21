import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useHistory } from "react-router-dom";
import firebase from "../firebase";

const messaging = firebase.messaging;

const ForegroundNotification = () => {
	const history = useHistory(),
		[open, setOpen] = useState(false),
		[message, setMessage] = useState(""),
		[action, setAction] = useState("");

	useEffect(() => {
		return messaging().onMessage(({ notification }) => {
			setMessage(
				notification.type === "transaction"
					? notification.title
					: notification.body
			);
			setAction(notification.click_action);
			setOpen(true);
		});
	}, []);

	const ActionBtn = () => (
		<Button
			variant="outlined"
			color="default"
			size="small"
			onClick={() => action && history.push(action)}
		>
			Learn More...
		</Button>
	);

	const resetNotif = () => {
		setOpen(false);
		setMessage("");
		setAction("");
	};

	return (
		<Snackbar
			open={open}
			autoHideDuration={6000}
			onClose={resetNotif}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			TransitionComponent={(props) => <Slide {...props} direction="down" />}
		>
			<Alert
				action={<ActionBtn />}
				onClose={resetNotif}
				severity="success"
				variant="filled"
				sx={{ width: "100%" }}
			>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default ForegroundNotification;
