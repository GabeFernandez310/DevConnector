const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

// @route   GET api/auth
// @desc    Test Route
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth
// @desc    Authenticate user and get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please make sure email is valid").isEmail(),
    check("password", "Please is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //destructure the req.body object (makes the code easier to work with and read)
    const { email, password } = req.body;

    try {
      //see if the user already exists
      let user = await User.findOne({ email });

      if (!user) {
        //note: we wrote the returned json with the msg as part of an array to match the other error output above
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        //note: we wrote the returned json with the msg as part of an array to match the other error output above
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      //payload for JWT
      const payload = {
        user: {
          id: user.id, //user id. Taken from MongoDB and stored is a special way defined by Mongoose
        },
      };

      //creating the JWT
      jwt.sign(
        payload, //payload that contains desired info. In our case the user's ID
        config.get("jwtSecret"), //Secret that helps identify the JWT
        { expiresIn: 3600 }, //Set expiry of JWT to be 1 hour
        (err, token) => {
          //callback that throws an error to the catch below or responds to the post request with a json with the JWT
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;

module.exports = router;
