require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRouter');
const eventRouter = require('./routes/eventRouter');
const adminRouter = require('./routes/adminRouter');
const registrationRouter = require('./routes/registrationRouter');

const app = express()
app.use(express.json());
app.use(cors());

app.use('/api/v1', userRouter);
app.use('/api/v1', eventRouter);
app.use('/api/v1', adminRouter);
app.use('/api/v1', registrationRouter);

const DB = process.env.MONGODB_URL;

mongoose.connect(DB).then(() => {
    console.log('Connection to database has been established successfully');
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost: ${PORT}`);
    })
}).catch((error) => {
    console.log(error.message);
})