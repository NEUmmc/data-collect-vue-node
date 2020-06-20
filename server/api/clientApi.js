var db = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap');
var moment = require('moment')

var conn = mysql.createConnection(db.mysql);

conn.connect();

router.post('/getClient', (req, res) => {
    var sql = $sql.client.select;
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {

            res.send(result)
        }
    })
});

router.post('/getClientById', (req, res) => {
    var sql = $sql.client.select_id;
    var data = req.body;
    conn.query(sql, data.id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(...result)
        }
    })
});

router.post('/getClientByPhone', (req, res) => {
    var sqlStringList = $sql.client.select_phone.split('?');
    let data = req.body.phone;
    var sql = sqlStringList[0] + data + sqlStringList[1]
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result)
        }
    })
});

router.post('/add', (req, res) => {
    var sql = $sql.client.add;
    var data = req.body;
    const time = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    conn.query(sql, [data.clientname, data.sex, data.phone, data.idcard, data.source, time], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send('新增成功')
        }
    })
});

router.post('/addMoney', (req, res) => {
    var sql = $sql.client.update_money;
    var data = req.body;
    conn.query(sql, [data.money, data.client_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send('客户承担价格增加成功')
        }
    })
});

router.post('/getUnfinClient', (req, res) => {
    var sql = $sql.record.select_userid;
    var data = req.body;
    var sql1 = $sql.client.select;
    var unfinClients = [];
    conn.query(sql, data.user, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            conn.query(sql1, (err, clients) => {
                if (err) {
                    console.log(err);
                } else {
                    unfinClients = clients
                    result.forEach(element => {
                        unfinClients = unfinClients.filter(a => a.id != element.client_id)
                    });
                    res.send(unfinClients)
                }
            })


        }
    })

});

router.post('/getFinClient', (req, res) => {
    var sql = $sql.record.select_userid;
    var data = req.body;
    var sql1 = $sql.client.select;
    var sqlStringList = $sql.question.get_question.split('?');
    let user_type = data.user_type;
    var sql2 = sqlStringList[0] + user_type + sqlStringList[1]
    var finClients = [];
    var halfFinClients = [];
    const querystring = require("querystring");//因为需要确定type = 1记录数量 来确定是否完成答题
    conn.query(sql, data.user, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            conn.query(sql1, (err, clients) => {
                if (err) {
                    console.log(err);
                } else {

                    conn.query(sql2, (err, questions) => {
                        if (err) {
                            console.log(err);
                        } else {
                            result.forEach(element => {
                                let num = element.answer.split(',').filter(x => querystring.parse(x).type == 1).length
                                let temp1 = clients.filter(a => a.id == element.client_id && questions.length <= num)
                                finClients.push(...temp1)
                                let temp2 = clients.filter(a => a.id == element.client_id && questions.length > num)
                                halfFinClients.push(...temp2)
                            });
                            let finalResult = { half: halfFinClients, fin: finClients, clients: clients.length }
                            res.send(finalResult)
                        }
                    })

                }
            })


        }
    })
});

module.exports = router;