const Episode = require("../model/Episode");

class EpisodeCtrl {
  async store (req, res){
    const data  = await Episode.create(req.body) 
    
    return res.json(data);
  }

  async index (req, res) {
    const data = await Episode.find({});

    return res.json(data);
  }

  async index (req, res) {
    const data = await Episode.find({});

    return res.json(data);
  }

  async findOne (req, res) {
    const data = await Episode.findOne({"id": req.params.id});

    return res.json(data);
  }

}

module.exports = new EpisodeCtrl();