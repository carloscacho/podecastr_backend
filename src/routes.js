require("dotenv").config();
const express = require("express");
const routes = express.Router();
const EpisodeController = require('./app/controller/EpisodeCtrl')
const UserCtrl = require('./app/controller/UserCtrl')

routes.get("/episode", EpisodeController.index);
routes.get("/episode/:id", EpisodeController.findOne)

routes.post("/episode", UserCtrl.verifyJWT, EpisodeController.store)

routes.post("/user", UserCtrl.addUser)
routes.get("/user/:email", UserCtrl.verifyJWT, UserCtrl.getUserEmail)

routes.post("/user/login", UserCtrl.login)
routes.get('/user/logout', function(req, res) {
  return res.json({ auth: false, token: null });
})

module.exports = routes;