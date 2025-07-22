const express = require("express");
const User = require("../MongoSchema/user");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); //give token to client who sign in
const jwtToken = "Fomasol"; //like signature
const fetchuser=require('../middleware/fetchuser');

router.post(
  "/signin",
  [
    body("name", "Enter  a valid Name").isLength({ min: 3 }),
    body("email", "Enter  a valid Email").isEmail(),
    body("password", "Enter  a valid Password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    try {
      let use = await User.findOne({ email: req.body.email }); 
      if (use)
        return res.status(400).json({ error: "This user with this email already exist" });
      const salt = bcrypt.genSaltSync(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      const user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtd = jwt.sign(data, jwtToken);
      res.json({ token: jwtd, name: user.name }); // <-- FIXED
    } catch (error) {
  console.error("Singin Error:", error); // better logging
  res.status(500).json({ error: "some error occurred from server side(sigin)" });
}
  }
);

// LOGIN ROUTE
router.post(
  "/login",
  [
    body("email", "Enter  a valid Email").isEmail(),
    body("password", "Password is blank").exists(),
  ],
  async (req, res) => {
    const error2 = validationResult(req);
    if (!error2.isEmpty()) {
      return res.status(400).json({ errors: error2.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ error: "please enter correct data" });
      console.log("Fetched user:", user);

      const compare = await bcrypt.compare(password, user.password);
      if (!compare) {
        return res.status(400).json({ error: "please enter correct data" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const jwtd = jwt.sign(data, jwtToken);
      res.json({ token: jwtd, name: user.name }); // <-- FIXED
    } catch (error) {
  console.error("Login Error:", error); // better logging
  res.status(500).json({ error: "some error occurred from server side(login)" });
}
  }
);

module.exports = router;




//Router 3(getUser)

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id).select("-password");

    res.send({ user });
  } catch (error) {
    console.error(error.message);
    res.status(401).send({ error: "User not found" });
  }
});

