var db = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap');

var conn = mysql.createConnection(db.mysql);

conn.connect();

router.post('/getTable', (req, res) => {
    var sql = $sql.table.select;
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result)
        }
    })
});

router.post('/getScore', (req, res) => {
    var sql = $sql.record.select_clientid;
    var data = req.body;
    const querystring = require("querystring");
    conn.query(sql, data.client_id,(err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            final = []
            temp = []
            result.forEach((element,index) => {
                username = element.username;
                colname ='score'+index
                answers = element.answer.split(',')
                answers.forEach(element => {
                    temp.push(querystring.parse(element))
                })

                final.push({
                    colname: colname,
                    username: username,
                    answer: temp
                })
                temp = []
            });
            res.send(final)
        }
    })
});

router.post('/getAnswer', (req, res) => {
    var sql = $sql.record.select_clientid;
    var data = req.body;
    const querystring = require("querystring");
    conn.query(sql, data.client_id,(err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            final = []
            temp = []
            result.forEach((element,index) => {
                username = element.username;
                colname ='score'+index
                answers = element.answer.split(',')
                answers.forEach(element => {
                    temp.push(querystring.parse(element))
                })

                final.push({
                    colname: colname,
                    username: username,
                    answer: temp
                })
                temp = []
            });
            res.send(final)
        }
    })
});

module.exports = router;