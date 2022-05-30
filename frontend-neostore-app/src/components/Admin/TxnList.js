import React, { useState, useEffect } from "react";

import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Container,
  Col,
  Row,
  Button,
  Card,
  ListGroup,
  Table,
} from "react-bootstrap";
import { txnDetail } from "../../config/NodeService";
import { toast } from "react-toastify";

export const TxnList = () => {
  const [fetchTxn, setFetchTxn] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    let role = localStorage.getItem("role");
    let token = localStorage.getItem("token");

    if (token && role === "admin") {
      getData();
    } else if (token && role === "user") {
      navigate("/");
    } else {
      <Outlet />;
    }
  }, [navigate]);

  const getData = () => {
    txnDetail().then((res) => {
      if (res.data.success === true) {
        console.log(res.data.alltxn);
        setFetchTxn(res.data.alltxn);
      } else if (res.data.success === false) {
        console.log(res.data);
        toast(`${res.data.message}`);
      } else {
        console.log("");
      }
    });
  };
  console.log(fetchTxn);
  return (
    <>
      <Container>
        <h1 className="text-center m-3">All Transaction Detail</h1>
        <hr />
        <Table className="my-3 mt-5" responsive="sm" striped bordered hover>
          <thead>
            <tr className="text-center">
              <th>#</th>
              <th>Order ID</th>
              <th>Payment ID</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {fetchTxn.map((txn, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{txn.orderID}</td>
                <td>{txn.paymentID}</td>
                <td> ₹ {txn.total}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <br />
      </Container>
      <br />
    </>
  );
};
