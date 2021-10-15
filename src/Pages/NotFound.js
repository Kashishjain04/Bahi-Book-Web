import "../assets/css/NotFound.css";

function NotFound() {
  return (
    <div className="notFound">      
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
