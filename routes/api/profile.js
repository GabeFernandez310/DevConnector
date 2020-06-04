const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");

const Profile = require("../../models/Profile");

const User = require("../../models/User");

const { check, validationResult } = require("express-validator");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profile/me
// @desc    Create or update a user profile
// @access  Private

router.post(
  "/",
  [
    auth, //Validates our token
    [
      check("status", "Status is required").not().isEmpty(), // makes sure status is not empty
      check("skills", "Skills is required").not().isEmpty(), // makes sure skills is not empty
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req); // checks to make sure there are no errors according to schema?
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body; //pull out profile fields from the body of the request JSON

    //Build profile object
    const profileFields = {};

    profileFields.user = req.user.id;
    //Define this user as user decoded from auth.js middleware

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (skills)
      profileFields.skills = skills.split(",").map((skill) => skill.trim()); // calls .split() to separate into items between each ',' and .trim() to get rid of white space    if (bio) profileFields.bio = bio;

    //build social fields
    profileFields.social = {};
    if (githubusername) profileFields.social.githubusername = githubusername;
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update existing profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      }

      //create new profile
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all user's profiles
// @access  Public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
