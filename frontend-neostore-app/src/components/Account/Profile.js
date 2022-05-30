import React, { useState, useEffect } from "react";
import { Col, Container, Row, Button, Form } from "react-bootstrap";
import avatar from "../../uploads/default_av.png";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import {
  FaShoppingCart,
  FaUserCircle,
  FaAddressCard,
  FaExchangeAlt,
  FaUserEdit,
} from "react-icons/fa";
import { getCustomer, updateProfileImage } from "../../config/NodeService";
import PageNotFound from "../common_Components/PageNotFound";

function Profile() {
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
  const navigate = useNavigate();
  const [logo, setLogo] = useState(true);

  useEffect(() => {
    let role = localStorage.getItem("role");
    let t = JSON.parse(localStorage.getItem("token") !== null);
    if (t && role === "user") {
      let user = JSON.parse(localStorage.getItem("user"));
      getCustomer(user.email).then((res) => {
        console.log(res.data.success);
        if (res.data.success === true) {
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
        } else {
          console.log("");
        }
      });
    } else if (t && role === "admin") {
      navigate("/adminDashboard");
    } else {
      navigate("/");
    }
  }, [logo]);

  const photoUpload = (e) => {
    if (user.email !== "") {
      let formDataNew = new FormData();
      let imagedatanew = document.querySelector('input[type="file"]').files[0];
      formDataNew.append("email", user.email);
      formDataNew.append("profileImg", imagedatanew);
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
      updateProfileImage(formDataNew, config).then((res) => {
        console.log(res.data);
        alert(res.data.message);
        setLogo((prev) => !prev);
      });
    }
  };

  const profile = () => {
    navigate("/profile");
  };
  const changePassword = () => {
    navigate("/changepassword");
  };
  const editProfile = () => {
    navigate("/edit");
  };
  const gotoOrders = () => {
    navigate("/order");
  };
  const gotoAddress = () => {
    navigate("/address");
  };
  return (
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
                <div className="container">
                  <div className="avatar-upload">
                    <div className="avatar-edit">
                      <input type="file" />
                      <Button variant="success" onClick={photoUpload}>
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
                <br />
                <div className="profile-btn btn-primary" onClick={profile}>
                  <FaUserCircle /> Profile
                </div>
                <br />
                <div className="profile-btn" onClick={gotoOrders}>
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
                <h1 className="text-center">Profile</h1>
                <hr />
                <Container>
                  <Row>
                    <Col xs={6} md={4} sm={6}>
                      <h4>
                        <b>First Name : </b>
                      </h4>
                    </Col>
                    <Col xs={6} md={4} sm={4}>
                      <h5>{user.fname}</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={4} sm={6}>
                      <h4>
                        <b>Last Name : </b>
                      </h4>
                    </Col>
                    <Col xs={6} md={4}>
                      <h5>{user.lname}</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={4} sm={6}>
                      <h4>
                        <b>Email : </b>
                      </h4>
                    </Col>
                    <Col xs={6} md={4}>
                      <h5>{user.email}</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={4} sm={6}>
                      <h4>
                        <b>Mobile : </b>
                      </h4>
                    </Col>
                    <Col xs={6} md={4}>
                      <h5>{user.mobile}</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={4} sm={6}>
                      <h4>
                        <b>DOB : </b>
                      </h4>
                    </Col>
                    <Col xs={6} md={4}>
                      <h5>{user.dob ? <>{user.dob}</> : "1990-01-01"}</h5>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} md={4} sm={6}>
                      <h4>
                        <b>Gender : </b>
                      </h4>
                    </Col>
                    <Col xs={6} md={4}>
                      <h5>{user.gender}</h5>
                    </Col>
                  </Row>
                </Container>
                <hr />
                <div className="text-center">
                  <Button className="btn btn-success" onClick={editProfile}>
                    <FaUserEdit /> Edit
                  </Button>
                </div>
                <br />
              </Container>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Profile;
