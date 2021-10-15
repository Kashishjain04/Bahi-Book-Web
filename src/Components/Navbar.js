import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import { Link } from "react-router-dom";
import LogoutOutlined from "@ant-design/icons/LogoutOutlined";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import firebase from "../firebase";
import "../assets/css/Navbar.css";

const Navbar = () => {
	const auth = firebase.auth;
	const user = useSelector(selectUser),
		[open, setOpen] = useState(false);

	const logout = () => {
		setOpen(false);
		auth()
			.signOut()
			.catch((err) => console.log(err.message));
	};

	const DropdownMenu = () => (
		<ClickAwayListener onClickAway={() => setOpen(false)}>
			<div className="navbar__dropdown">
				<h4>{user.name}</h4>
				<div onClick={logout}>
					<LogoutOutlined />
					<p>Logout</p>
				</div>
			</div>
		</ClickAwayListener>
	);

	return (
		<div className="navbar">
			<Link to="/" className="navbar__brand">
				Bahi Book
			</Link>
			<div className="navbar__content">
				<IconButton onClick={() => setOpen(true)}>
					<Avatar className="avatar" alt={user?.name} src={user?.image} />
				</IconButton>
			</div>
			{open && <DropdownMenu />}
		</div>
	);
};

export default Navbar;
