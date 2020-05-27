// node 后端服务器
const adminApi = require('./api/adminApi')
const homeApi = require('./api/homeApi')
const tableApi = require('./api/tableApi')
const userApi = require('./api/userApi')
const clientApi = require('./api/clientApi')
const bodyParser = require('body-parser')
const express = require('express')
const app = express()

//采用设置所有均可访问的方法解决跨域问题
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.sendStatus(200); //让options尝试请求快速结束
    else
        next();
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// 后端api路由
app.use('/api/admin', adminApi);
app.use('/api/home', homeApi);
app.use('/api/table', tableApi);
app.use('/api/user', userApi);
app.use('/api/client', clientApi);
// 监听端口
app.listen(3000)
console.log('success listen at port:3000')