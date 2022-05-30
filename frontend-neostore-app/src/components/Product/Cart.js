import React, { useRef, useState, useEffect } from "react";
import { Container, Table, Button, Row, Col, Alert } from "react-bootstrap";
import Stepper from "react-stepper-horizontal";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../config/NodeService";
import jwt_decode from "jwt-decode";

export const steperModel = (val, col) => {
  return (
    <>
      <Stepper
        steps={[
          { title: "Cart" },
          { title: "Delivery Address" },
          { title: "Place Order" },
        ]}
        activeStep={val}
        activeTitleColor={"#5096FF"}
        activeColor={"#5096FF"}
      />
    </>
  );
};

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState();
  const [gst, setGst] = useState();
  const [netTotal, setNetTotal] = useState();
  const [cartIsEmpty, setIsCartIsEmpty] = useState(true);
  const refQuantity = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let role = localStorage.getItem("role");
    let t = JSON.parse(localStorage.getItem("token") !== null);
    console.log(t);
    if (t && role === "user") {
      console.log(t);
      if (JSON.parse(localStorage.getItem("cart") !== null)) {
        setIsCartIsEmpty(false);
        const getcart = JSON.parse(localStorage.getItem("cart"));
        if (getcart) {
          setCart(getcart);
          const count = JSON.parse(localStorage.getItem("cart"))
            .map((item) => Number(item.quantity))
            .reduce((prev, curr) => prev + curr, 0);
          console.log("count" + count);
          dispatch({ type: "count", payload: count });
        }
        totalcalc();
      } else if (JSON.parse(localStorage.getItem("cart") === null)) {
        console.log(JSON.parse(localStorage.getItem("cart") !== null));
        setIsCartIsEmpty(true);
      }
    } else if (t && role === "admin") {
      navigate("/adminDashboard");
    } else {
      console.log(t);
      if (JSON.parse(localStorage.getItem("cart") === null)) {
        console.log(JSON.parse(localStorage.getItem("cart") === null));
        setIsCartIsEmpty(true);
      } else {
        setIsCartIsEmpty(false);
        const getcart = JSON.parse(localStorage.getItem("cart"));
        if (getcart) {
          setCart(getcart);
          const count = JSON.parse(localStorage.getItem("cart"))
            .map((item) => Number(item.quantity))
            .reduce((prev, curr) => prev + curr, 0);
          console.log("count" + count);
          dispatch({ type: "count", payload: count });
        }
        totalcalc();
      }
    }
  }, []);

  const cartDelete = (_id) => {
    const updatedCart = cart.filter((item) => item._id !== _id);
    console.log(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
    const count = cart
      .map((item) => Number(item.quantity))
      .reduce((prev, curr) => prev + curr, 0);
    console.log("count" + count);
    dispatch({ type: "count", payload: count });
    totalcalc();
  };

  const quantityChange = (e, i) => {
    console.log(e.target.value);
    const updatedCart = cart;
    updatedCart[i].quantity = e.target.value;
    console.log(updatedCart);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(cart));

    const count = JSON.parse(localStorage.getItem("cart"))
      .map((item) => Number(item.quantity))
      .reduce((prev, curr) => prev + curr, 0);
    console.log("count" + count);
    dispatch({ type: "count", payload: count });
    totalcalc();
  };

  const totalcalc = () => {
    let total = 0;
    const getcart = JSON.parse(localStorage.getItem("cart"));
    getcart.forEach((data) => {
      total = total + data.quantity * data.product_cost;
    });
    console.log(total);
    setTotal(total);
    const GST_Amount = (total * 5) / 100;
    console.log(GST_Amount);
    setGst(parseInt(GST_Amount));
    const orderTotal = total + GST_Amount;
    setNetTotal(parseInt(orderTotal));
  };

  const checkout = () => {
    if (localStorage.getItem("token")) {
      console.log("valid user found");
      if (localStorage.getItem("cart") !== "") {
        console.log("cart is not empty");
        navigate("/checkout");
      } else {
        console.log("cart is empty please add product first");
      }
    } else {
      alert("Please Login to Place your order !");
      navigate("/login");
    }
  };

  if (!cartIsEmpty) {
    return (
      <div className="mt-2 container">
        {/* {steperModel(0)} */}
        <Stepper
          steps={[
            { title: "Cart" },
            { title: "Delivery Address" },
            { title: "Place Order" },
          ]}
          activeStep={0}
          activeTitleColor={"#5096FF"}
          activeColor={"#5096FF"}
        />
        <Row>
          <Col xs={12} md={8}>
            <Table
              className="my-3 mt-5"
              responsive="sm"
              striped
              borderless
              hover
            >
              <thead>
                <tr className="text-center">
                  {/* <th>#</th> */}
                  <th colSpan="2">Product Detail</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((cart, i) => (
                  <tr key={i}>
                    {/* <td>{i+1}</td> */}
                    <td>
                      <img
                        src={cart.product_image}
                        width="70"
                        height="70"
                      ></img>
                    </td>
                    <td>
                      {cart.product_name}
                      <br />
                      by <b>{cart.product_producer}</b>
                    </td>
                    <td> ₹ {cart.product_cost}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        onChange={(e) => quantityChange(e, i)}
                        ref={refQuantity}
                        defaultValue={cart.quantity}
                      />
                    </td>
                    <td>₹ {cart.product_cost * cart.quantity}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => cartDelete(cart._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                  {/* <td colSpan="5"><h2>Total:  ₹{total}</h2></td> */}
                  {/* <td colSpan="2"><Button variant="dark" size="lg" onClick={checkout}>Checkout</Button></td> */}
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col xs={12} md={4}>
            <Container
              style={{
                border: "1px solid black",
                borderRadius: "20px",
                padding: "15px",
              }}
              className="my-2 mt-5"
            >
              <h3 className="text-center">Review Order</h3>
              <Table responsive="sm">
                <tbody>
                  <tr className="text-center">
                    <td>
                      <b>Subtotal</b>
                    </td>
                    <td>
                      <b>{total}</b>
                    </td>
                  </tr>
                  <tr className="text-center">
                    <td>
                      <b>GST(5%)</b>
                    </td>
                    <td>
                      <b>{gst}</b>
                    </td>
                  </tr>
                  <tr className="text-center">
                    <td>
                      <b>Order Total</b>
                    </td>
                    <td>
                      <b>{netTotal}</b>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <div className="d-grid gap-2">
                <Button variant="primary" size="lg" onClick={() => checkout()}>
                  Proceed to Buy
                </Button>
              </div>
              <br />
            </Container>
            <br />
          </Col>
        </Row>
      </div>
    );
  } else {
    return (
      <div>
        <br />
        <br />
        <br />
        <Container>
          <Alert variant="warning">
            <Alert.Heading> Oops ! Cart is Empty </Alert.Heading>
            <hr />
          </Alert>
        </Container>
        <br />
        <br />
      </div>
    );
  }
}

export default Cart;
