import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";
import firebase from "../firebase";
import DisplayCustomer from "../Components/DisplayCustomer";
import AddCustomer from "../Components/AddCustomer";
import AddCustomerCard from "../Components/AddCard";
import { Avatar, IconButton, Modal } from "@material-ui/core";
import { LogoutOutlined } from "@ant-design/icons";
import "../assets/css/Home.css";
import HomeStats from "../Components/HomeStats";
import CustomerLoadingCard from "../Components/CustomerLoadingCard";
import Pusher from "pusher-js";
import { Link } from 'react-router-dom';
const auth = firebase.auth;

function HomePage() {
  const _isMounted = useRef(true),
    user = useSelector(selectUser),
    [sent, setSent] = useState(0),
    [received, setReceived] = useState(0),
    [customers, setCustomers] = useState([]),
    [modalVisible, setModalVisible] = useState(false),
    [custLoading, setCustLoading] = useState(true);

  useEffect(() => {
    const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "ap2",
    });

    const userDocChannel = pusher.subscribe("userDoc"),
      customersColChannel = pusher.subscribe("customersCol");

    userDocChannel.bind("update", ({ data }) => {
      setSent(data?.sent);
      setReceived(data?.received);
    });
    customersColChannel.bind("update", ({ data }) => {
      setCustomers(data);
      setCustLoading(false);
    });

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/userDoc`, {
      body: JSON.stringify({ user: user }),
      method: "POST",
      crossDomain: true,
      headers: { "Content-Type": "application/json" },
    }).catch((err) => console.log(err));

    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/customersCol`, {
      body: JSON.stringify({ user: user }),
      method: "POST",
      crossDomain: true,
      headers: { "Content-Type": "application/json" },
    }).catch((err) => console.log(err));

    return () => {
      _isMounted.current = false;
      setCustomers([]);
      setCustLoading(true);
      userDocChannel.unbind_all();
      userDocChannel.unsubscribe();
      customersColChannel.unbind_all();
      customersColChannel.unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    // Notification.requestPermission().catch((err) => console.log(err.code));
    // messaging()
    //   .getToken()
    //   .then((token) => {
    //     db()
    //       .collection("users")
    //       .doc(user.email)
    //       .update({
    //         fcmTokens: firebase.firestore.FieldValue.arrayUnion(token),
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err.code);
    //   });
    // // // // THIS IS HANDLED BY NODEJS BACKEND // // // // //
    // db()
    //   .collection("users")
    //   .doc(user.email)
    //   .onSnapshot((snap) => {
    //     setSent(snap.data()?.sent);
    //     setReceived(snap.data()?.received);
    //   });
    // db()
    //   .collection("users")
    //   .doc(user.email)
    //   .collection("customers")
    //   .onSnapshot((snap) => {
    //     const cst = [];
    //     snap.forEach((doc) => {
    //       cst.push({
    //         id: doc.id,
    //         name: doc.data().name,
    //         balance: doc.data().balance,
    //       });
    //     });
    //     setCustomers(cst);
    //     setCustLoading(false);
    //   });
    // // // // // // // // // // // // // // // // // // // // //
  }, [user]);

  const logout = () => {
    auth()
      .signOut()
      .catch((err) => console.log(err.message));
  };

  return (
    <div className="home">
      <div className="head">
        <Avatar className="avatar" alt={user.name} src={user.image} />
        <h2 className="head__text">{user.name}</h2>
        <IconButton className="logout" onClick={logout}>
          <LogoutOutlined />
        </IconButton>
      </div>
      <HomeStats sent={sent} received={received} />
      <h1 className="subheading">Customers</h1>
      <div className="customers">
        {custLoading === false ? (
          <>
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            {customers.map((cust) => (
              <DisplayCustomer key={cust.id} details={cust} />
            ))}
            <AddCustomerCard onClick={() => setModalVisible(true)} />
          </>
        ) : (
          <CustomerLoadingCard />
        )}
      </div>
      <Modal
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        aria-labelledby="add-customer"
        aria-describedby="simple-modal-description"
      >
        <AddCustomer hideModal={() => setModalVisible(false)} />
      </Modal>
      <div className="contactus-link">
        <Link to="/contact-us">Contact Us</Link>
      </div>
    </div>
  );
}

export default HomePage;
