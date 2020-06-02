const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
//include user model from User.js
const User = require("../../models/User");

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please make sure email is valid").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //destructure the req.body object (makes the code easier to work with and read)
    const { name, email, password } = req.body;

    try {
      //see if the user already exists
      let user = await User.findOne({ email });

      if (user) {
        //note: we wrote the returned json with the msg as part of an array to match the other error output above
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      //Get the users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // Encrpyt password with bcrypt
      //generate salt to hash password with
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //return jsonwebtoken (required to log user in after making account)

      res.send("User registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
