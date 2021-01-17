import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectUser } from "../redux/userSlice";
import firebase from "../firebase";
import "../assets/css/AddCustomer.css";
import { Button, ButtonGroup } from "@material-ui/core";

const db = firebase.firestore,
  storage = firebase.storage;

function AddTransaction({ hideModal }) {
  const { custID } = useParams(),
    user = useSelector(selectUser),
    [amount, setAmount] = useState(0),
    [file, setFile] = useState(null),
    [desc, setDesc] = useState(""),
    custRef = db()
      .collection("users")
      .doc(user.email)
      .collection("customers")
      .doc(custID),
    transRef = custRef.collection("transactions").doc();
  // selfRef = db()
  //   .collection("users")
  //   .doc(custID)
  //   .collection("customers")
  //   .doc(user.email);
  // selfTransRef = selfRef.collection("transactions").doc(transRef.id);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const dbUpdates = (url, sending) => {
    // const sending = document.getElementById("sending").checked;
    let amt = 0;
    if (sending) {
      amt = -1 * amount;
    } else {
      amt = amount;
    }
    setAmount(0);
    setFile(null);
    hideModal();
    transRef.set({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      amount: amt,
      receipt: url,
      desc,
    });

    // // // ALL THIS IS NOW DONE USING CLOUD FUNCTIONS // // //

    // selfTransRef.set({
    //   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //   amount: -1 * amt,
    //   receipt: url,
    //   desc,
    // });
    // if (sending) {
    //   db()
    //     .collection("users")
    //     .doc(user.email)
    //     .update({ sent: db.FieldValue.increment(Math.abs(amt)) });
    //   db()
    //     .collection("users")
    //     .doc(custID)
    //     .update({ received: db.FieldValue.increment(Math.abs(amt)) });
    // } else {
    //   db()
    //     .collection("users")
    //     .doc(user.email)
    //     .update({ received: db.FieldValue.increment(Math.abs(amt)) });
    //   db()
    //     .collection("users")
    //     .doc(custID)
    //     .update({ sent: db.FieldValue.increment(Math.abs(amt)) });
    // }
    // custRef.update({ balance: db.FieldValue.increment(amt) });
    // selfRef.update({ balance: db.FieldValue.increment(-1 * amt) });

    // // // // // // // // // // // // // // // // // // // // //
  };

  const handleSubmit = (e, sending) => {
    e.preventDefault();
    if (file) {
      const storageRef = storage().ref(`receipts/${transRef.id}-${file.name}`);
      const task = storageRef.put(file);
      task.on(
        "state_changed",
        function progress(snapshot) {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        function error(err) {
          console.log(err);
        },
        function complete() {
          storageRef
            .getDownloadURL()
            .then((url) => {
              dbUpdates(url, sending);
            })
            .catch((err) => console.log(err));
        }
      );
    } else {
      dbUpdates("", sending);
    }
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
