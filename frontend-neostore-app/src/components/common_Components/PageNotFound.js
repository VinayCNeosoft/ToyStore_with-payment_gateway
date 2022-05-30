import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
function PageNotFound() {
  return (
    <div className="text-center container mt-5">
      <img src="https://i.gifer.com/7iJI.gif" alt="gif_ing" />
      <div className="content">
        <h1 className="main-heading">404 Page Not Found</h1>
        <p>We can't seem to find the page you are looking for</p>
        <Link to="/">
          <Button variant="primary">Back to home </Button>
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
