var db = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap');

var conn = mysql.createConnection(db.mysql);

conn.connect();

router.post('/getTable', (req, res) => {
    console.log('触发的路由：api/table/getTable')
    var sql = $sql.table.select;
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            result.forEach(e => {
                if (e.category_name === e.question) {
                    e.question = ''
                }
                if (e.weight2 === e.weight1) {
                    e.weight2 = ''
                }
            })
            res.send(result)
        }
    })
});

router.post('/getScore', (req, res) => {
    console.log('触发的路由：api/table/getScore')
    var sql = $sql.record.select_clientid;
    var data = req.body;
    const querystring = require("querystring");
    conn.query(sql, data.client_id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            final = []
            temp = []
            result.forEach((element, index) => {
                username = element.username;
                colname = 'score' + index
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