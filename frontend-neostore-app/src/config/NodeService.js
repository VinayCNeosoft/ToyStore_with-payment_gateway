import axios from "axios";
import { MAIN_URL } from "./Url";

let email = localStorage.getItem("email");

//check token for auto-logout
export function tokenExist() {
  let token = localStorage.getItem("token");
  return axios.get(`${MAIN_URL}tokenExpire`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//register user
export function registerUser(data) {
  return axios.post(`${MAIN_URL}register`, data);
}

//login user
export function loginUser(data) {
  return axios.post(`${MAIN_URL}login`, data);
}

//verify email
export function verifyEmail(data) {
  console.log(data);
  return axios.post(`${MAIN_URL}email_Verification/${email}`, data);
}

//get state for verified email
export function getVerifyEmailState() {
  return axios.get(`${MAIN_URL}verifyState/${email}`);
}

//resend email verification mail
export function resend_VerifyEmail(data) {
  console.log(data);
  return axios.post(`${MAIN_URL}email_Verification`, data);
}

//forget password
export function forgetPassword(data) {
  return axios.post(`${MAIN_URL}forgetpassword`, data);
}

//reset password
export function resetPassword(data) {
  return axios.put(`${MAIN_URL}resetpassword`, data);
}

//get customer info
export function getCustomer(uid) {
  let token = localStorage.getItem("token");

  console.log(uid);
  return axios.get(`${MAIN_URL}getCustomerProfile/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//update password or change password
export function updatePassword(data, uid) {
  let token = localStorage.getItem("token");

  console.log(uid);
  return axios.post(`${MAIN_URL}changepassword/${uid}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//update user profile
export function updateuser(data, uid) {
  let token = localStorage.getItem("token");

  console.log(uid, data);
  return axios.put(`${MAIN_URL}profile/${uid}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
//updateProfileImage
export function updateProfileImage(formdata, config) {
  let token = localStorage.getItem("token");

  console.log(formdata, config);
  return axios.put(`${MAIN_URL}propic`, formdata, config, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//Add address
export function addAddr(data, uid) {
  let token = localStorage.getItem("token");

  console.log(data, uid);
  return axios.post(`${MAIN_URL}addAddress/${uid}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//get all customer address
export function getCustAddress(uid) {
  let token = localStorage.getItem("token");

  console.log(uid);
  return axios.get(`${MAIN_URL}getCustAddress/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//edit address
export function editAdd(data) {
  let token = localStorage.getItem("token");

  console.log(data);
  return axios.put(`${MAIN_URL}editAddress`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//delete address
export function delAdd(data) {
  let token = localStorage.getItem("token");

  console.log(data.del_id);
  return axios.delete(`${MAIN_URL}deleteAddress/${data.del_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//fetch all products
export function commonProduct() {
  return axios.get(`${MAIN_URL}commonproducts`);
}

//get single product info
export function getProduct(id) {
  // console.log(`${pro_id}`)
  return axios.get(`${MAIN_URL}getSingleProduct/${id}`);
}

//add product to Cart when user is logout
export function addToCart(data) {
  let token = localStorage.getItem("token");

  console.log(data);
  return axios.post(`${MAIN_URL}addtocart`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
//fetch all cart Data
export function fetchCartArray(uid) {
  let token = localStorage.getItem("token");

  console.log(uid);
  return axios.get(`${MAIN_URL}fetchCartArray/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
//add order or place order
export function addToOrder(data) {
  let token = localStorage.getItem("token");

  console.log(data);
  return axios.post(`${MAIN_URL}addproducttocartcheckout`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
//fetch or get order details
export function getOrderDetails(uid) {
  let token = localStorage.getItem("token");

  console.log(uid);
  return axios.get(`${MAIN_URL}getOrderDetails/${uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
//add to Txn
export function addToTxnList(data) {
  let token = localStorage.getItem("token");

  console.log(data);
  return axios.post(`${MAIN_URL}addTxn`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
// -------------------------------------------------------------------------------------------
//admin route - add Products
export function addProduct(data) {
  let token = localStorage.getItem("token");

  return axios.post(`${MAIN_URL}addProducts`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//admin route - delete product from db
export function deleteProd(id) {
  let token = localStorage.getItem("token");

  console.log(id);
  return axios.delete(`${MAIN_URL}deleteProduct/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//admin route - update product
export function updateProd(data) {
  let token = localStorage.getItem("token");

  console.log(data);
  return axios.put(`${MAIN_URL}updateProduct`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

//admin route - fetch txnData;
export function txnDetail() {
  let token = localStorage.getItem("token");

  return axios.get(`${MAIN_URL}txnData`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
