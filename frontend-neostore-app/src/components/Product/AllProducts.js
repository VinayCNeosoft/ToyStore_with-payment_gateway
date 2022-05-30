import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Col, Row, Button, Card, ListGroup } from "react-bootstrap";
import { commonProduct } from "../../config/NodeService";
import StarRatings from "react-star-ratings";
import { useDispatch } from "react-redux";
import { FaArrowAltCircleUp, FaArrowCircleDown } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./pro.css";

function AllProducts(props) {
  const { search } = props;

  const [fetchAllProd, setFetchAllProd] = useState([]);
  const [catData, setCatData] = useState([]);
  const role = localStorage.getItem("role");

  const dispatch = useDispatch();
  const [arrlen, setArraylen] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    let t = localStorage.getItem("token");
    if (t && role === "user") {
      getData();
      if (localStorage.getItem("cart")) {
        let arr = JSON.parse(localStorage.getItem("cart"));
        let sum = 0;
        arr.map((d) => {
          sum = sum + d.quantity;
          localStorage.setItem("cartCount", sum);
          return sum;
        });
        // setQuant(sum)
        setArraylen(sum);
      }
    } else if (t && role === "admin") {
      navigate("/adminDashboard");
    } else {
      navigate("/commonproduct");
      getData();
      if (localStorage.getItem("cart")) {
        let arr = JSON.parse(localStorage.getItem("cart"));
        let sum = 0;
        arr.map((d) => {
          sum = sum + d.quantity;
          localStorage.setItem("cartCount", sum);
          return sum;
        });
        // setQuant(sum)
        setArraylen(sum);
      }
    }
  }, []);

  const getData = () => {
    commonProduct().then((res) => {
      if (res.data.success === true) {
        console.log(res.data.allProd);
        setFetchAllProd(res.data.allProd);
        const pdata = res.data.allProd.sort(
          (a, b) => parseFloat(b.product_rating) - parseFloat(a.product_rating)
        );
        setCatData(pdata);
      } else if (res.data.success === false) {
        console.log(res.data);
        toast(`${res.data.message}`);
      } else {
        console.log("");
      }
    });
  };

  const getAllProd = () => {
    setCatData(fetchAllProd);
    navigate("/commonproduct");
  };

  const sortbyIncreasingPrice = () => {
    console.log("Increasing order sort");
    const pdata = fetchAllProd.sort(
      (a, b) => parseInt(b.product_cost) - parseInt(a.product_cost)
    );
    console.log(pdata);
    setCatData(pdata);
    navigate("/commonproduct");
  };
  const sortbyDecreasingPrice = () => {
    console.log("Decreasing order sort");
    const pdata = fetchAllProd.sort(
      (b, a) => parseInt(b.product_cost) - parseInt(a.product_cost)
    );
    console.log(pdata);
    setCatData(pdata);
    navigate("/commonproduct");
  };
  // console.log(currentPageData)
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
        toast("Quantity Added !");
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
        toast("Product Added to Cart !");
        // dispatch({type:'COUNT',payload:1})
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
      toast("Product Added to Cart !");
      // dispatch({type:'COUNT',payload:1})
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
      {/* <Container fluid style={{backgroundImage:`url("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.hdqwalls.com%2Fwallpapers%2Ftexture-dark-gradient-5k-px.jpg&f=1&nofb=1")`,backgroundSize: "cover",backgroundPosition:"center",paddingTop:"3em",paddingBottom:"3em"}}> */}

      <h1 className="text-center text-danger">All Products</h1>
      <hr />
      <Container>
        <Row>
          <div>
            <span
              style={{
                display: "inline-flex",
                float: "right",
                marginRight: "10px",
              }}
            >
              <p style={{ marginRight: "20px" }}>
                {" "}
                ₹ :&nbsp;
                <span>
                  <FaArrowAltCircleUp onClick={() => sortbyIncreasingPrice()} />
                </span>
              </p>
              <p style={{ marginRight: "20px" }}>
                {" "}
                ₹ :&nbsp;
                <span>
                  <FaArrowCircleDown onClick={() => sortbyDecreasingPrice()} />
                </span>
              </p>
            </span>
          </div>

          <Col xs={12} md={12} lg={10} className="g-1">
            <Row xs={1} md={2} lg={5}>
              {catData
                .filter((ele) => {
                  if (
                    ele.product_name
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                    return ele;
                  return null;
                })

                .map((ele, id) => (
                  <Col key={id}>
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
                        <div className="text-center">
                          <Button
                            variant="danger"
                            style={{ width: "auto" }}
                            onClick={() => addToCart(ele, { quantity: 1 })}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      </Container>
      <hr />
      <br />
    </>
  );
}

export default AllProducts;
