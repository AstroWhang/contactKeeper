const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// user schema, what to record in our db
const User = require('../models/User');
const config = require("config");

// @route     POST api/users
// @desc      Register a user
// @access    Public    
router.post('/', 
[
  // error checking brought in from express-validator/check
  check('name', 'Please add name').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({
    min: 6
  })
], 
async (req, res) => {
  // creates an error array that goes through the checks set from above
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name, email, password  } = req.body;

  try {
    // findOne, able to find a user by email variable (can use other searches as well: username, name, etc)
    let user = await User.findOne({ email });

    if(user) {
      return res.status(400).json({ msg: 'User already exists' })
    }

    user = new User({
      name,
      email,
      password
    });

    // need var salt in order to encrypt password using bcrypt, 10 = how secure the hash is
    // salt returns a promise
    const salt = await bcrypt.genSalt(10);
    
    // bcrypt returns a promise
    // takes in password and salt as parameters and returns hashed password
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    }

    jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: 360000
    }, (err, token) => {
      if(err) throw err;
      res.json({ token });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

module.exports = router;
