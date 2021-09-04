const jwt = require('jsonwebtoken');

module.exports = function authenticateToken(req, res, next) {
    try{
    const authHeader = req.headers['authorization']
    var id = req.params.id;
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(401)
        if (user.login_id != id) return res.sendStatus(401)
        req.user = user
        next()
    })
}catch(err) {
    return res.status(404).json({ error: err, message: "something went wrong pls check filed" })
  } 
}