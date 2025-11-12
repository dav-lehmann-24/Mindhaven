const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const testRoutes = require('./routes/testRoutes');
const journalRoutes = require('./routes/journalRoutes');

// const errorMiddleware = require('./middleware/errorMiddleware');

require('dotenv').config();

const app = express();
const cors = require('cors');
app.use(express.json());


app.use(cors())

// middleware
app.use(bodyParser.json());

// routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/test', testRoutes);
app.use('/api/journal', journalRoutes);


// error middleware
// app.use(errorMiddleware);

app.get('/', (req,res)=>{
    res.send('Hello from our server')
})


if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`✅ Our server listening on port ${PORT}`);
  });
}

module.exports = app;
