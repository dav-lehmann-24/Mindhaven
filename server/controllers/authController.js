const bcrypt = require('bcryptjs');
const User = require('../models/auth');

exports.registerUser = (req, res) => {
  const { username, email, password, bio, profile_picture, country, gender } = req.body;


//   console.log('Request body:', req.body);

// hashing
const hashedPassword = bcrypt.hashSync(password, 10);


  User.create(username, email, hashedPassword, bio, profile_picture, country, gender, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ message: 'Error registering user' });
    }
    res.status(201).json({ message: 'User registered successfully!' });
  });
};
