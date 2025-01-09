const express = require("express");

const app = express();
const PORT = process.env.PORT || 8090;

//start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
