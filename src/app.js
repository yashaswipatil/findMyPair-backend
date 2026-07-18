const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("signed up successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

//* find user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("user not found!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Error in finding the user" + err.message);
  }
});

//*fetch all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error in loading the feed:" + err.message);
  }
});

//* find user and delete
app.delete("/user", async (req, res) => {
  const userId = req.body._id;
  try {
    const users = await User.findByIdAndDelete({ _id: userId });
    res.send("User is deleted successfully!");
  } catch (err) {
    res.status(400).send("Error is deleting the user :" + err.message);
  }
});

//*update data of user
app.patch('/user' , async (req , res) => {
    const userId = req.body._id;
   const data = req.body;
  
   try {
      const updatedUser = await User.findByIdAndUpdate(userId, data, {
        returnDocument: "after",
        runValidators: true,
      });
      res.send(updatedUser)
   } catch (err){
      res.status(400).send("Error in updating the user:" + err.message)   
   }
})

connectDb()
  .then(() => {
    console.log("database connection is established!");
    app.listen(3000, () => {
      console.log("server is successfully running on port 3000");
    });
  })
  .catch((err) => {
    console.error("database connection is  not established!");
  });
