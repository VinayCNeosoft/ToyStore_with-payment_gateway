import React, { useState, useRef } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { registerUser } from "../../config/NodeService";
import "./auth.css";

//RegEx for Validation
const RegForEmail = RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.com$");
const RegForName = RegExp("^[a-zA-Z]{3,10}$");
const RegForPassword = RegExp("^[a-zA-Z0-9@*!&%$]{8,15}$");
const RegForMobile = RegExp("^((\\+91-?)|0)?[0-9]{10}$");

function Register() {
  //State Variables
  const [values, setValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    cpassword: "",
    mobile: "",
    gender: "",
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    cpassword: "",
    mobile: "",
    gender: "",
  });

  //useRef Assigning
  const fnameRef = useRef(null);
  const lnameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const cpasswordRef = useRef(null);
  const mobileRef = useRef(null);

  const navigate = useNavigate();

  //handler function to perform validation
  const handler = (e) => {
    let name = e.target.name;
    switch (name) {
      case "fname":
        setErrors({
          ...errors,
          first_name: RegForName.test(fnameRef.current.value)
            ? ""
            : " * Please Enter valid First Name",
        });
        setValues({ ...values, first_name: fnameRef.current.value });
        break;
      case "lname":
        setErrors({
          ...errors,
          last_name: RegForName.test(lnameRef.current.value)
            ? ""
            : " * Please Enter valid Last Name",
        });
        setValues({ ...values, last_name: lnameRef.current.value });
        break;
      case "email":
        setErrors({
          ...errors,
          email: RegForEmail.test(emailRef.current.value)
            ? ""
            : "* Uh oh! Looks like there is an issue with your email. Please input a correct email.",
        });
        setValues({ ...values, email: emailRef.current.value });
        break;
      case "password":
        setErrors({
          ...errors,
          password: RegForPassword.test(passwordRef.current.value)
            ? ""
            : "* Please Enter Password in Alphanumeric and Symbols",
        });
        setValues({ ...values, password: passwordRef.current.value });
        break;
      case "cpassword":
        setErrors({
          ...errors,
          cpassword:
            values.password === cpasswordRef.current.value
              ? ""
              : "* Password and Confirm Password must be match",
        });
        setValues({ ...values, cpassword: cpasswordRef.current.value });
        break;
      case "mobile":
        setErrors({
          ...errors,
          mobile: RegForMobile.test(mobileRef.current.value)
            ? ""
            : "* Uh oh! Please input 10 digit correct mobile number.",
        });
        setValues({ ...values, mobile: mobileRef.current.value });
        break;
      case "gender":
        setErrors({
          ...errors,
          gender: e.target.value ? "" : "* Select one Option!",
        });
        setValues({ ...values, gender: e.target.value });
        break;
      default:
        break;
    }
  };

  //formSubmit function to submit values to server
  const formSubmit = () => {
    if (
      values.first_name !== "" &&
      values.last_name !== "" &&
      values.email !== "" &&
      values.password !== "" &&
      values.cpassword !== "" &&
      values.mobile !== "" &&
      values.gender !== ""
    ) {
      if (
        errors.first_name === "" &&
        errors.last_name === "" &&
        errors.email === "" &&
        errors.password === "" &&
        errors.cpassword === "" &&
        errors.mobile === ""
      ) {
        console.log(values);
        localStorage.setItem("email", values.email);
        registerUser(values).then((res) => {
          if (res.data.success === true) {
            console.log(res.data);
            toast(`${res.data.message}`);
            localStorage.setItem(
              "mail_VERIFICATION_TOKEN",
              `${res.data.email_verification_token}`
            );
            let e = localStorage.getItem("email_VERIFICATION_TOKEN");
            navigate("/login");
          } else if (res.data.success === false) {
            console.log(res.data);
            toast(`${res.data.message}`);
          }
        });
      } else {
        alert("Validation Error");
      }
    } else {
      alert("Input Fields must not be blank");
    }
  };

  return (
    <>
      <Container>
        <div className="App">
          <h2 className=" text-center text-danger">Register to NeoSTORE</h2>
          <Form className="form" encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label className="label">First Name</Form.Label>
              <Form.Control
                type="text"
                name="fname"
                ref={fnameRef}
                isValid={values.first_name !== "" ? true : false}
                isInvalid={errors.first_name !== "" ? true : false}
                onChange={(e) => handler(e)}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.first_name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="label">Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lname"
                ref={lnameRef}
                isValid={values.last_name !== "" ? true : false}
                isInvalid={errors.last_name !== "" ? true : false}
                onChange={(e) => handler(e)}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.last_name}
              </Form.Control.Feedback>
            </Form.Group>

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

            <Form.Group className="mb-3">
              <Form.Label className="label">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="cpassword"
                ref={cpasswordRef}
                isValid={values.cpassword !== "" ? true : false}
                isInvalid={errors.cpassword !== "" ? true : false}
                onChange={(e) => handler(e)}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.cpassword}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="label">Mobile</Form.Label>
              <Form.Control
                type="number"
                name="mobile"
                ref={mobileRef}
                isValid={values.mobile !== "" ? true : false}
                isInvalid={errors.mobile !== "" ? true : false}
                onChange={(e) => handler(e)}
              ></Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.mobile}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label className="label">Select Gender - &nbsp;</Form.Label>
              <input
                type="radio"
                value="Male"
                name="gender"
                onChange={(e) => handler(e)}
              />{" "}
              Male &nbsp;
              <input
                type="radio"
                value="Female"
                name="gender"
                onChange={(e) => handler(e)}
              />{" "}
              Female &nbsp;
            </Form.Group>
            <div>
              <Button
                onClick={formSubmit}
                variant="primary"
                className="reg-btn"
              >
                Register
              </Button>
              <span style={{ marginLeft: "20px" }}>
                <Link to="/login" className="label">
                  Already have an Account ?
                </Link>
              </span>
            </div>
          </Form>
        </div>
      </Container>
      <br />
    </>
  );
}

export default Register;
