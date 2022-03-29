import { useState, useEffect, forwardRef } from "react";
// import Button from "@mui/material/Button";
import Slide from "@mui/material/Slide";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useHistory } from "react-router-dom";
import firebase from "../firebase";

const messaging = firebase.messaging;

const Alert = forwardRef((props, ref) => {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// const ActionBtn = ({ action }) => {
// 	const history = useHistory();
// 	return (
// 		<Button
// 			// variant="outlined"
// 			color="default"
// 			size="small"
// 			onClick={() => action && history.push(action)}
// 		>
// 			Learn More...
// 		</Button>
// 	);
// };

const ForegroundNotification = () => {
	const history = useHistory(),
		[open, setOpen] = useState(false),
		[message, setMessage] = useState(""),
		[title, setTitle] = useState(""),
		[action, setAction] = useState("");

	useEffect(() => {
		return messaging().onMessage(({ notification }) => {
			console.log(notification);
			setTitle(notification?.title);
			setMessage(notification.body);
			setAction(notification.click_action);
			setOpen(true);
		});
	}, []);

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
			<MuiAlert
				// action={<ActionBtn action={action} />}
				onClose={resetNotif}
				severity="success"
				variant="filled"
				sx={{ width: "100%" }}
				onClick={() => history.push(action)}
			>
				<AlertTitle>{title}</AlertTitle>
				{message} - <strong>check it out</strong>
			</MuiAlert>
		</Snackbar>
	);
};

export default ForegroundNotification;
