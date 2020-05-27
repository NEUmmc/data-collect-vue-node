var db = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap');

var conn = mysql.createConnection(db.mysql);

conn.connect();

router.post('/login', (req, res) => {
    var sql = $sql.admin.select;
    var data = req.body
    conn.query(sql,[data.username],(err, result) => {
        if (err) {
            console.log(err);
        }else{
            if(result.length == 0){
                res.send('用户名错误')
            }else if(result[0].password != data.password){
                res.send('密码错误')
            }else{
                res.send('正确')
            }
        }
    })
});


module.exports = router;