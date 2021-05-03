const User = require('../model/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const algorithm = 'aes-256-ctr';
const secretKey = process.env.SECRET_KEY_TRANSFER || 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';


class UserCtrl {

  async login(req, res) {
    const data = await User.findOne({"assign": req.body.assign});

    if(data != null && data.email === req.body.email) {
      const token = jwt.sign({id: data._id}, process.env.SECRET_KEY, {
        expiresIn: 60 * 60 * 24
      })
      return res.json({auth: true, token: token});
    }

    return res.status(500).json({message: 'Login inválido!'});
  }

  /*
  adiciona um novo usuário no banco de dados 
  */
  async addUser(req, res) {
    const nome = req.body.nome;
    const email = req.body.email;
    const password = decrypt(req.body.content, req.body.iv);
    const assign = createAssign(email, password)

    const data  = await User.create({nome, email, password, assign}) 
    
    if(data != null){
      return res.json({create: true, email: email});
    }
    
    return res.status(500).json({message: 'Não Foi possível adicionar usuário'});
  }

  async getUserEmail(req, res) {
      
    const data = await User.findOne({"email": req.params.email});
    
    return res.json(data ? {verify: true} : {verify: false})
  }

  /*
  Verifica se o token JWT é valido
   */
  verifyJWT(req, res, next){
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
      
      // se tudo estiver ok, salva no request para uso posterior
      req.userId = decoded.id;
      next();
    });
}

  createAssign(email, senha) {
    const header = JSON.stringify({
      'alg': 'HS256',
      'typ': 'JWT'
    });

    const payload = JSON.stringify({email: email, password: senha});

    const base64Header = Buffer.from(header).toString('base64').replace(/=/g, '');
    const base64Payload = Buffer.from(payload).toString('base64').replace(/=/g, '');
    const secret = process.env.SECRET_KEY

    const data = base64Header + '.' + base64Payload;

    const signature = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('base64');

    const signatureUrl = signature
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')

    return signatureUrl;
  }
  
  decrypt(password, iv){
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(password, 'hex')), decipher.final()]);

    return decrpyted.toString();
  };
}

module.exports = new UserCtrl();