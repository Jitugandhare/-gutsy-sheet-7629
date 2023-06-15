const express = require("express")
const app = express()
const { connection } = require("./db");
const { userRoute } = require("./routes/user.route");
app.use(express.json());

app.use("/user",userRoute)

app.listen(8080, async () => {
  try {
    await connection;
    console.log(`server is running on port 8080`);
    console.log("connected to DB");
  } catch (err) {
    console.log(err);
  }
});