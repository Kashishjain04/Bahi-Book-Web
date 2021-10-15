import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUser } from "../redux/userSlice";
import "../assets/css/AddCustomer.css";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

function AddTransaction({ hideModal }) {
  const { custID } = useParams(),
    user = useSelector(selectUser),
    [amount, setAmount] = useState(0),
    [file, setFile] = useState(""),
    [fileType, setFileType] = useState(""),
    [desc, setDesc] = useState("");

  const handleUpload = (e) => {
    const fileReader = new FileReader();
    setFileType(e.target.files[0].type);
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = () => {
      setFile(fileReader.result);
    };
    fileReader.onerror = (err) => {
      console.log(err);
    };
  };

  const handleSubmit = (e, sending) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/addTransaction`, {
      method: "POST",
      body: JSON.stringify({
        user,
        customerId: custID,
        amount,
        desc,
        url: file,
        isGiving: sending,
        fileType,
      }),
      crossDomain: true,
      headers: { "Content-Type": "application/json" },
    }).catch((err) => console.log(err));

    setAmount(0);
    setFile(null);
    hideModal();
  };

  const form = (
    <form className="add__form">
      <label htmlFor="amount">Amount:</label>
      <input
        type="number"
        id="amount"
        min={1}
        placeholder="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <hr />
      <label htmlFor="desc">Description:</label>
      <input
        type="text"
        placeholder="Description of the transaction"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />
      <hr />
      <label htmlFor="receipt">Receipt:</label>
      <input
        type="file"
        id="receipt"
        accept="image/*"
        onChange={handleUpload}
      />
      <ButtonGroup variant="text">
        <Button
          // style={{ marginTop: "5px" }}
          variant="contained"
          color="secondary"
          onClick={(e) => handleSubmit(e, 1)}
        >
          Send
        </Button>
        <Button
          // style={{ marginTop: "5px" }}
          variant="contained"
          color="primary"
          onClick={(e) => handleSubmit(e, 0)}
        >
          Receive
        </Button>
      </ButtonGroup>
    </form>
  );

  return (
    <div className="add__customer">
      <h2>Add Transaction</h2>
      {form}
    </div>
  );
}

export default AddTransaction;
