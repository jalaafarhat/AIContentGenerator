const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const { openAIController } = require("../controllers/openAIController");
const checkApiRequestLimit = require("../middlewares/checkApiRequestLimit");

const openAIRouter = express.Router();

openAIRouter.post(
  "/generate-content", //first go to the /generate-content
  isAuthenticated, //second check if Authenticated
  checkApiRequestLimit, //third check if the limit
  openAIController //then at last go to the controller
);

module.exports = openAIRouter;
