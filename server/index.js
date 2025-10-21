const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

require('dotenv').config();

const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8080;

app.use(cors())

// middleware
app.use(bodyParser.json());

// routes
app.use('/auth', authRoutes);

// error middleware
app.use(errorMiddleware);

app.get('/', (req,res)=>{
    res.send('Hello from our server')
})

app.listen(8080,()=>{
    console.log('server listening on port 8080');
})