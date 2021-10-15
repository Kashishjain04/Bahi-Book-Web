import React from "react";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import "../assets/css/CustomerCard.css";

function AddCard({ onClick }) {
  return (
    <div onClick={onClick} className="customer__card add">
      <PlusOutlined className="add__icon" />
    </div>
  );
}

export default AddCard;
