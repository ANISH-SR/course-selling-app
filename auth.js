const jwt = require("jsonwebtoken");
const JWT_SECRET = "veritasao";

function auth(req, res, next) {
    const token = req.headers.token;
    const decoded_data = jwt.verify(token, JWT_SECRET);
    if(decoded_data){
        req.userId = decoded_data.id;
        next();
    }
    else{
        message: "Incorrect credentials"
    }
}

module.exports = {
    auth,
    JWT_SECRET
};