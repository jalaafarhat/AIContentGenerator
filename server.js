const express = require("express");
require("dotenv").config();
const usersRouter = require("./routes/usersRouter");
const { errorHandler } = require("./middlewares/errorMiddlewear");
require("./utils/connectDB")(); //same as a=require("./utils/connectDB") and calling a()

const app = express();
const PORT = process.env.PORT || 8090;

//middlewares
app.use(express.json());

//Route
app.use("/api/v1/users", usersRouter);

//error handler middlewear
app.use(errorHandler);

//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
