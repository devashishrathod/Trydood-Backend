const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const fileUpload = require('express-fileupload');
const { db } = require('./db/db');
const cors = require('cors');
const userRouter = require('./router/user');
const categoryRouter = require('./router/category');
const subCatRouter = require('./router/subCategory');
const brandRouter = require('./router/brand');
const vendorRouter = require('./router/vendor');
const marketRouter = require('./router/marketers');
const subscriptionRouter = require('./router/subscription');
const applicationRouter = require('./router/application');


db()
app.use(fileUpload({ useTempFiles: true, tempFileDir: '/tmp/', }));
app.use(express.json());
app.use(cors());


app.get('/', (req, res) => res.send('Hello World!'))
app.use('/api/v1/users', userRouter)
app.use('/api/v1/categories', categoryRouter)
app.use('/api/v1/subCategories', subCatRouter)
app.use('/api/v1/brand', brandRouter)
app.use('/api/v1/vendors', vendorRouter)
app.use('/api/v1/marketers', marketRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)
app.use('/api/v1/settings', applicationRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))