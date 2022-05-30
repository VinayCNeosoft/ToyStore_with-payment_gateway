import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { commonProduct, fetchCartArray } from "../../config/NodeService";
import { useDispatch, useSelector } from "react-redux";
import "./home.css";

function Dashboard(props) {
  const { search } = props;
  const [fetchAllProd, setFetchAllProd] = useState([]);
  const [arrlen, setArraylen] = useState(0);
  const [cart, setCart] = useState([]);
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useEffect(() => {
    let t = localStorage.getItem("token");
    if (t && role === "user") {
      console.log("Token Found");
      if (localStorage === null) {
        console.log("Cart is null");
      } else {
        fetchCartArray(localStorage.getItem("email")).then((res) => {
          if (res.data.success === true) {
            console.log(res.data.data.cart);
            let c = JSON.stringify(res.data.data.cart);
            console.log(c);
            console.log(res.data.message);
            localStorage.setItem("cart", c);
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
        });
      }
      getData();
      if (localStorage.getItem("cart") !== null) {
        let arr = JSON.parse(localStorage.getItem("cart"));
        let sum = 0;
        arr.map((d) => {
          sum = sum + d.quantity;
          localStorage.setItem("cartCount", sum);
          return sum;
        });
        setArraylen(sum);
      }
    } else if (t && role === "admin") {
      navigate("/adminDashboard");
    } else {
      console.log("Token Found");
      if (localStorage === null) {
        console.log("Cart is null");
      } else {
        fetchCartArray(localStorage.getItem("email")).then((res) => {
          if (res.data.success === true) {
            console.log(res.data.data.cart);
            let c = JSON.stringify(res.data.data.cart);
            console.log(c);
            console.log(res.data.message);
            localStorage.setItem("cart", c);
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
        });
      }
      getData();
      if (localStorage.getItem("cart") !== null) {
        let arr = JSON.parse(localStorage.getItem("cart"));
        let sum = 0;
        arr.map((d) => {
          sum = sum + d.quantity;
          localStorage.setItem("cartCount", sum);
          return sum;
        });
        setArraylen(sum);
      }
    }
  }, []);

  const getData = () => {
    commonProduct().then((res) => {
      if (res.data.success === true) {
        console.log(res.data.allProd);
        const pdata = res.data.allProd.sort(
          (a, b) => parseFloat(b.product_rating) - parseFloat(a.product_rating)
        );
        setFetchAllProd(pdata.slice(0, 7));
      } else if (res.data.success === false) {
        console.log(res.data);
        alert(`${res.data.message}`);
      } else {
        console.log("");
      }
    });
  };

  const addToCart = (prod, quant) => {
    let _id = prod._id;
    let product_name = prod.product_name;
    let product_producer = prod.product_producer;
    let product_cost = prod.product_cost;
    let product_image = prod.product_image;
    let product_stock = prod.product_stock;
    let quantity = quant.quantity;
    let prod_status = 0;
    console.log(
      _id,
      product_name,
      product_cost,
      product_image,
      quantity,
      product_producer,
      product_stock
    );
    if (localStorage.getItem("cart") !== null) {
      let arr = JSON.parse(localStorage.getItem("cart"));
      console.log(arr);
      if (arr.some((e) => e._id === _id)) {
        arr.map((d) => {
          if (d._id === _id) {
            return (
              (d.quantity = d.quantity + 1),
              (prod_status = product_stock - 1),
              (quantity = d.quantity)
            );
          }
          return arr;
        });
        localStorage.setItem("cart", JSON.stringify(arr));
        alert("Quantity Added !");
        let array = JSON.parse(localStorage.getItem("cart"));
        const count = array
          .map((item) => Number(item.quantity))
          .reduce((prev, curr) => prev + curr, 0);
        console.log("count" + count);
        dispatch({ type: "count", payload: count });
      } else {
        arr.push({
          _id,
          quantity,
          product_name,
          product_image,
          product_cost,
          product_producer,
        });
        localStorage.setItem("cart", JSON.stringify(arr));
        alert("Product Added to Cart !");
        let array = JSON.parse(localStorage.getItem("cart"));
        const count = array
          .map((item) => Number(item.quantity))
          .reduce((prev, curr) => prev + curr, 0);
        console.log("count" + count);
        dispatch({ type: "count", payload: count });
      }
    } else {
      let arr = [
        {
          _id,
          quantity,
          product_name,
          product_image,
          product_cost,
          product_producer,
        },
      ];
      arr.push();
      localStorage.setItem("cart", JSON.stringify(arr));
      alert("Product Added to Cart !");
      let array = JSON.parse(localStorage.getItem("cart"));
      const count = array
        .map((item) => Number(item.quantity))
        .reduce((prev, curr) => prev + curr, 0);
      console.log("count" + count);
      dispatch({ type: "count", payload: count });
    }
  };

  return (
    <>
      <Container fluid="true"></Container>
      {/* <Container fluid style={{backgroundImage:`url("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.hdqwalls.com%2Fwallpapers%2Ftexture-dark-gradient-5k-px.jpg&f=1&nofb=1")`,backgroundSize: "cover",backgroundPosition:"center",paddingTop:"3em",paddingBottom:"3em"}}> */}

      <Container className="mx-auto my-2 justify-content-md-center justify-content-lg-center">
        <h2 className="text-center text-warning">Popular Products</h2>

        <hr />
        <Row xs={1} md={2} lg={6} className="g-4 my-1">
          {fetchAllProd
            .filter((ele) => {
              if (ele.product_name.toLowerCase().includes(search.toLowerCase()))
                return ele;
              return null;
            })
            .map((ele, i) => (
              <Col key={i} className="m-2">
                <Card
                  key={i}
                  style={{
                    width: "200px",
                    borderRadius: "25px",
                    border: "black solid 1px",
                  }}
                  className="m-1"
                >
                  <Link to={`/product/${ele._id}`}>
                    <Card.Img
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
                    <div style={{ display: "block" }}>
                      <Card.Text>
                        <b>₹ {ele.product_cost}/-</b>
                      </Card.Text>
                    </div>
                    <br />
                    <div className="text-center">
                      <Button
                        variant="danger"
                        style={{ width: "auto" }}
                        onClick={() => addToCart(ele, { quantity: 1 })}
                      >
                        Add to Cart
                      </Button>
                      <Container></Container>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
        </Row>
      </Container>
      <br />
      <div className="text-center">
        <h4>
          <Link to="/commonproduct" className="share_link">
            Show More
          </Link>
        </h4>
      </div>
      {/* </Container> */}
    </>
  );
}

export default Dashboard;
