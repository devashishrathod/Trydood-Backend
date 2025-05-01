const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const fileUpload = require('express-fileupload');
const { db } = require('./db/db');
const cors = require('cors');
const userRouter = require('./router/user');


db()
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/', }));
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api/v1/users', userRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))