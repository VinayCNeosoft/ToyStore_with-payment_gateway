import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Row,
  Col,
  Alert,
  Accordion,
} from "react-bootstrap";
import Stepper from "react-stepper-horizontal";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getOrderDetails } from "../../config/NodeService";
import jwt_decode from "jwt-decode";
import avatar from "../../uploads/default_av.png";
import { getCustomer } from "../../config/NodeService";
import {
  FaShoppingCart,
  FaUserCircle,
  FaAddressCard,
  FaExchangeAlt,
  FaUserEdit,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { downloadPdf } from "./generatePdf";

function Orders() {
  const [user, setUser] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    gender: "",
    image: "",
    dob: "",
  });
  const [uid, setUid] = useState(null);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState();
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState([]);
  const [orderCart, setOrderCart] = useState([]);
  const [orderIsEmpty, setOrderIsEmpty] = useState(true);
  const [logo, setLogo] = useState(true);
  const [ifUser, setIfUser] = useState(true);
  const ref = React.createRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // check useEffect of Order
  useEffect(() => {
    let t = JSON.parse(localStorage.getItem("token") !== null);
    console.log(t);
    if (t) {
      console.log("token found");
      let token = localStorage.getItem("token");
      let decode = jwt_decode(token);
      console.log(decode.uid);
      setUid(decode.uid);
      getCustomer(decode.uid).then((res) => {
        console.log(res.data);
        if (res.data.success === true) {
          console.log("inside user True if");
          setUser({
            ...user,
            email: res.data.data.email,
            fname: res.data.data.fname,
            lname: res.data.data.lname,
            mobile: res.data.data.mobile,
            gender: res.data.data.gender,
            image: res.data.data.logo,
            dob: res.data.data.dob,
          });
          console.log(res.data.data.logo);
          if (res.data.data.logo === undefined) {
            console.log("profile pic not present");
            setLogo(true);
          } else {
            console.log("profile pic present");
            setLogo(false);
          }
        } else if (res.data.success === false) {
          console.log(res.data);
          alert(`${res.data.message}`);
        }
      });
      setIfUser(true);
      const getcart = JSON.parse(localStorage.getItem("cart"));
      if (getcart) {
        setCart(getcart);
        const count = JSON.parse(localStorage.getItem("cart"))
          .map((item) => Number(item.quantity))
          .reduce((prev, curr) => prev + curr, 0);
        console.log("count" + count);
        dispatch({ type: "count", payload: count });
      }
    } else if (!t) {
      console.log("token not present");
      setIfUser(false);
      if (JSON.parse(localStorage.getItem("cart") === null)) {
        setOrderIsEmpty(true);
      } else {
        setOrderIsEmpty(false);
        const getcart = JSON.parse(localStorage.getItem("cart"));
        if (getcart) {
          setCart(getcart);
          const count = JSON.parse(localStorage.getItem("cart"))
            .map((item) => Number(item.quantity))
            .reduce((prev, curr) => prev + curr, 0);
          console.log("count" + count);
          dispatch({ type: "count", payload: count });
        }
      }
    }
  }, [logo]);

  useEffect(() => {
    let t = JSON.parse(localStorage.getItem("token") !== null);
    console.log(t);
    if (t) {
      console.log("token found");
      setIfUser(true);
      const getcart = JSON.parse(localStorage.getItem("cart"));
      if (getcart) {
        setCart(getcart);
        const count = JSON.parse(localStorage.getItem("cart"))
          .map((item) => Number(item.quantity))
          .reduce((prev, curr) => prev + curr, 0);
        console.log("count" + count);
        dispatch({ type: "count", payload: count });
      }
      let user = JSON.parse(localStorage.getItem("user"));
      getOrderDetails(user.email).then((res) => {
        console.log(res.data);
        if (res.data.success === true) {
          setOrderIsEmpty(false);
          setOrders(res.data.data.order);
          console.log(res.data.data.order);
        } else if (res.data.success === false) {
          console.log("order is empty");
          setOrderIsEmpty(true);
          toast(`${res.data.message}`);
        } else {
          console.log("");
        }
      });
    } else if (!t) {
      console.log("token not present");
      setIfUser(false);
      if (JSON.parse(localStorage.getItem("cart") === null)) {
        setOrderIsEmpty(true);
      } else {
        setOrderIsEmpty(false);
        const getcart = JSON.parse(localStorage.getItem("cart"));
        if (getcart) {
          setCart(getcart);
          const count = JSON.parse(localStorage.getItem("cart"))
            .map((item) => Number(item.quantity))
            .reduce((prev, curr) => prev + curr, 0);
          console.log("count" + count);
          dispatch({ type: "count", payload: count });
        }
      }
    }
  }, []);

  const profile = () => {
    navigate("/profile");
  };
  const changePassword = () => {
    navigate("/changepassword");
  };
  const gotoOrders = () => {
    navigate("/order");
  };
  const gotoAddress = () => {
    navigate("/address");
  };
  const downLoadPDF = (user, address, cart, total) => {
    console.log(user, address, cart, total);
    downloadPdf(user, address, cart, total);
  };
  console.log(orders.cart);
  const date = new Date();
  const setDate =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  console.log(setDate);
  return (
    <>
      {ifUser ? (
        <>
          <h1 className="text-center text-secondary">My Account</h1>
          <Container>
            <Row>
              <Col sm={4}>
                <div>
                  <Container className="border border-secondary text-center">
                    <br />
                    {logo ? (
                      <>
                        <img
                          src={avatar}
                          height={"100hv"}
                          width={"auto"}
                          alt="not Found"
                        />
                        <br />
                        <br />
                      </>
                    ) : (
                      <>
                        <img
                          src={user.image}
                          height={"100hv"}
                          width={"auto"}
                          alt="not Found"
                        />
                        <br />
                        <br />
                      </>
                    )}
                    <div className="profile-btn" onClick={profile}>
                      <FaUserCircle /> Profile
                    </div>
                    <br />
                    <div
                      className="profile-btn btn-primary"
                      onClick={gotoOrders}
                    >
                      <FaShoppingCart /> Orders
                    </div>
                    <br />
                    <div className="profile-btn" onClick={gotoAddress}>
                      <FaAddressCard /> Address
                    </div>
                    <br />
                    <div className="profile-btn" onClick={changePassword}>
                      <FaExchangeAlt /> Change Password
                    </div>
                    <br />
                  </Container>
                </div>
              </Col>
              <Col sm={8}>
                <div>
                  <Container className="border border-secondary">
                    {!orderIsEmpty ? (
                      <>
                        <div>
                          <h2 className="text-center">Order Available</h2>
                        </div>
                        {orders.map((_order, d) => (
                          <Accordion key={_order.orderId}>
                            <Accordion.Item eventKey="0">
                              <Accordion.Header>
                                Order ID : {_order.orderId} <br /> Placed On :{" "}
                                {setDate} &nbsp; ₹{_order.total}
                              </Accordion.Header>
                              <Accordion.Body>
                                <Container>
                                  {_order.cart.map((cart, id) => (
                                    <div key={id}>
                                      <img
                                        src={cart.product_image}
                                        style={{
                                          borderRadius: "20px",
                                          margin: "20px",
                                        }}
                                        alt="Not found"
                                        width="150"
                                        height="150"
                                      ></img>
                                    </div>
                                  ))}
                                </Container>
                                <br />
                                <div className="text-center">
                                  <Button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      downLoadPDF(
                                        user,
                                        _order.address,
                                        _order.cart,
                                        _order.total,
                                        _order.orderId
                                      )
                                    }
                                  >
                                    <FaUserEdit />
                                    Download Invoice as PDF
                                  </Button>
                                </div>
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        ))}
                      </>
                    ) : (
                      <>
                        <h2 className="text-center">No Previous Order Found</h2>
                      </>
                    )}
                    <hr />
                    <br />
                  </Container>
                </div>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <>
          <div className="text-center text-danger" style={{ height: "31vh" }}>
            <h1>Please Log in to See Your Orders !</h1>
          </div>
        </>
      )}
    </>
  );
}

export default Orders;
