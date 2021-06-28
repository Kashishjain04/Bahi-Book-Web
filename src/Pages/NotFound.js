import { IconButton } from "@material-ui/core";
import { HomeOutlined } from "@ant-design/icons";
import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/NotFound.css";

function NotFound() {
  return (
    <div className="notFound">
      <IconButton className="notFound__redirect">
        <Link to="/">
          <HomeOutlined style={{ fontSize: "1.75rem" }} fontSize="2.75rem" />
        </Link>
      </IconButton>
      <img alt="logo" height="300px" src="/404.svg" />
      <h1 className="notFound__text">
        <p>AWWW...DON’T CRY.</p>
        It's just a 404 Error! <br />
        What you’re looking for may have been misplaced in Long Term Memory.
      </h1>
    </div>
  );
}

export default NotFound;
