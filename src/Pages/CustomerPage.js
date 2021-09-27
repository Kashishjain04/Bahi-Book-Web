import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { selectUser } from "../redux/userSlice";
import { IconButton, Modal } from "@material-ui/core";
import { HomeOutlined } from "@ant-design/icons";

import AddCard from "../Components/AddCard";
import AddTransaction from "../Components/AddTransaction";
import DisplayTransaction from "../Components/DisplayTransaction";
import TransactionLoadingCard from "../Components/TransactionLoadingCard";
import HomeStats from "../Components/HomeStats";
import NotFound from "./NotFound";
// import Pusher from "pusher-js";

import "../assets/css/CustomerPage.css";
import { io } from "socket.io-client";

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
    const socket = io(process.env.REACT_APP_API_BASE_URL);

    socket.emit("custDoc", {user, custId: custID}, (err) => console.log(err));
    socket.emit("transactionsCol", {user, custId: custID}, (err) => console.log(err));

    socket.on("custDoc", ({data}) => {
      if (data) {
        setName(data?.name);
      } else {
        setExist(false);
      }
    })
    
    socket.on("transactionsCol", ({data}) => {
      setTransLoading(false);
      setTrans(data?.transactions || []);
      setReceived(data?.received || 0);
      setSent(data?.sent || 0);
      setTransLoading(false);
    })
    
    return () => {
      setTrans([]);
      setTransLoading(true);
      socket.off();      
    };

  }, [user, custID]);

  // // // // // // OLD PUSHER CODE NOW USING SOCKET.IO // // // // // //
  // useEffect(() => {
    // const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
    //   cluster: "ap2",
    // });

    // const custDocChannel = pusher.subscribe("custDoc"),
    //   transactionsColChannel = pusher.subscribe("transactionsCol");

    // custDocChannel.bind("update", ({ data }) => {
    //   if (data) {
    //     setName(data?.name);
    //   } else {
    //     setExist(false);
    //   }
    // });
    // transactionsColChannel.bind("update", ({ data }) => {
    //   setTransLoading(false);
    //   setTrans(data?.transactions || []);
    //   setReceived(data?.received || 0);
    //   setSent(data?.sent || 0);
    //   setTransLoading(false);
    // });

    // fetch(`${process.env.REACT_APP_API_BASE_URL}/api/custDoc`, {
    //   body: JSON.stringify({ user, custId: custID }),
    //   method: "POST",
    //   crossDomain: true,
    //   headers: { "Content-Type": "application/json" },
    // }).catch((err) => console.log(err));

    // fetch(`${process.env.REACT_APP_API_BASE_URL}/api/transactionsCol`, {
    //   body: JSON.stringify({ user, custId: custID }),
    //   method: "POST",
    //   crossDomain: true,
    //   headers: { "Content-Type": "application/json" },
    // }).catch((err) => console.log(err));

    // return () => {
    //   setTrans([]);
    //   setTransLoading(true);
    //   custDocChannel.unbind_all();
    //   custDocChannel.unsubscribe();
    //   transactionsColChannel.unbind_all();
    //   transactionsColChannel.unsubscribe();
    // };
  // }, [user, custID]);
  // // // // // // // // // // // // // // /// // // // // // // // //


  // // // // // // DONE USING NODEJS // // // // // //
  // useEffect(() => {
  //   const custRef = db()
  //     .collection("users")
  //     .doc(user.email)
  //     .collection("customers")
  //     .doc(custID);
  //   custRef.onSnapshot((snap) => {
  //     if (snap.exists) {
  //       setName(snap.data().name);
  //     } else {
  //       setExist(false);
  //     }
  //   });
  //   custRef
  //     .collection("transactions")
  //     .orderBy("timestamp", "desc")
  //     .onSnapshot((snap) => {
  //       const transactions = [];
  //       setSent(0);
  //       setReceived(0);
  //       snap.forEach((doc) => {
  //         transactions.push({
  //           id: doc.id,
  //           amount: doc.data().amount,
  //           receipt: doc.data().receipt,
  //           timestamp: doc.data().timestamp,
  //           desc: doc.data().desc,
  //         });
  //         doc.data().amount >= 0
  //           ? setReceived((prev) => prev + Number(doc.data().amount))
  //           : setSent((prev) => prev - Number(doc.data().amount));
  //       });
  //       setTrans(transactions);
  //       setTransLoading(false);
  //     });
  //   return function cleanup() {
  //     setTrans([]);
  //     setName("");
  //   };
  // }, [user, custID]);
  // // // // // // // // // // // // // // // // // //
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
              <DisplayTransaction
                key={t.id}
                details={t}
                userName={user?.name}
              />
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
