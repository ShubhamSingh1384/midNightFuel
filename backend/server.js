const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const sellerProductRoute = require("./routes/seller/productRoutes");
const sellerRoute = require("./routes/seller/sellerRoutes");
const userRouter = require("./routes/user/userRouters.js");
const userProductRouter = require("./routes/user/userProductorRouter.js");
const adminRouter = require("./routes/admin/adminRoutes.js");
const paymentRouter = require("./routes/seller/paymentRoute.js")

const adminControl = require("./routes/admin/controlRoutes.js");
const { authentication } = require("./middleware/authMiddleware");


const passport = require("passport")
require('./config/passport.js')

const app = express();
dotenv.config();
PORT = process.env.PORT || 8888;

// console.log(process.env.DB_URL)
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("Failed to connect ", error);
  });

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); 

      if (allowedOrigins.some(o => origin.startsWith(o))) {
        return callback(null, true);
      }

      // Optional: allow all vercel.app subdomains if you want
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/seller", sellerProductRoute);
app.use("/api/seller", sellerRoute);
app.use("/api/seller", paymentRouter)

app.use("/api/user", userRouter);
app.use("/api/user", userProductRouter);

app.use("/api/admin", adminRouter);
app.use("/api/admin", adminControl);

app.use(passport.initialize());

app.use("/", (req, res) => {
  res.send("API is Working");
});
app.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("server started : ", PORT);
});
