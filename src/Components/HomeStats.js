import { Statistic } from "antd";
import React from "react";
import "../assets/css/HomeStats.css";

function HomeStats({ sent, received }) {
  return (
    <div className="numbers">
      <div className="number__item">
        <Statistic
          title="Received"
          value={received}
          valueStyle={{ color: "#3f8600", textAlign: "center" }}
        />
      </div>
      <div className="number__item">
        <Statistic
          title="Sent"
          value={sent}
          valueStyle={{ color: "#cf1322", textAlign: "center" }}
        />
      </div>
      <div className="number__item">
        <Statistic
          title="Balance"
          value={received - sent}
          valueStyle={{ color: "#2196f3", textAlign: "center" }}
        />
      </div>
    </div>
  );
}

export default HomeStats;
