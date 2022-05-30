const express = require("express"); //imported express
const mongoose = require("mongoose"); //imported mongoose
const dotenv = require("dotenv");
const cors = require("cors"); //imported cors
const { connectDB } = require("./configFiles/dbConnect");

const PORT = process.env.PORT || 7777; //define port
const app = express(); //assigned express to app
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("uploads")); //for img

app.use(express.static("product_images")); //for img

app.use(cors());
connectDB();

//load routes
const neostoreRoutes = require("./routes/neostoreRoutes");

app.use("/", neostoreRoutes);

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Work on ${PORT}`);
});
