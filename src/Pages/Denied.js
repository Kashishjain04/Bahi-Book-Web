import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import "../assets/css/NotFound.css";

function Denied() {
  return (
    <div className="notFound">
      <img alt="logo" height="300px" src="/denied.svg" />
      <h1 className="notFound__text">
        <p>ACCESS DENIED.</p>
        It's a 403 Error! <br />I can't let you in without logging in.
        <Link className="denied__redirect" to="/">
          <Button variant="outlined" color="secondary">
            Log In
          </Button>
        </Link>
      </h1>
    </div>
  );
}

export default Denied;
