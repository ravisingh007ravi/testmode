const { errorHandlingdata } = require('../error/errorHandling')
const jwt =require('jsonwebtoken')

exports.userAuthenticate = (req, res, next) => {
    try {
        const token = req.headers["x-api-key"]
       
        if (!token) { return res.status(400).send({ status: false, msg: "Token must be present" }) }

        const decodedToken = jwt.verify(token, process.env.JWT_User_SECRET_KEY)
        req.user = decodedToken
     
        next()
    }
    catch (e) { errorHandlingdata(e, res) }

}

exports.userAuthorize = (req, res, next) => {
    try {
        const jwtUserId = req.user.userId
        const id = req.params.id

        if(!id) return res.status(400).send({ status: false, msg: "id must be present" })
        if (id != jwtUserId) { return res.status(400).send({ status: false, msg: "Unauthorized User" }) }
     
        next()
    }
    catch (e) { errorHandlingdata(e, res) }

}

