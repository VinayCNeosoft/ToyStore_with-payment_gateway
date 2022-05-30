import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Accordion,
  Form,
  Button,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  addAddr,
  editAdd,
  getCustAddress,
  getSingleAddress,
} from "../../config/NodeService";
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import jwt_decode from "jwt-decode";

const RegForCountry = RegExp("^[a-zA-Z]{2,}$");
const RegForState = RegExp("^[a-zA-Z]{2,}$");
const RegForCity = RegExp("^[a-zA-Z]{2,}$");
const RegForPincode = RegExp("^[0-9]{6}$");

function EditAddress(props) {
  const [uid, setUid] = useState(null);

  const [allAddress, setAllAddress] = useState([]);
  console.log(props.address);
  const { id, address, city, pincode, state, country } = props.address;
  const { changer } = props;
  const [values, setValues] = useState({
    _id: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  const [errors, setErrors] = useState({
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  //useRef Assigning
  const _id = useRef(null);
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
      /* const single_addr_id = localStorage.getItem("addr_id")
            getSingleAddress(single_addr_id)
            .then(res=>{
                if(res.data.success===true){
                    console.log(JSON.stringify(res.data.data.address))
                    setAllAddress(res.data.data.address)
                    // console.log(res.data.data.address.street)
                    //setUser({email:res.data.data.email,fname:res.data.data.fname,lname:res.data.data.lname,mobile:res.data.data.mobile,gender:res.data.data.gender})
                }
                else if(res.data.success===false){
                    console.log(res.data)
                    alert(`${res.data.message}`)
                }
                else{
                    console.log("")
                }
            }) */
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

  const updateAddress = () => {
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
        // handleClose()
        editAdd({ ...values, id: id }).then((res) => {
          if (res.data.success === true) {
            console.log(res.data);
            handleClose();
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
    navigate("/address");
  };

  return (
    <>
      <br />
      <Container>
        {/*   <h4>My Account</h4>
            <hr/> */}
        <Container>
          <Row>
            {/* <Col xs={4} md={2}>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Orders</Accordion.Header>
                        <Accordion.Body>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                    <br/>
                <Accordion defaultActiveKey={['0']} alwaysopen="true">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Account</Accordion.Header>
                        <Accordion.Body>
                            <Row>
                                <Col><Link to="/profile" className='address'>Profile</Link></Col>
                                <Col><Link to="/address" className='address'>Address</Link></Col>
                            </Row>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                </Col> */}
            <Col xs={12} md={10}>
              <div className="Edit_add_div">
                <h2 className="text-center">Edit Address</h2>
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
                      defaultValue={address}
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
                      defaultValue={pincode}
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
                      defaultValue={city}
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
                      defaultValue={state}
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
                      defaultValue={country}
                    ></Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {errors.country}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className="text-center">
                    <Button
                      variant="primary"
                      className="reg-btn"
                      onClick={updateAddress}
                    >
                      <FaSave /> Update
                    </Button>
                    <span style={{ marginLeft: "20px" }}>
                      <Button
                        variant="primary"
                        className="reg-btn"
                        onClick={() => changer()}
                      >
                        <MdCancel /> Cancel
                      </Button>
                    </span>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
      <br />
    </>
  );
}

export default EditAddress;
