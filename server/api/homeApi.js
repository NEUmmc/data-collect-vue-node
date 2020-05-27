var db = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap');

var conn = mysql.createConnection(db.mysql);

conn.connect();

router.post('/clientNum', (req, res) => {
    var sql = $sql.client.select;
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            let clientNum = String(result.length)
            res.send(clientNum)
        }
    })
});

module.exports = router;