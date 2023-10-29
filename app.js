const express = require("express");
const path = require("path");
const fs = require("fs");
// bao ve header
const helmet = require("helmet");

// nen cac asset giamr dung luong
const compression = require("compression");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");

// ghi nhat ki
const morgan = require("morgan");

const cors = require("cors");

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.9f97tqr.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`;

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

// tao file log
// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname),
//   "access.log",
//   // a nghia la append (them vao)
//   { flag: "a" }
// );

const app = express();
app.use(helmet());
app.use(compression());
// app.use(morgan("combined", { stream: accessLogStream }));

app.use(
  cors({
    origin: "https://technotes-52tj.onrender.com",
    methods: ["POST", "GET", "PUT", "OPTIONS", "HEAD", "DELETE"],
    credentials: true,
  })
);

const fileStorage = multer.memoryStorage();

app.use(bodyParser.json({ limit: "50mb" })); // application/json
app.use(multer({ storage: fileStorage }).single("image"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );

  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(process.env.PORT || 5000);
    console.log("Connected!");
    const io = require("./socket").init(server);
    io.on("connection", (socket) => {
      console.log("Client connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
