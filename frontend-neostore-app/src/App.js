import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/home/Dashboard";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgetPassword from "./components/auth/ForgetPassword";
import Profile from "./components/Account/Profile";
import ResetPassword from "./components/auth/ResetPassword";
import EditProfile from "./components/Account/EditProfile";
import ChangePassword from "./components/Account/ChangePassword";
import Header from "./components/common_Components/Header";
import Address from "./components/Account/Address";
import VerifyEmail from "./components/auth/VerifyEmail";
import EditAddress from "./components/Account/EditAddress";
import AllProducts from "./components/Product/AllProducts";
import ProductDetail from "./components/Product/ProductDetail";
import Cart from "./components/Product/Cart";
import Checkout from "./components/Product/Checkout";
import PlaceOrder from "./components/Product/PlaceOrder";
import Orders from "./components/Product/Orders";
import PageNotFound from "./components/common_Components/PageNotFound";
import { AdminDashboard } from "./components/Admin/AdminDashboard";
import { TxnList } from "./components/Admin/TxnList";

import { isLogin } from "./utils";

let restricted = false;
let role = localStorage.getItem("role");
console.log(role);

function AdminRoute({ children }) {
  const navigate = useNavigate();

  const auth = isLogin();
  return auth && role === "admin" ? children : <Navigate to="/login" />;
}

function UserRoute({ children }) {
  const navigate = useNavigate();
  const auth = isLogin();
  return auth && role === "user" ? children : <Navigate to="/login" />;
}

/* function PublicRoute({ children }) {
  const auth = isLogin();
  console.log(auth);
  return !auth ? children : children;
} */

function App() {
  const [search, setSearch] = useState("");

  return (
    <>
      <Router>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Header query={(val) => setSearch(val)} />

        <Routes>
          {/* Public Route Start */}
          {/*  <Route
            path="/"
            element={
              <PublicRoute>
                <Dashboard search={search} />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                {" "}
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                {" "}
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/forgetpassword"
            element={
              <PublicRoute>
                {" "}
                <ForgetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/verify_email"
            element={
              <PublicRoute>
                {" "}
                <VerifyEmail />
              </PublicRoute>
            }
          />
          <Route
            path="/resetpassword"
            element={
              <PublicRoute>
                {" "}
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/commonproduct"
            element={
              <PublicRoute>
                <AllProducts search={search} />
              </PublicRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PublicRoute>
                <ProductDetail />
              </PublicRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PublicRoute>
                <Cart />
              </PublicRoute>
            }
          /> */}
          {/* Public Route End */}

          {/* User Route Start */}
          <Route
            path="/changepassword"
            element={
              <UserRoute>
                <ChangePassword />
              </UserRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <UserRoute>
                <Profile />
              </UserRoute>
            }
          />
          <Route
            path="/edit"
            element={
              <UserRoute>
                <EditProfile />
              </UserRoute>
            }
          />
          <Route
            path="/address"
            element={
              <UserRoute>
                <Address />
              </UserRoute>
            }
          />
          <Route
            path="/editaddress"
            element={
              <UserRoute>
                <EditAddress />
              </UserRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <UserRoute>
                <Checkout />
              </UserRoute>
            }
          />
          <Route
            path="/placeorder"
            element={
              <UserRoute>
                <PlaceOrder />
              </UserRoute>
            }
          />
          <Route
            path="/order"
            element={
              <UserRoute>
                <Orders />
              </UserRoute>
            }
          />

          {/* User Route End */}

          {/* Admin Route Start */}
          <Route
            path="/adminDashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/txnDetail"
            element={
              <AdminRoute>
                <TxnList />
              </AdminRoute>
            }
          />

          {/* Admin Route End */}

          {/* <PublicRoute
            restricted={false}
            component={Dashboard}
            path="/"
            exact
            search={search}
          />
          <PublicRoute
            restricted={true}
            component={Login}
            path="/login"
            exact
          />
 */}
          <Route path="/" exact element={<Dashboard search={search} />} />
          <Route path="/login" exact element={<Login />} />
          <Route path="/register" exact element={<Register />} />
          <Route path="/verify_email" exact element={<VerifyEmail />} />
          <Route path="/forgetpassword" exact element={<ForgetPassword />} />
          <Route path="/resetpassword" exact element={<ResetPassword />} />
          <Route path="/cart" exact element={<Cart />} />
          {/* <Route path="/changepassword" exact element={<ChangePassword />} />
          <Route path="/profile" exact element={<Profile />} />
          <Route path="/edit" exact element={<EditProfile />} />
          <Route path="/address" exact element={<Address />} />
          <Route path="/editaddress" exact element={<EditAddress />} />
          <Route
            path="/commonproduct"
            exact
            element={<AllProducts search={search} />}
          />
          <Route path="/product/:id" exact element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/placeorder" element={<PlaceOrder />} />
          <Route path="/order" element={<Orders />} />

          <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/txnDetail" element={<TxnList />} />*/}

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
