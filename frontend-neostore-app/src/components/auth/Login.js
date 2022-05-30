import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { fetchCartArray, loginUser, addToCart } from "../../config/NodeService";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./auth.css";

//RegEx for Validation
const RegForEmail = RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$");
const RegForPassword = RegExp("^[a-zA-Z0-9@*!&%$]{8,15}$");

function Login() {
  //State Variables
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [uid, setUid] = useState(null);

  //useRef Assigning
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  /* useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    } else {
      navigate("/login");
    }
    // eslint-disable-next-line
  }, []); */

  //handler function to perform validation
  const handler = (e) => {
    let name = e.target.name;
    switch (name) {
      case "email":
        setErrors({
          ...errors,
          email: RegForEmail.test(emailRef.current.value)
            ? ""
            : "Please Enter Email in correct format",
        });
        setValues({ ...values, email: emailRef.current.value });
        break;
      case "password":
        setErrors({
          ...errors,
          password: RegForPassword.test(passwordRef.current.value)
            ? ""
            : "Please Enter Password in Alphanumeric and Symbols",
        });
        setValues({ ...values, password: passwordRef.current.value });
        break;
      default:
        break;
    }
  };

  //formSubmit function to submit values to server
  const formSubmit = () => {
    if (values.email !== "" && values.password !== "") {
      if (errors.email === "" && errors.password === "") {
        console.log(values);
        loginUser(values).then((res) => {
          if (res.data.success === true) {
            console.log(res.data);
            console.log(res.data.user.role);
            console.log(res.data.user);
            localStorage.setItem(
              "user",
              JSON.stringify({
                fname: res.data.user.fname,
                lname: res.data.user.lname,
                email: res.data.user.email,
                mobile: res.data.user.mobile,
                gender: res.data.user.gender,
                image: res.data.user.logo,
                role: res.data.role,
              })
            );
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("email", values.email);
            localStorage.setItem("status", "isLogged");
            localStorage.setItem("role", res.data.user.role);
            let token = localStorage.getItem("token");
            let decode = jwt_decode(token);
            console.log(decode);
            setUid(decode);
            if (res.data.user.role === "admin") {
              dispatch({ type: "admin", payload: true });
              navigate("/adminDashboard");
              toast(`${res.data.message}`);
            } else {
              dispatch({ type: "admin", payload: false });
              navigate("/");
              toast(`${res.data.message}`);
            }
          }
          if (res.data.success === false) {
            console.log(res.data);
            toast(`${res.data.message}`);
          }
        });
      } else {
        alert("Input Fields must not be blank");
      }
    } else {
      alert("Input Field must not be blanked");
    }
  };

  return (
    <>
      {/* <Container fluid style={{backgroundImage:`url("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapertag.com%2Fwallpaper%2Ffull%2Fb%2Fc%2F9%2F514414-widescreen-stage-background-images-1920x1200.jpg&f=1&nofb=1")`,backgroundSize: "cover",backgroundPosition:"center",paddingTop:"3em",paddingBottom:"3em"}}> */}
      <Container>
        <div className="App">
          <h2 className="text-center text-danger">Login to NeoSTORE</h2>
          <Form className="form">
            <Form.Group className="mb-3">
              <Form.Label className="label">Email</Form.Label>
              <Form.Control
                type="text"
                name="email"
                ref={emailRef}
                isValid={values.email !== "" ? true : false}
                isInvalid={errors.email !== "" ? true : false}
                onChange={(e) => handler(e)}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="label">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                ref={passwordRef}
                isValid={values.password !== "" ? true : false}
                isInvalid={errors.password !== "" ? true : false}
                onChange={(e) => handler(e)}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="text-center">
              <Button onClick={formSubmit} variant="info" className="log-btn">
                Login
              </Button>
              <span style={{ marginLeft: "20px", textDecoration: "none" }}>
                <Link to="/register" className="label">
                  New User ? Click to Register
                </Link>
              </span>{" "}
              |{" "}
              <span>
                <Link to="/forgetpassword" className="label">
                  Forget Password
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </Container>
    </>
  );
}

export default Login;
