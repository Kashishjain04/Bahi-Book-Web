import React, { useState, forwardRef } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import "../assets/css/AddCustomer.css";
import Button from "@mui/material/Button";

const AddCustomer = forwardRef(({ hideModal }, ref) => {
	const user = useSelector(selectUser),
		[ID, setID] = useState(""),
		[name, setName] = useState("");

	const submitHandler = (e) => {
		e.preventDefault();
		if (ID === user.email) {
			return alert("Can't add yourself as your customer");
		}
		fetch(`${process.env.REACT_APP_API_BASE_URL}/api/addCustomer`, {
			method: "POST",
			body: JSON.stringify({
				user,
				id: ID,
				name,
			}),
			crossDomain: true,
			headers: { "Content-Type": "application/json" },
		}).catch((err) => console.log(err));

		hideModal();
		setID("");
		setName("");
	};

	const changeID = (e) => {
		const id = e.target.value.toLowerCase();
		setID(id);
	};

	const form = (
		<form className="add__form" onSubmit={submitHandler}>
			<input
				type="email"
				placeholder="Email Id"
				value={ID}
				onChange={changeID}
				required
			/>
			<input
				type="text"
				placeholder="Customer Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
			/>
			<Button style={{ marginTop: "5px" }} variant="outlined" type="submit">
				Submit
			</Button>
		</form>
	);

	return (
		<div ref={ref} className="add__customer">
			<h2>Add Friend</h2>
			{form}
		</div>
	);
});

export default AddCustomer;
