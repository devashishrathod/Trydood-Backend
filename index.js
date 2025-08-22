const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const { db } = require("./db/dbConnection");
const { errorHandler } = require("./middleware");
const allRoutes = require("./routers");

const app = express();
const port = process.env.PORT || 5000;

app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api/v1/", allRoutes);
app.use(errorHandler);

app.use((req, res, next) => {
  return res.status(404).json({
    success: false,
    message: "API not found",
  });
});

require("./jobs/expireBrandSubscription");

db();
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
