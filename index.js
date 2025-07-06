const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const { db } = require("./db/dbConnection");
const allRoutes = require("./routers");

const app = express();
const port = process.env.PORT || 5000;

db();
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
app.use(express.json());
app.use(cors());

app.use("/api/v1/", allRoutes);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
