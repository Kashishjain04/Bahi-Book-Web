import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectUser } from "../redux/userSlice";
import { IconButton, Modal } from "@material-ui/core";
import { HomeOutlined } from "@ant-design/icons";
import firebase from "../firebase";

import AddCard from "../Components/AddCard";
import AddTransaction from "../Components/AddTransaction";
import DisplayTransaction from "../Components/DisplayTransaction";
import TransactionLoadingCard from "../Components/TransactionLoadingCard";
import HomeStats from "../Components/HomeStats";
import NotFound from "./NotFound";

import "../assets/css/CustomerPage.css";

const db = firebase.firestore;

function CustomerPage() {
  const { custID } = useParams(),
    user = useSelector(selectUser),
    [name, setName] = useState(""),
    [trans, setTrans] = useState([]),
    [sent, setSent] = useState(0),
    [received, setReceived] = useState(0),
    [modalVisible, setModalVisible] = useState(false),
    [transLoading, setTransLoading] = useState(true),
    [exists, setExist] = useState(true);

  useEffect(() => {
    const custRef = db()
      .collection("users")
      .doc(user.email)
      .collection("customers")
      .doc(custID);
    custRef.onSnapshot((snap) => {
      if (snap.exists) {
        setName(snap.data().name);
      } else {
        setExist(false);
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
            desc: doc.data().desc,
          });
          doc.data().amount >= 0
            ? setReceived((prev) => prev + Number(doc.data().amount))
            : setSent((prev) => prev - Number(doc.data().amount));
        });
        setTrans(transactions);
        setTransLoading(false);
      });
    return function cleanup() {
      setTrans([]);
      setName("");
    };
  }, [user, custID]);

  return !exists ? (
    <NotFound />
  ) : (
    <div>
      <div className="head">
        <h1 className="customer__name">{name}</h1>
        <IconButton className="home">
          <Link to="/">
            <HomeOutlined />
          </Link>
        </IconButton>
      </div>
      <HomeStats sent={sent} received={received} />
      <h1 className="subheading">Transactions</h1>
      <div className="transactions">
        {transLoading === false ? (
          <>
            {trans.map((t) => (
              <DisplayTransaction key={t.id} details={t} />
            ))}
            <AddCard onClick={() => setModalVisible(true)} />
          </>
        ) : (
          <TransactionLoadingCard />
        )}
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
