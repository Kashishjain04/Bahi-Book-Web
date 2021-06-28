import { Statistic } from "antd";
import React from "react";
import ShowMoreText from "react-show-more-text";
import { ReceiptOutlined } from "@material-ui/icons";
import "../assets/css/TransactionCard.css";

function DisplayTransaction({ details }) {
  const validateImageUrl = (url) =>
    url.split("?")[0].match(/\.(jpeg|jpg|gif|png)$/) != null;

  return (
    <div className="trans__card">
      <p className="trans__time">
        {new Date(details.timestamp?.toDate()).toLocaleString()}
      </p>
      <div className="trans__details">
        <Statistic
          className={
            details.amount >= 0
              ? "positive trans__amount"
              : "negative trans__amount"
          }
          value={Math.abs(details.amount)}
        />
        {validateImageUrl(details.receipt) && (
          <a rel="noreferrer" href={details.receipt} target="_blank">
            <ReceiptOutlined className="trans__receipt" />
          </a>
        )}
        {details.desc !== "" && (
          <ShowMoreText
            className={
              details.receipt === "" ? "noreceipt trans__desc" : "trans__desc"
            }
            lines={2}
            more="More"
            less="Less"
            anchorClass="trans__desc"
            expanded={false}
          >
            {details.desc}
          </ShowMoreText>
        )}
      </div>
    </div>
  );
}

export default DisplayTransaction;
