import { Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React from "react";
import "../assets/css/TransactionCard.css";

function TransactionLoadingCard() {
  return (
    <div className="trans__card">
      <Typography
        className="trans__time"
        variant="caption"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "-7px",
        }}
      >
        <Skeleton width={"60%"} />
      </Typography>
      <div className="trans__details">
        <Typography
          style={{ flex: 1, display: "flex", justifyContent: "center" }}
          variant="h2"
        >
          <Skeleton width={"70%"} />
        </Typography>
        <Typography
          style={{ flex: 1, display: "flex", justifyContent: "center" }}
          variant="h2"
        >
          <Skeleton width={"100%"} />
        </Typography>
      </div>
    </div>
  );
}

export default TransactionLoadingCard;
