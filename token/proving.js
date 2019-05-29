const jwt = require('jsonwebtoken');
const serect = 'token';  //密钥，不能丢
module.exports = (tokens) => {

    if (tokens) {
        // let toke = tokens.split(' ')[1];
        // console.log(toke)
        // 解析
        let decoded = jwt.verify(tokens, serect)
        // console.log(decoded)
        return decoded;
    }
};