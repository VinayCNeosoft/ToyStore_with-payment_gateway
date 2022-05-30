const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");
const nodemailer = require("nodemailer");
const cred = require("../env");
const jwt = require("jsonwebtoken");
const jwtSecret = "abcdefghijklmnopqrstuvwxyzzyxwvu";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose"); //import mongoose
const Razorpay = require("razorpay");

//const createInvoice = require("../helper/invoiceGen")
//const sendmail = require("../helper/sendmail")

//define model
const userModel = require("../models/userSchema");
const tokenModel = require("../models/tokenSchema");
const productModel = require("../models/productSchema");
const cartModel = require("../models/cartSchema");
const orderModel = require("../models/orderSchema");
const TxnModel = require("../models/TxnList");

//define storage for profile pic
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + file.originalname.match(/\..*$/)[0]
    );
  },
});
//multer for profile pic
const multi_upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .png, .jpg and .jpeg format allowed!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
}).array("profileImg", 1);
// ------------------------------------------------------------------------------------------------------------
//define storage for product pic
const prod_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../product_images"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + file.originalname.match(/\..*$/)[0]
    );
  },
});
//multer for product pic
const product_upload = multer({
  storage: prod_storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      const err = new Error("Only .png, .jpg and .jpeg format allowed!");
      err.name = "ExtensionError";
      return cb(err);
    }
  },
}).array("productImage", 1);

//authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  if (token == null) {
    res.json({ success: true, message: "Token not match" });
  } else {
    jwt.verify(token, jwtSecret, (err, data) => {
      if (err) {
        res.json({ success: false, message: "Token incorrect" });
      } else {
        console.log("Token Match");
        next();
      }
    });
  }
}

//auto-logout
router.get("/tokenExpire", authenticateToken, async (req, res) => {
  res.status(200).json({ err: 0, success: true, message: "Valid Token" });
});
//create route
router.post("/register", (req, res) => {
  console.log(req.body);
  let ufname = req.body.first_name;
  let ulname = req.body.last_name;
  let uemail = req.body.email;
  userModel.findOne({ email: req.body.email }, function (err, user) {
    // Make sure user doesn't already exist
    if (user)
      return res.status(400).send({
        msg: "The email address you have entered is already associated with another account.",
      });
  });
  //create and save the user
  user = new userModel({
    fname: req.body.first_name,
    lname: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    mobile: req.body.mobile,
    gender: req.body.gender,
  });
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(req.body.password, salt, function (err, hash) {
      if (err) throw err;
      user.password = hash;
      user.save(function (err) {
        if (err) {
          return res.json({
            success: false,
            status_code: 500,
            message: err.message,
          });
        }

        // Create a verification token for this user
        var token = new tokenModel({
          _userId: user._id,
          token: crypto.randomBytes(16).toString("hex"),
        });
        // Save the verification token
        token.save(function (err) {
          if (err) {
            res.json({
              success: false,
              status_code: 500,
              message: err.message,
            });
          }
          // Send the email
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: cred.email,
              pass: cred.password,
            },
          });
          var mailOptions = {
            from: cred.email,
            to: user.email,
            subject: "Account Verification Token",
            text:
              "Hello," +
              "Please verify your account by clicking the link: http://localhost:3000/verify_email",
            //text: 'Hello,' + 'Please verify your account by clicking the link: http://' + req.headers.host + '/confirmation/' + token.token + ''
          };
          transporter.sendMail(mailOptions, function (err) {
            if (err) {
              return res.json({
                success: false,
                status_code: 500,
                message: err.message,
              });
            } else {
              return res.json({
                success: true,
                status_code: 200,
                message: "A verification email has been sent to " + uemail,
              });
            }
          });
        });
        res.json({
          success: true,
          status_code: 200,
          message: `${ufname} ${ulname} was Registered Successfully`,
          email_verification_token: token.token,
        });
      });
    });
  });
  //})
});

router.post("/login", (req, res) => {
  console.log(req.body);
  //check for existing user
  const { email, password } = req.body;
  userModel.findOne({ email }).then((user) => {
    if (!user)
      return res.json({
        success: false,
        status: 400,
        err: 1,
        message: "User does not exist ! If you are New USER register first.",
      });

    // Validate password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res.json({
          success: false,
          status: 400,
          message: "Invalid Password",
        });
      // Make sure the user has been verified
      if (!user.isVerified)
        return res.json({
          success: false,
          status: 401,
          type: "not-verified",
          message:
            "Your account has not been verified yet ! Please Verify first and Try again !",
        });
      else {
        let payload = {
          uid: email,
        };
        console.log(user);
        const token = jwt.sign(payload, jwtSecret, { expiresIn: "10m" });
        res.json({
          success: true,
          status_code: 200,
          message: `${email} have logged In`,
          token: token,
          user,
        });
      }
    });
  });
});
//verify mail
router.post("/email_Verification/:email", (req, res) => {
  console.log(req.body.eToken);
  console.log(req.params.email);

  tokenModel.findOne({ token: req.body.eToken }, function (err, token) {
    if (!token) {
      return res.json({
        success: false,
        status_code: 400,
        type: "not-verified",
        message: `We were unable to find a valid token. Your token may have expired ! try to resend it and Try again.`,
      });
    }

    // If we found a token, find a matching user
    userModel.findOne(
      { _id: token._userId, email: req.params.email },
      function (err, user) {
        if (!user)
          return res.json({
            success: false,
            status_code: 400,
            type: "not-verified",
            message: "We were unable to find a user for this token.",
          });
        if (user.isVerified)
          return res.json({
            success: false,
            status_code: 400,
            type: "already-verified",
            message: `${req.params.email} has already been verified.Try Login !`,
          });
        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
          if (err) {
            return res.json({
              success: false,
              status_code: 500,
              message: err.message,
            });
          }
          res.json({
            success: true,
            status_code: 200,
            message: "The account has been verified. Please log in.",
          });
        });
      }
    );
  });
});

//verify email state
router.get("/verifyState/:email", (req, res) => {
  console.log(req.params.email);
  console.log("Fetching Email Verification State....");
  userModel.findOne({ email: req.params.email }, (err, data) => {
    state = data.isVerified;
    if (err) throw err;
    //res.send(data)
    else res.json({ success: true, state });
  });
});

//resend verify mail
router.post("/email_Verification", (req, res) => {
  console.log(req.body.email);
  uemail = req.body.email;
  userModel.findOne({ email: req.body.email }, function (err, user) {
    if (!user)
      return res.json({
        success: false,
        status_code: 400,
        type: "not-verified",
        message: "We were unable to find a user for this token.",
      });
    if (user.isVerified)
      return res.json({
        success: false,
        status_code: 400,
        type: "already-verified",
        message: `${req.body.email} has already been verified.Try Login !`,
      });
    const newToken = crypto.randomBytes(16).toString("hex");
    tokenModel.updateOne(
      { _userId: user._id },
      {
        $set: {
          token: newToken,
        },
      },
      (err) => {
        if (err) throw err;
        else {
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: cred.email,
              pass: cred.password,
            },
          });
          var mailOptions = {
            from: cred.email,
            to: user.email,
            subject: "Account Verification Token",
            text:
              "Hello," +
              "Please verify your account by clicking the link: http://localhost:3000/verify_email",
            //text: 'Hello,' + 'Please verify your account by clicking the link: http://' + req.headers.host + '/confirmation/' + token.token + ''
          };
          transporter.sendMail(mailOptions, function (err) {
            if (err) {
              return res.json({
                success: false,
                status_code: 500,
                message: err.message,
              });
            } else {
              return res.json({
                success: true,
                status_code: 200,
                message: "A verification email has been sent to " + uemail,
              });
            }
          });
          res.json({
            success: true,
            status_code: 200,
            message: `A verification email has been sent to ` + uemail,
            email_verification_token: newToken,
          });
          console.log("New Token value updated");
        }
      }
    );
  });
});

//forget Password
router.post("/forgetpassword", (req, res) => {
  //console.log(req.body.email)
  let rmail = req.body.email;
  console.log(rmail);
  if (req.body === "") {
    res.json({ success: false, status_code: 400, message: "Email Required" });
  }
  userModel.findOne({ email: rmail }).then((user) => {
    if (user === null) {
      console.error("email not in database");
      res.json({
        success: false,
        status_code: 403,
        message: "email not in DB",
      });
    } else {
      function generateOTP() {
        var minm = 100000;
        var maxm = 999999;
        return Math.floor(Math.random() * (maxm - minm + 1)) + minm;
      }
      let otp = generateOTP();
      console.log(otp);
      userModel.updateOne(
        { email: rmail },
        {
          $set: {
            resetPasswordToken: otp,
          },
        },
        (err) => {
          if (err) throw err;
          else {
            res.json({
              success: true,
              status_code: 200,
              message: `Successfully sent OTP to ${rmail}`,
              otp: otp,
            });
            console.log("Otp stored in db");
          }
        }
      );
      sendmail(otp, rmail);
    }
  });
});

//reset password
router.put("/resetpassword", (req, res) => {
  console.log(req.body);
  let otp = req.body.otp;
  let password = req.body.password;
  console.log(otp);
  console.log(password);
  if (req.body === "") {
    res.json({
      success: false,
      status_code: 400,
      message: "Please Fill Data first",
    });
  }
  userModel.findOne({ resetPasswordToken: otp }).then((user) => {
    if (user === null) {
      res.json({
        success: false,
        status_code: 403,
        message: "Invalid OTP please enter valid OTP",
      });
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
          userModel.updateOne(
            { resetPasswordToken: otp },
            {
              $set: {
                password: hash,
              },
            },
            (err) => {
              if (err) throw err;
              else {
                res.json({
                  success: true,
                  status_code: 200,
                  message: `Password Reset Successfully for ${user.email}`,
                });
                console.log("Otp stored in db");
              }
            }
          );
        });
      });
    }
  });
});

//user profile with token
router.get("/getCustomerProfile/:uid", authenticateToken, (req, res) => {
  console.log(req.params.uid);
  console.log("Customer Data Fetching....");
  userModel.findOne({ email: req.params.uid }, (err, data) => {
    console.log(JSON.stringify(data));
    if (err) throw err;
    //res.send(data)
    else res.json({ success: true, data });
  });
});

//change user password
router.post("/changepassword/:uid", authenticateToken, (req, res) => {
  console.log(req.body);
  console.log(req.params.uid);
  let oldpass = req.body.oldpassword;
  let pass = req.body.password;
  console.log(oldpass);
  console.log(pass);
  if (req.body === "") {
    res.json({
      success: false,
      status_code: 400,
      message: "Please Fill Data first",
    });
  }
  userModel.findOne({ email: req.params.uid }).then((user) => {
    if (user === null) {
      res.json({
        success: false,
        status_code: 403,
        message: "Invalid old password please enter valid old password",
      });
    } else {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(pass, salt, function (err, hash) {
          userModel.updateOne(
            { email: req.params.email },
            {
              $set: {
                password: hash,
              },
            },
            (err) => {
              if (err) throw err;
              else {
                res.json({
                  success: true,
                  status_code: 200,
                  message: `Password Change Successfully for ${user.email}`,
                });
                console.log("New Password stored in db");
              }
            }
          );
        });
      });
    }
  });
});

//update profile data
router.put("/profile/:uid", authenticateToken, (req, res) => {
  console.log(req.body);
  console.log(req.params.uid);
  let ins = {
    fname: req.body.first_name,
    lname: req.body.last_name,
    mobile: req.body.mobile,
    dob: req.body.dob,
  };
  console.log(ins);
  if (req.body === "") {
    res.json({
      success: false,
      status_code: 400,
      message: "Please Fill Data first",
    });
  }
  userModel.findOne({ email: req.params.uid }).then((user) => {
    if (user === null) {
      res.json({
        success: false,
        status_code: 403,
        message: "Invalid User Cannot Update",
      });
    } else {
      userModel.updateOne(
        { email: req.params.uid },
        {
          $set: {
            fname: ins.fname,
            lname: ins.lname,
            mobile: ins.mobile,
            dob: ins.dob,
          },
        },
        (err) => {
          if (err) throw err;
          else {
            res.json({
              success: true,
              status_code: 200,
              message: `Profile Updated Successfully`,
            });
            console.log("Updated Data stored in db");
          }
        }
      );
    }
  });
});

// update profile pic
router.put("/propic", authenticateToken, (req, res) => {
  multi_upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res
        .status(500)
        .send({ error: { message: `Multer uploading error1: ${err.message}` } })
        .end();
      return;
    } else if (err) {
      if (err.name == "ExtensionError") {
        res.json({ err: err.name });
      } else {
        console.log(err.message);
        res
          .status(500)
          .send({
            error: { message: `unknown uploading error: ${err.message}` },
          })
          .end();
      }
      return;
    }
    console.log(req.files);
    console.log(req.body.email);
    const url =
      req.protocol + "://" + req.get("host") + "/" + req.files[0].filename;
    console.log(url);
    //http://localhost:7777/req.file.filename
    userModel.findOne({ email: req.body.email }, function (err, user) {
      // Make sure user propic already exist
      userModel.updateOne(
        { email: req.body.email },
        {
          $set: {
            logo: url,
          },
        },
        (err) => {
          if (err) throw err;
          else {
            res.json({
              success: true,
              status_code: 200,
              message: `Profile Pic Updated Successfully for ${user.email}`,
            });
            console.log("Profile pic stored in DB");
          }
        }
      );
    });
  });
});

//Add address
router.post("/addAddress/:uid", authenticateToken, (req, res) => {
  console.log(req.body);
  if (req.body === "") {
    res.json({
      success: false,
      status_code: 400,
      message: "Please Fill Data first",
    });
  }
  userModel.findOne({ email: req.params.uid }).then((user) => {
    if (user === null) {
      res.json({
        success: false,
        status_code: 403,
        message: "User Does not Exist",
      });
    } else {
      userModel.findOneAndUpdate(
        { email: req.params.uid },
        {
          $push: {
            address: {
              street: req.body.address,
              pincode: req.body.pincode,
              city: req.body.city,
              state: req.body.state,
              country: req.body.country,
            },
          },
          // {$set:{'address.$.name':name, 'address.$.address':address, 'address.$.pincode':pincode, 'address.$.city':city, 'address.$.state':state, 'address.$.country':country}}
        },
        (err) => {
          if (err) throw err;
          else {
            res.json({
              success: true,
              status_code: 200,
              message: `Address Added Successfully for ${user.email}`,
            });
            console.log("New Address stored in db");
          }
        }
      );
    }
  });
});

//get all address
router.get("/getCustAddress/:uid", authenticateToken, (req, res) => {
  console.log(req.params.uid);
  console.log("Address Data Fetching....");
  userModel.findOne({ email: req.params.uid }, (err, data) => {
    console.log(JSON.stringify(data.address));
    if (err) throw err;
    //res.send(data)
    else res.json({ success: true, address: data.address });
  });
});

//update address
router.put("/editAddress", authenticateToken, async (req, res) => {
  console.log(req.body);
  const { id, address, pincode, city, state, country } = req.body;
  if (
    id === "" ||
    address === "" ||
    pincode === "" ||
    city === "" ||
    state === "" ||
    country === ""
  ) {
    res.json({
      success: false,
      status_code: 400,
      message: "Data entry failed...",
    });
  }
  const data = await userModel.findOneAndUpdate(
    { "address._id": id },
    {
      $set: {
        "address.$.street": address,
        "address.$.pincode": pincode,
        "address.$.city": city,
        "address.$.state": state,
        "address.$.country": country,
      },
    }
  );
  if (data !== {}) {
    res.json({
      success: true,
      status_code: 200,
      message: `Address Updated Successfully`,
    });
    console.log("Address Updated in db");
  } else {
    res.json({
      success: false,
      status_code: 200,
      message: `Address Not Updated`,
    });
  }
});

//delete address
router.delete("/deleteAddress/:del_id", authenticateToken, async (req, res) => {
  console.log(req.params.del_id);
  const d_id = req.params.del_id;
  console.log(d_id);
  if (d_id === "") {
    res.json({
      success: false,
      status_code: 400,
      message: "Data entry failed...",
    });
  }
  const data = await userModel.findOneAndUpdate(
    { "address._id": d_id },
    {
      $pull: {
        address: { _id: d_id },
      },
    }
  );

  if (data !== {}) {
    res.json({
      success: true,
      status_code: 200,
      message: `Address Deleted Successfully`,
    });
    console.log("Address Deleted from db");
  } else {
    res.json({
      success: false,
      status_code: 200,
      message: `Address Not Deleted`,
    });
  }
});
//fetch single product or product detail
router.get("/getSingleProduct/:id", (req, res) => {
  console.log(req.params.id);
  console.log("product Data Fetching....");
  productModel
    .find({ _id: req.params.id })

    .then((data) => {
      console.log(data);
      res.json({ success: true, data });
    });
});

//add product to cart
router.post("/addtocart", async (req, res) => {
  console.log(req.body);
  const { cart, email } = req.body;
  //insert data
  // console.log(req.body)
  let oldUser = await cartModel.findOne({ email: req.body.email });
  if (oldUser) {
    console.log("true");

    cartModel.findOneAndUpdate(
      { email: req.body.email },
      { $set: { cart: req.body.cartArray } },
      (err) => {
        if (err) throw err;
        else {
          res.json({
            msg: "products Updated",
            err: 0,
            success: true,
            status_code: 200,
          });
          console.log("updated");
        }
      }
    );
  } else {
    let ins = new cartModel({ cart: req.body.cartArray, email: email });
    ins.save((err) => {
      if (err) {
        res.json({ err: "already added", message: "already added" });
      } else {
        res.json({
          err: 0,
          success: true,
          status_code: 200,
          msg: "Item Successfully Added",
        });
      }
    });
    console.log("inserted");
  }
});

//fetch cart array fetchCartArray
router.get("/fetchCartArray/:uid", authenticateToken, (req, res) => {
  // console.log("Common Products Fetching....")
  console.log(req.params.uid);
  console.log(`Fetching Cart Data for ${req.params.uid} ...`);
  cartModel.findOne({ email: req.params.uid }, function (err, cartData) {
    // Make sure user doesn't already exist
    if (cartData) {
      cartModel.findOne({ email: req.params.uid }, (err, data) => {
        console.log(data);
        if (err) throw err;
        //res.send(data)
        else res.json({ success: true, message: "cart Data Fetched", data });
      });
    } else {
      res.json({ success: false, message: "Cart is Empty" });
    }
  });
});

//create order or add order
router.post(
  "/addproducttocartcheckout",
  authenticateToken,
  async (req, res) => {
    console.log(req.body);
    const { orderData, email } = req.body;
    console.log(orderData);

    let oldUser = await orderModel.findOne({ email: req.body.email });
    if (oldUser !== null) {
      const data = orderModel.updateOne(
        { email: email },
        {
          $push: {
            order: orderData,
          },
        }
      );
      if (data !== {}) {
        res.json({
          success: true,
          status_code: 200,
          message: "User Order data Updated Successfully",
        });
        console.log("Order Updated in db");
      } else {
        res.json({
          success: false,
          status_code: 200,
          message: `Order Not Failed`,
        });
      }
    } else {
      order = new orderModel({
        email: req.body.email,
        order: req.body.orderData,
      });
      order.save(function (err) {
        if (err) {
          return res.json({
            success: false,
            status_code: 500,
            message: err.message,
          });
        }
        res.json({
          success: true,
          status_code: 200,
          message: "Order Placed and Added to DB",
        });
      });
    }
  }
);
//fetch All Orders of a Login User
router.get("/getOrderDetails/:uid", authenticateToken, (req, res) => {
  console.log(req.params.uid);
  console.log(`Fetching Cart Data for ${req.params.uid} ...`);
  orderModel.findOne({ email: req.params.uid }, function (err, orderData) {
    // Make sure order already exist
    console.log(orderData);
    if (orderData) {
      orderModel.findOne({ email: req.params.uid }, (err, data) => {
        console.log(data);
        if (err) throw err;
        //res.send(data)
        else res.json({ success: true, message: "Order Data Fetched", data });
      });
    } else {
      res.json({ success: false, message: "Order is Empty" });
    }
  });
});

// -----------------------------------------------------------------------

//add product
router.post("/addProducts", authenticateToken, (req, res) => {
  product_upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res
        .status(500)
        .send({ error: { message: `Multer uploading error1: ${err.message}` } })
        .end();
      return;
    } else if (err) {
      if (err.name == "ExtensionError") {
        res.json({ err: err.name });
      } else {
        console.log(err.message);
        res
          .status(500)
          .send({
            error: { message: `unknown uploading error: ${err.message}` },
          })
          .end();
      }
      return;
    }
    const url =
      req.protocol + "://" + req.get("host") + "/" + req.files[0].filename;
    //create and save the user
    product = new productModel({
      product_name: req.body.product_name,
      product_desc: req.body.product_desc,
      product_cost: req.body.product_cost,
      product_producer: req.body.product_producer,
      product_image: url,
    });
    product.save(function (err) {
      if (err) {
        return res.json({
          success: false,
          status_code: 500,
          message: err.message,
        });
      }
      productModel.find().then((product) => {
        // console.log(product);
        res.json({
          success: true,
          message: "Product Added Successfully",
          allProd: product,
        });
      });
    });
  });
});

//fetch all products admin operation
router.get("/commonproducts", (req, res) => {
  // console.log("Common Products Fetching....")
  let allprod = [];
  productModel.find().then((product) => {
    // console.log(product);
    res.json({ success: true, allProd: product });
  });
});

//delete product from DB admin operation
router.delete("/deleteProduct/:id", authenticateToken, (req, res) => {
  productModel.findByIdAndRemove(
    { _id: req.params.id },
    function (err, product) {
      if (err) res.json(err);
      else {
        productModel.find().then((product) => {
          res.json({
            success: true,
            message: "Product Deleted Successfully",
            allProd: product,
          });
        });
      }
    }
  );
});

//Txn data
//fetch all products admin operation
router.get("/txnData", authenticateToken, (req, res) => {
  // console.log("Common Products Fetching....")
  let alltxn = [];
  TxnModel.find().then((txn) => {
    // console.log(product);
    res.json({ success: true, alltxn: txn });
  });
});

//update product
router.put("/updateProduct", authenticateToken, (req, res) => {
  product_upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      res
        .status(500)
        .send({ error: { message: `Multer uploading error1: ${err.message}` } })
        .end();
      return;
    } else if (err) {
      if (err.name == "ExtensionError") {
        res.json({ err: err.name });
      } else {
        console.log(err.message);
        res
          .status(500)
          .send({
            error: { message: `unknown uploading error: ${err.message}` },
          })
          .end();
      }
      return;
    }
    console.log(req.body);
    const url =
      req.protocol + "://" + req.get("host") + "/" + req.files[0].filename;
    productModel.findOne({ _id: req.body._id }).then((product) => {
      if (product === null) {
        res.json({
          success: false,
          status_code: 403,
          message: "Invalid product Cannot Update",
        });
      } else {
        productModel.updateOne(
          { _id: req.body._id },
          {
            $set: {
              product_name: req.body.product_name,
              product_desc: req.body.product_desc,
              product_cost: req.body.product_cost,
              product_producer: req.body.product_producer,
              product_image: url,
            },
          },
          (err) => {
            if (err) throw err;
            else {
              productModel.find().then((product) => {
                res.json({
                  success: true,
                  message: "Product Updated Successfully",
                  allProd: product,
                });
              });
              console.log("Updated Data stored in db");
            }
          }
        );
      }
    });
  });
});

//
router.post("/orders", authenticateToken, async (req, res) => {
  console.log(req.body);

  try {
    const instance = new Razorpay({
      key_id: "rzp_test_lj6cMskxIlTt4w",
      key_secret: "GI6LCPuYBOF5wqKVC8Yag9Yr",
    });

    const options = {
      amount: req.body.t * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: "receipt_order_74394",
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).send("Some error occured");

    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

//
router.post("/success", authenticateToken, async (req, res) => {
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", "GI6LCPuYBOF5wqKVC8Yag9Yr");

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    res.json({
      msg: "success",
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/addTxn", authenticateToken, async (req, res) => {
  console.log(req.body);
  //create and save the user
  txn = new TxnModel({
    total: req.body.total,
    orderID: req.body.orderId,
    paymentID: req.body.paymentID,
  });
  txn.save(function (err) {
    if (err) {
      return res.json({
        success: false,
        status_code: 500,
        message: err.message,
      });
    }
    TxnModel.find().then((txn) => {
      // console.log(product);
      res.json({
        success: true,
        message: "Transaction  Added Successfully",
      });
    });
  });
});
module.exports = router;
