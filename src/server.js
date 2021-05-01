const express = require("express");
const db = require("./database/config");
const mongoose = require("mongoose");

class App {
  constructor() {
    this.express = express();

    this.database();
    this.middlewares();
    this.routes();

    const port = process.env.PORT || 3003;

    this.express.listen(port, () => 
      console.log(`Sua API REST está funcionando na porta ${port} `)
    )
  }

  database() {
    mongoose.connect(db.uri, {useNewUrlParser: true, useUnifiedTopology: true});
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.use(require("./routes"));
  }

}

module.exports = new App().express;