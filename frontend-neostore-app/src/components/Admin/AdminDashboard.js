import React, { useEffect, useState, useRef } from "react";
import { Form, Button, Container, Col, Card, Row } from "react-bootstrap";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addProduct,
  commonProduct,
  deleteProd,
  updateProd,
} from "../../config/NodeService";

import "./adminDash.css";

export const AdminDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [viewAddProductForm, setViewAddProductForm] = useState(false);
  const [fetchAllProd, setFetchAllProd] = useState([]);
  const [update, setUpdateButton] = useState(false);
  const [values, setValues] = useState({
    product_name: "",
    product_image: "",
    product_desc: "",
    product_cost: "",
    product_producer: "",
    _id: "",
  });
  const [errors, setErrors] = useState({
    product_name: "",
    product_image: "",
    product_desc: "",
    product_cost: "",
    product_producer: "",
  });

  //useRef Assigning
  const product_nameRef = useRef(null);
  const product_descRef = useRef(null);
  const product_costRef = useRef(null);
  const product_producerRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    let role = localStorage.getItem("role");
    let token = localStorage.getItem("token");

    if (token && role === "admin") {
      commonProduct().then((res) => {
        if (res.data.success === true) {
          console.log(res.data.allProd);
          setFetchAllProd(res.data.allProd);
        } else if (res.data.success === false) {
          console.log(res.data);
          toast(`${res.data.message}`);
        } else {
          console.log("");
        }
      });
      navigate("/adminDashboard");
    } else if (token && role === "user") {
      navigate("/");
    } else {
      <Outlet />;
    }
    // eslint-disable-next-line
  }, []);

  const handler = (e) => {
    let name = e.target.name;
    switch (name) {
      case "product_name":
        setErrors({
          ...errors,
          //  addressRef.current.value.length > 7
          product_name:
            product_nameRef.current.value.length > 5
              ? ""
              : " * Please Enter valid Product Name",
        });
        setValues({ ...values, product_name: product_nameRef.current.value });
        break;
      case "product_desc":
        setErrors({
          ...errors,
          product_desc:
            product_descRef.current.value.length >= 10
              ? ""
              : " * Please Enter some Product Description",
        });
        setValues({ ...values, product_desc: product_descRef.current.value });
        break;
      case "product_cost":
        setErrors({
          ...errors,
          product_cost:
            product_costRef.current.value.length >= 2
              ? ""
              : "* Please input valid cost",
        });
        setValues({ ...values, product_cost: product_costRef.current.value });
        break;
      case "product_producer":
        setErrors({
          ...errors,
          product_producer:
            product_producerRef.current.value.length > 5
              ? ""
              : "* Please Enter product producer",
        });
        setValues({
          ...values,
          product_producer: product_producerRef.current.value,
        });
        break;
      default:
        break;
    }
  };

  //add product function to add values to server
  const formSubmit = () => {
    let imagedatanew = document.querySelector('input[type="file"]').files[0];
    if (
      values.product_name !== "" &&
      values.product_desc !== "" &&
      values.product_cost !== "" &&
      values.product_producer !== ""
    ) {
      if (
        errors.product_name === "" &&
        errors.product_desc === "" &&
        errors.product_cost === "" &&
        errors.product_producer === ""
      ) {
        let formDataNew = new FormData();
        formDataNew.append("product_name", values.product_name);
        formDataNew.append("product_desc", values.product_desc);
        formDataNew.append("product_cost", values.product_cost);
        formDataNew.append("product_producer", values.product_producer);
        formDataNew.append("productImage", imagedatanew);
        console.log(formDataNew);
        const config = {
          headers: {
            "Content-Type":
              "multipart/form-data; boundary=AaB03x" +
              "--AaB03x" +
              "Content-Disposition: file" +
              "Content-Type: png" +
              "Content-Transfer-Encoding: binary" +
              "...data... " +
              "--AaB03x--",
            Accept: "application/json",
            type: "formData",
            Authentication: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        addProduct(formDataNew, config).then((res) => {
          if (res.data.success === true) {
            console.log(res.data);
            toast(`${res.data.message}`);
            setViewAddProductForm(false);
            setFetchAllProd(res.data.allProd);
          } else if (res.data.success === false) {
            console.log(res.data);
            toast(`${res.data.message}`);
          }
        });
      } else {
        toast("Validation Error");
      }
    } else {
      toast("Input Fields must not be blank");
    }
  };
  //remove product from db
  const handleRemoveProduct = (index) => {
    if (window.confirm("Are you sure you want to delete this entry ?")) {
      console.log(index);
      //   const fetchAllProd = fetchAllProd.filter((item) => item._id !== index);
      deleteProd(index).then((res) => {
        if (res.data.success === true) {
          console.log(res.data);
          toast(`${res.data.message}`);
          setFetchAllProd(res.data.allProd);
        } else if (res.data.success === false) {
          console.log(res.data);
          toast(`${res.data.message}`);
        }
      });
    } else {
      toast("Operation Cancel");
    }
  };

  //edit projects data
  const handleEditProduct = (data) => {
    console.log(data);
    setViewAddProductForm(true);
    setValues(data);
    setUpdateButton(true);
  };

  const updateProduct = () => {
    let imagedatanew = document.querySelector('input[type="file"]').files[0];
    if (
      values.product_name !== "" &&
      values.product_desc !== "" &&
      values.product_cost !== "" &&
      values.product_producer !== "" &&
      values._id !== ""
    ) {
      if (
        errors.product_name === "" &&
        errors.product_desc === "" &&
        errors.product_cost === "" &&
        errors.product_producer === ""
      ) {
        let formDataNew = new FormData();
        formDataNew.append("_id", values._id);
        formDataNew.append("product_name", values.product_name);
        formDataNew.append("product_desc", values.product_desc);
        formDataNew.append("product_cost", values.product_cost);
        formDataNew.append("product_producer", values.product_producer);
        formDataNew.append("productImage", imagedatanew);
        console.log(formDataNew);
        const config = {
          headers: {
            "Content-Type":
              "multipart/form-data; boundary=AaB03x" +
              "--AaB03x" +
              "Content-Disposition: file" +
              "Content-Type: png" +
              "Content-Transfer-Encoding: binary" +
              "...data... " +
              "--AaB03x--",
            Accept: "application/json",
            type: "formData",
            Authentication: `Bearer ${localStorage.getItem("token")}`,
          },
        };
        updateProd(formDataNew, values._id).then((res) => {
          if (res.data.success === true) {
            console.log(res.data);
            toast(`${res.data.message}`);
            setViewAddProductForm(false);
            setFetchAllProd(res.data.allProd);
          } else if (res.data.success === false) {
            console.log(res.data);
            toast(`${res.data.message}`);
          }
        });
      } else {
        toast("Validation Error");
      }
    } else {
      toast("Input Fields must not be blank");
    }
  };

  return (
    <div>
      <Container>
        <h1 className="text-center mt-5">
          Welcome {user.fname} <sup>(admin)</sup>
        </h1>
        {viewAddProductForm ? (
          <>
            <hr />
            <div className="App">
              <Form className="form" encType="multipart/form-data">
                <Form.Group className="mb-3">
                  <Form.Label className="label">Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={values.product_name}
                    name="product_name"
                    ref={product_nameRef}
                    isValid={values.product_name !== "" ? true : false}
                    isInvalid={errors.product_name !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.product_name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label className="label">
                    Product Description{" "}
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={values.product_desc}
                    placeholder="Enter Some Product Desc"
                    name="product_desc"
                    ref={product_descRef}
                    isValid={values.product_desc !== "" ? true : false}
                    isInvalid={errors.product_desc !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.product_desc}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="label">Product Cost</Form.Label>
                  <Form.Control
                    type="text"
                    name="product_cost"
                    value={values.product_cost}
                    ref={product_costRef}
                    isValid={values.product_cost !== "" ? true : false}
                    isInvalid={errors.product_cost !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.product_cost}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="label">Product Producer</Form.Label>
                  <Form.Control
                    type="text"
                    value={values.product_producer}
                    name="product_producer"
                    ref={product_producerRef}
                    isValid={values.product_producer !== "" ? true : false}
                    isInvalid={errors.product_producer !== "" ? true : false}
                    onChange={(e) => handler(e)}
                  ></Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.product_producer}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="label">Upload Product Pic</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/png, image/jpg, image/jpeg"
                  ></Form.Control>
                </Form.Group>

                {update ? (
                  <>
                    <div className="text-center">
                      <Button onClick={updateProduct} variant="success">
                        Update
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <Button
                        onClick={formSubmit}
                        variant="info"
                        className="reg-btn"
                        style={{ float: "left" }}
                      >
                        Add
                      </Button>
                    </div>
                    <div className="text-center">
                      <Button
                        onClick={() => setViewAddProductForm(false)}
                        variant="danger"
                        style={{ float: "right" }}
                        className="reg-btn"
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
                <br />
              </Form>
            </div>
            <br />
          </>
        ) : (
          <>
            <hr />
            <div className="text-center">
              <Button
                variant="outline-primary"
                onClick={() => setViewAddProductForm(true)}
              >
                Click Me to Add Product
              </Button>
            </div>
            <hr />
            <Container className="mx-auto">
              <Row xs={1} md={2} className="mx-auto p-1">
                {fetchAllProd.map((ele, id) => (
                  <Card
                    key={id}
                    style={{
                      width: "200px",
                      borderRadius: "25px",
                      border: "black solid 1px",
                    }}
                    className="m-1"
                  >
                    <Link to={`/product/${ele._id}`} key={id}>
                      <Card.Img
                        className="mt-1"
                        variant="top"
                        src={ele.product_image}
                        style={{
                          height: "300px",
                          borderRadius: "25px",
                          padding: "1em",
                          border: "black solid 1px",
                        }}
                      />
                    </Link>
                    <Card.Body>
                      <Card.Title style={{ height: "70px" }}>
                        {ele.product_name}
                      </Card.Title>
                      <div style={{ float: "left", display: "block" }}>
                        <Card.Text>
                          <b>₹ {ele.product_cost}/-</b>
                        </Card.Text>
                      </div>
                      <br />
                      <hr />

                      <div className="text-center">
                        <Button
                          style={{ float: "left" }}
                          variant="outline-info"
                          onClick={() => handleEditProduct(ele)}
                        >
                          Edit
                        </Button>
                        <Button
                          style={{ float: "right" }}
                          variant="outline-danger"
                          onClick={() => handleRemoveProduct(ele._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </Row>
            </Container>
            <br />
          </>
        )}
      </Container>
      <br />
    </div>
  );
};
