import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Accordion,
  Form,
  Button,
  Modal,
  Table,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  addAddr,
  delAdd,
  editAdd,
  getCustAddress,
} from "../../config/NodeService";
import { FaSave, FaUserEdit } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import EditAddress from "./EditAddress";
import jwt_decode from "jwt-decode";

const RegForCountry = RegExp("^[a-zA-Z]{2,}$");
const RegForState = RegExp("^[a-zA-Z]{2,}$");
const RegForCity = RegExp("^[a-zA-Z]{2,}$");
const RegForPincode = RegExp("^[0-9]{6}$");

function Address() {
  const [uid, setUid] = useState(null);
  const [allAddress, setAllAddress] = useState([]);
  const [editAdd, setEditAdd] = useState(false);

  const [formVisibility, setFormVisibility] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [values, setValues] = useState({
    id: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  const [errors, setErrors] = useState({
    id: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  //useRef Assigning
  const addressRef = useRef(null);
  const pincodeRef = useRef(null);
  const cityRef = useRef(null);
  const stateRef = useRef(null);
  const countryRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") === "") {
      navigate("/");
    } else {
      let token = localStorage.getItem("token");
      let decode = jwt_decode(token);
      console.log(decode);
      console.log(decode.uid);
      setUid(decode.uid);
      getCustAddress(decode.uid).then((res) => {
        if (res.data.success === true) {
          setAllAddress(res.data.address);
          //setUser({email:res.data.data.email,fname:res.data.data.fname,lname:res.data.data.lname,mobile:res.data.data.mobile,gender:res.data.data.gender})
        } else if (res.data.success === false) {
          console.log(res.data);
          alert(`${res.data.message}`);
        } else {
          console.log("");
        }
      });
    }
  }, [navigate]);

  //handler function to perform validation
  const handler = (e) => {
    let name = e.target.name;
    switch (name) {
      case "address":
        setErrors({
          ...errors,
          address:
            addressRef.current.value.length > 5
              ? ""
              : " * Please Enter complete address",
        });
        setValues({ ...values, address: addressRef.current.value });
        break;
      case "pincode":
        setErrors({
          ...errors,
          pincode: RegForPincode.test(pincodeRef.current.value)
            ? ""
            : " * Please Enter valid 6 digit pin code",
        });
        setValues({ ...values, pincode: pincodeRef.current.value });
        break;
      case "city":
        setErrors({
          ...errors,
          city: RegForCity.test(cityRef.current.value)
            ? ""
            : "* Uh oh!  Please input a correct city name.",
        });
        setValues({ ...values, city: cityRef.current.value });
        break;
      case "state":
        setErrors({
          ...errors,
          state: RegForState.test(stateRef.current.value)
            ? ""
            : "* Please Enter valid state name",
        });
        setValues({ ...values, state: stateRef.current.value });
        break;
      case "country":
        setErrors({
          ...errors,
          country: RegForCountry.test(countryRef.current.value)
            ? ""
            : "* Country name must be valid",
        });
        setValues({ ...values, country: countryRef.current.value });
        break;
      default:
        break;
    }
  };

  const addAddress = () => {
    if (
      values.address !== "" &&
      values.pincode !== "" &&
      values.city !== "" &&
      values.state !== "" &&
      values.country !== ""
    ) {
      if (
        errors.address === "" &&
        errors.pincode === "" &&
        errors.city === "" &&
        errors.state === "" &&
        errors.country === ""
      ) {
        console.log(values);
        handleClose();
        addAddr(values, uid).then((res) => {
          if (res.data.success === true) {
            console.log(res.data);
            handleClose();
            getCustAddress(uid).then((res) => {
              if (res.data.success === true) {
                setAllAddress(res.data.address);
                //setUser({email:res.data.data.email,fname:res.data.data.fname,lname:res.data.data.lname,mobile:res.data.data.mobile,gender:res.data.data.gender})
              } else if (res.data.success === false) {
                console.log(res.data);
                alert(`${res.data.message}`);
              } else {
                console.log("");
              }
            });
            alert(res.data.message);
          } else if (res.data.success === false) {
            console.log(res.data);
            alert(`${res.data.msg}`);
          }
        });
      } else {
        alert("Validation Error");
      }
    } else {
      alert("Input Fields must not be blank");
    }
  };
  const handleClose = () => {
    setValues({ ...values, address: "" });
    setValues({ ...values, pincode: "" });
    setValues({ ...values, city: "" });
    setValues({ ...values, state: "" });
    setValues({ ...values, country: "" });
    setFormVisibility(false);
  };
  console.log(allAddress);

  const editAddress = (val) => {
    setEditAdd(val);
    /* localStorage.setItem("addr_id",addr_id)
        navigate("/editAddress") */
  };
  const updateAddress = () => {
    setShowEditForm(false);
  };
  const delAddress = (del_id) => {
    console.log(del_id);
    delAdd({ del_id }).then((res) => {
      if (res.data.success === true) {
        console.log(res.data);
        alert(res.data.message);
        getCustAddress(uid).then((res) => {
          if (res.data.success === true) {
            setAllAddress(res.data.address);
          } else if (res.data.success === false) {
            console.log(res.data);
            alert(`${res.data.message}`);
          } else {
            console.log("");
          }
        });
      } else if (res.data.success === false) {
        console.log(res.data);
        alert(`${res.data.msg}`);
      }
    });
  };
  const gotoOrders = () => {
    navigate("/order");
  };

  return (
    <>
      <br />
      <Container>
        <h4>My Account</h4>
        <hr />
        <Container>
          <Row>
            <Col xs={4} md={2}>
              <Accordion onClick={gotoOrders}>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Orders</Accordion.Header>
                  <Accordion.Body></Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <br />
              <Accordion defaultActiveKey={["0"]} alwaysopen="true">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Account</Accordion.Header>
                  <Accordion.Body>
                    <Row>
                      <Col>
                        <Link to="/profile" className="address">
                          Profile
                        </Link>
                      </Col>
                      <Col>
                        <Link to="/address" className="address">
                          Address
                        </Link>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
            <Col xs={12} md={10}>
              {!editAdd ? (
                <>
                  {!formVisibility ? (
                    <div className="text-center">
                      <Button
                        variant="info"
                        onClick={() => setFormVisibility(true)}
                      >
                        Add New Address
                      </Button>
                    </div>
                  ) : (
                    <div className="Edit_add_div">
                      <h2 className="text-center">Add New Address</h2>
                      <hr />
                      <Form
                        className="form_change"
                        id="my_form"
                        encType="multipart/form-data"
                      >
                        <Form.Group className="mb-3" as={Col}>
                          <Form.Label className="label">Address</Form.Label>
                          <Form.Control
                            type="text"
                            name="address"
                            as="textarea"
                            ref={addressRef}
                            isValid={values.address !== "" ? true : false}
                            isInvalid={errors.address !== "" ? true : false}
                            onChange={(e) => handler(e)}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.address}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="label">Pincode</Form.Label>
                          <Form.Control
                            type="number"
                            name="pincode"
                            ref={pincodeRef}
                            isValid={values.pincode !== "" ? true : false}
                            isInvalid={errors.pincode !== "" ? true : false}
                            onChange={(e) => handler(e)}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.pincode}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="label">City</Form.Label>
                          <Form.Control
                            type="text"
                            name="city"
                            ref={cityRef}
                            isValid={values.city !== "" ? true : false}
                            isInvalid={errors.city !== "" ? true : false}
                            onChange={(e) => handler(e)}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.city}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="label">State</Form.Label>
                          <Form.Control
                            type="text"
                            name="state"
                            ref={stateRef}
                            isValid={values.state !== "" ? true : false}
                            isInvalid={errors.state !== "" ? true : false}
                            onChange={(e) => handler(e)}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.state}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label className="label">Country</Form.Label>
                          <Form.Control
                            type="text"
                            name="country"
                            ref={countryRef}
                            isValid={values.country !== "" ? true : false}
                            isInvalid={errors.country !== "" ? true : false}
                            onChange={(e) => handler(e)}
                          ></Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {errors.country}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <div className="text-center">
                          <Button
                            variant="primary"
                            className="reg-btn"
                            onClick={addAddress}
                          >
                            <FaSave /> Save
                          </Button>
                          <span style={{ marginLeft: "20px" }}>
                            <Button
                              variant="primary"
                              className="reg-btn"
                              onClick={handleClose}
                            >
                              <MdCancel /> Cancel
                            </Button>
                          </span>
                        </div>
                      </Form>
                    </div>
                  )}
                  <hr />
                  <h2 className="text-center">All Address</h2>
                  <Col sm={4}>
                    {allAddress.map((d, index) => (
                      <div key={index} className="bordered">
                        <br />
                        <Table responsive="sm" style={{ border: "2px solid" }}>
                          <tbody>
                            <tr>
                              <td>
                                <b>{index + 1}</b>
                              </td>
                              <td style={{ textAlign: "right" }}>
                                <b>
                                  <Button
                                    className="btn btn-info"
                                    style={{ borderRadius: "25px" }}
                                    onClick={() => {
                                      setValues({
                                        id: d._id,
                                        address: d.street,
                                        pincode: d.pincode,
                                        city: d.city,
                                        state: d.state,
                                        country: d.country,
                                      });
                                      editAddress(true);
                                    }}
                                  >
                                    <FiEdit />
                                  </Button>
                                </b>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <b>Address : </b>
                              </td>
                              <td>
                                <b>{d.street}</b>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <b>Pincode : </b>
                              </td>
                              <td>
                                <b>{d.pincode}</b>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <b>City : </b>
                              </td>
                              <td>
                                <b>{d.city}</b>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <b>State : </b>
                              </td>
                              <td>
                                <b>{d.state}</b>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <b>Country :</b>
                              </td>
                              <td>
                                <b>{d.country}</b>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2} style={{ textAlign: "right" }}>
                                <b>
                                  <Button
                                    className="btn btn-danger"
                                    style={{ borderRadius: "25px" }}
                                    onClick={() => delAddress(d._id)}
                                  >
                                    <AiOutlineDelete />
                                  </Button>
                                </b>
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    ))}
                  </Col>
                </>
              ) : (
                <>
                  <EditAddress
                    address={values}
                    changer={() => editAddress(false)}
                  />
                </>
              )}
            </Col>
          </Row>
        </Container>
      </Container>
      <br />
    </>
  );
}

export default Address;
