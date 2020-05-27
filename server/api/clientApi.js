var db = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap');

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

router.post('/add', (req, res) => {
    var sql = $sql.client.add;
    var data = req.body;
    conn.query(sql, [data.clientname, data.sex, data.phone, data.idcard, data.source], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send('新增成功')
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
    var finClients = [];
    conn.query(sql, data.user, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            conn.query(sql1, (err, clients) => {
                if (err) {
                    console.log(err);
                } else {
                    
                    result.forEach(element => {
                        temp = clients.filter(a => a.id == element.client_id)
                        finClients.push(temp[0])
                    });
                    res.send(finClients)
                }
            })


        }
    })
});

module.exports = router;