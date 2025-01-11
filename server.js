const express = require("express");
const usersRouter = require("./routes/usersRouter");
require("./utils/connectDB")(); //same as a=require("./utils/connectDB") and calling a()
const app = express();
const PORT = process.env.PORT || 8090;

//middlewares
app.use(express.json());

//Route
app.use("/api/v1/users", usersRouter);
//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
