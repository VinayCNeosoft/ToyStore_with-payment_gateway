import React, { useRef, useState, useEffect } from "react";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import Stepper from "react-stepper-horizontal";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  getCustAddress,
  addToOrder,
  addToTxnList,
} from "../../config/NodeService";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import jwt_decode from "jwt-decode";
import Address from "../Account/Address";
import "react-credit-cards/es/styles-compiled.css";
import Cards from "react-credit-cards";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PlaceOrder() {
  const [user, setUser] = useState({});
  const [cartState, setCartState] = useState({
    cvv: "",
    expiry: "",
    focus: "",
    name: "",
    number: "",
  });
  const [uid, setUid] = useState(null);
  const [cart, setCart] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState();
  const [total, setTotal] = useState();
  const [gst, setGst] = useState();
  const [netTotal, setNetTotal] = useState();
  const [cartIsEmpty, setIsCartIsEmpty] = useState(true);
  const [isPaymentReceived, setIsPaymentReceived] = useState(false);
  const [activetep, setActiveStep] = useState(2);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") === "") {
      navigate("/");
    } else {
      setUser(JSON.parse(localStorage.getItem("user")));
      let token = localStorage.getItem("token");
      let decode = jwt_decode(token);
      console.log(decode.uid);
      setUid(decode.uid);
      const d = JSON.parse(localStorage.getItem("delivery_Address"));
      setDeliveryAddress(d);
    }
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
  }, []);

  console.log(cart);
  console.log(deliveryAddress);

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
    console.log(orderTotal);
  };

  // loadScript takes a script src string as input and returns a Promise that loads the script.
  async function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // creating a new order
    const result = await axios.post("http://localhost:7777/orders", {
      t: total,
    });

    if (!result) {
      alert("Server error. Are you online?");
      return;
    }

    // Getting the order details back
    const { amount, id: order_id, currency } = result.data;

    const options = {
      key: "rzp_test_lj6cMskxIlTt4w", // Enter the Key ID generated from the Dashboard
      amount: total.toString(),
      currency: currency,
      name: "Neostore",
      description: "Test Transaction",
      // image: { logo },
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
        };
        const result = await axios.post("http://localhost:7777/success", data);

        console.log(data);
        if (result.data.msg === "success") {
          placeOrder(data);
          toast(result.data.msg);
        } else {
          toast(result.data.msg);
        }
      },
      prefill: {
        name: `${user.fname} ${user.lname}`,
        email: user.email,
        contact: user.mobile,
      },
      notes: {
        address: "Ruby Tower, Mumbai",
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  async function placeOrder(data) {
    console.log(data);
    const orderData = {
      cart: cart,
      total: total,
      address: deliveryAddress,
      orderId: data.razorpayOrderId,
      paymentID: data.razorpayPaymentId,
    };
    console.log(orderData);
    addToTxnList(orderData);
    let d = { orderData: orderData, email: uid };
    addToOrder(d);
    let cartArray = [];
    let c = { cartArray: cartArray, email: uid };
    addToCart(c);
    localStorage.removeItem("cart");
    localStorage.removeItem("delivery_Address");
    const count = 0;
    dispatch({ type: "count", payload: count });
    setActiveStep(3);
    setIsPaymentReceived(true);
  }
  return (
    <>
      <div>
        <div className="mt-3 container text-center">
          <Stepper
            steps={[
              { title: "Cart" },
              { title: "Delivery Address" },
              { title: "Place Order" },
            ]}
            activeStep={activetep}
            completedStep={(0, 1)}
            completeColor={"#1cac78"}
            completeBarColor={"#1cac78"}
            activeColor={"#5096FF"}
          />
        </div>
        <br />

        {isPaymentReceived ? (
          <>
            <Container>
              <h2 className="text-center">
                Thank You :) your order has been placed !
              </h2>
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
                          <td>{cart.quantity}</td>
                          <td>₹ {cart.product_cost * cart.quantity}</td>
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
                    <h3 className="text-center">Total</h3>
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
                      {/* <Button variant='primary' size="lg" onClick={()=>checkout()}>Proceed to Buy</Button> */}
                    </div>
                    <br />
                  </Container>
                  <br />
                </Col>
              </Row>
            </Container>
          </>
        ) : (
          <>
            <h1 className="text-center text-success">Click To Pay</h1>

            <div className="text-center" size={"lg"}>
              <h1>
                <Button
                  onClick={displayRazorpay}
                  variant="outline-info"
                  size="lg"
                  style={{ borderRadius: "25px", color: "darkblue" }}
                >
                  Pay ₹ {total}
                </Button>
              </h1>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default PlaceOrder;
