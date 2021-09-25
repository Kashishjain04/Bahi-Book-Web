import { useState } from "react";
import "../assets/css/Contact.css";
import { Modal } from "@material-ui/core";
import { useHistory } from "react-router";

const ContactPage = () => {
  const history = useHistory(),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [message, setMessage] = useState(""),
    [modal, setModal] = useState(false);
  return (
    <div className="contactPage">
      <Modal
        open={modal}
        onClose={() => {
          setModal(false);
          history.replace("/");
        }}
        aria-labelledby="add-customer"
        aria-describedby="simple-modal-description"
      >
        <div className="contactPage">
          <div className="contactPage__modal">
            <h2 id="simple-modal-title">Thank you for contacting us!</h2>
            <button onClick={() => history.replace("/")}>Go back to home page</button>
          </div>
        </div>
      </Modal>
      <div className="contactPage__wrapper">
        <h1>Contact Us</h1>
        <form
          className="contactPage__form"
          onSubmit={(e) => {
            e.preventDefault();
            setModal(true);
          }}
        >
          <label>Email</label>
          <input
            type="email"
            placeholder="placeholder@email.com"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Name</label>
          <input
            type="text"
            placeholder="John Smith"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Message</label>
          <textarea
            placeholder="Your Message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
