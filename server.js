const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const usersRouter = require("./routes/usersRouter");
const { errorHandler } = require("./middlewares/errorMiddlewear");
require("./utils/connectDB")(); //same as a=require("./utils/connectDB") and calling a()

const app = express();
const PORT = process.env.PORT || 8090;

//middlewares
app.use(express.json());
app.use(cookieParser()); //pass the cookie automatically

//Route
app.use("/api/v1/users", usersRouter);

//error handler middlewear
app.use(errorHandler);

//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
