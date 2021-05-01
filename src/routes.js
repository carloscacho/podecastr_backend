const express = require("express");
const routes = express.Router();
const EpisodeController = require('./app/controller/EpisodeCtrl')

routes.get("/episode", EpisodeController.index);
routes.get("/episode/:id", EpisodeController.findOne)
routes.post("/episode", EpisodeController.store)

module.exports = routes;