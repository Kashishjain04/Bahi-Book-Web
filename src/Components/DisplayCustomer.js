import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/CustomerCard.css";

function DisplayCustomer({ details }) {
  return (
    <Link className="customer__card" to={"/customer/" + details.id}>
      <h2>{details.name}</h2>
      <p>
        Balance:{" "}
        <span className={details.balance >= 0 ? "positive" : "negative"}>
          {details.balance}
        </span>
      </p>
    </Link>
  );
}

export default DisplayCustomer;
