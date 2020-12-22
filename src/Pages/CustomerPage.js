import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import AddTransaction from "../Components/AddTransaction";
import DisplayTransaction from "../Components/DisplayTransaction";
import firebase from "../firebase";
import { selectUser } from "../redux/userSlice";
import "../assets/css/CustomerPage.css";
import HomeStats from "../Components/HomeStats";
import { Modal } from "@material-ui/core";
import AddCard from "../Components/AddCard";

const db = firebase.firestore;

function CustomerPage() {
  const { custID } = useParams(),
    user = useSelector(selectUser),
    [name, setName] = useState(""),
    [trans, setTrans] = useState([]),
    [sent, setSent] = useState(0),
    [received, setReceived] = useState(0),
    [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const custRef = db()
      .collection("users")
      .doc(user.email)
      .collection("customers")
      .doc(custID);
    custRef.onSnapshot((snap) => {
      if (snap.exists) {
        setName(snap.data().name);
      }
    });
    custRef
      .collection("transactions")
      .orderBy("timestamp", "desc")
      .onSnapshot((snap) => {
        const transactions = [];
        setSent(0);
        setReceived(0);
        snap.forEach((doc) => {
          transactions.push({
            id: doc.id,
            amount: doc.data().amount,
            receipt: doc.data().receipt,
            timestamp: doc.data().timestamp,
          });
          doc.data().amount >= 0
            ? setReceived((prev) => prev + Number(doc.data().amount))
            : setSent((prev) => prev - Number(doc.data().amount));
        });
        setTrans(transactions);
      });
    return function cleanup() {
      setTrans([]);
      setName("");
    };
  }, [user, custID]);

  return (
    <div>
      <h1 className="customer__name">{name}</h1>
      <HomeStats sent={sent} received={received} />
      <h1 className="subheading">Transactions</h1>
      <div className="transactions">
        {trans.map((t) => (
          <DisplayTransaction key={t.id} details={t} />
        ))}
        <AddCard onClick={() => setModalVisible(true)} />
      </div>
      <Modal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        aria-labelledby="add-customer"
        aria-describedby="simple-modal-description"
      >
        <AddTransaction hideModal={() => setModalVisible(false)} />
      </Modal>
    </div>
  );
}

export default CustomerPage;
