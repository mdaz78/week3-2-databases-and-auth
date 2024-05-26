const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const jwtPassword = process.env.JWT_PASSWORD;

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

const User = mongoose.model("User", {
  name: String,
  username: String,
  password: String,
});

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  try {
    const { username, password, name } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      const newUser = new User({ name, username, password });
      await newUser.save();
      return res.json({
        message: "User created",
        user: newUser,
      });
    }

    return res.status(403).json({
      message: "User already exists",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.post("/signin", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!userExists(username, password)) {
    return res.status(403).json({
      msg: "User doesnt exist in our in memory db",
    });
  }

  var token = jwt.sign({ username: username }, "shhhhh");
  return res.json({
    token,
  });
});

app.get("/users", function (req, res) {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, jwtPassword);
    const username = decoded.username;
    // return a list of users other than this username from the database
  } catch (err) {
    return res.status(403).json({
      msg: "Invalid token",
    });
  }
});

app.get("/delete/:username", function (req, res) {});

app.listen(3000);
