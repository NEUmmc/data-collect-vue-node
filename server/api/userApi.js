var db = require('../db/db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../db/sqlMap');

var conn = mysql.createConnection(db.mysql);

conn.connect();

router.post('/login', (req, res) => {
    var sql = $sql.user.select_username;
    var data = req.body
    conn.query(sql, [data.username], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            if (result.length == 0) {
                res.send({msg:'用户名错误'})
            } else if (result[0].password != data.password) {
                res.send({msg:'密码错误'})
            } else {
                user_type = result[0].user_type
                id = result[0].id
                user = { user_id: id, user_type: user_type }
                res.send(user)
            }
        }
    })
});

router.post('/addUser', (req, res) => {
    var sql = $sql.user.add;
    var data = req.body;
    conn.query(sql,[data.username, data.password, data.user_type], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send('新增成功')
        }
    })
});

router.post('/getUser', (req, res) => {
    console.log('触发对路由：' + '/getUser')
    var sql = $sql.user.select;
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result)
        }
    })
});

router.post('/getUserTypeName', (req, res) => {
    // console.log('触发对路由：' + '/getUserTypeName')
    var sql = $sql.user_type.select;
    var final = []
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            result.forEach(x => {
                let temp = {value:x.id, name:x.name}
                final.push(temp)
            })
            res.send(final)
        }
    })
});

router.post('/getSource', (req, res) => {
    var sql = $sql.user.select;
    var lst = ['无'];
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            temp = result.filter(x => x.user_type === '1').map(x => x.username)
            lst.push(...temp);
            res.send(lst);
        }
    })
});

router.post('/getQuestion', (req, res) => {
    var sqlStringList = $sql.question.get_question.split('?');//玄学bug，可能是update后表格出现了玄学变化,导致？传参数死活实现不了
    var user = req.body.user
    var sql = sqlStringList[0] + user + sqlStringList[1]
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result);
        }
    })
});

router.post('/getAnswer', (req, res) => {
    var sqlStringList = $sql.question.get_answer.split('?');//玄学bug，问题同上
    var user = req.body.user
    var sql = sqlStringList[0] + user + sqlStringList[1]
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            let items = []
            let temp = []
            for (let i = 0; i < result.length; i++) {
                if (i != 0 && result[i].id != result[i - 1].id) {
                    items.push(temp)
                    temp = []
                }
                temp.push({
                    id: result[i].id,
                    value: result[i].id + '/' + result[i].score + '/' + result[i].item + '/' + 1,//必答题为1
                    name: result[i].item
                })
                if (result.length - 1 == i) {
                    items.push(temp)
                    temp = []
                }
            }
            console.log(items)
            res.send(items)
        }
    })
});

router.post('/getOpQuestion', (req, res) => {
    var sqlStringList = $sql.question.get_op_question.split('?');//玄学bug，可能是update后表格出现了玄学变化,导致？传参数死活实现不了
    var user = req.body.user
    var sql = sqlStringList[0] + user + sqlStringList[1]
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            res.send(result);
        }
    })
});

router.post('/getOpAnswer', (req, res) => {
    var sqlStringList = $sql.question.get_op_answer.split('?');//玄学bug，问题同上
    var user = req.body.user
    var sql = sqlStringList[0] + user + sqlStringList[1]
    conn.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            let items = []
            let temp = []
            for (let i = 0; i < result.length; i++) {
                if (i != 0 && result[i].id != result[i - 1].id) {
                    items.push(temp)
                    temp = []
                }
                temp.push({
                    id: result[i].id,
                    value: result[i].id + '/' + result[i].score + '/' + result[i].item + '/' + 2,//选答题为2
                    name: result[i].item
                })
                if (result.length - 1 == i) {
                    items.push(temp)
                    temp = []
                }
            }
            console.log(items)
            res.send(items)
        }
    })
});

router.post('/getChecked', (req, res) => {
    var sql = $sql.record.find_record;
    var data = req.body
    conn.query(sql, [data.user_id, data.client_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            if (result.length == 0) {
                res.send({msg:'没有记录'})
            } else {
                const querystring = require("querystring");
                answers = result[0].answer.split(',')
                temp = []
                answers.forEach(element => {
                    temp.push(querystring.parse(element))
                })
                res.send(temp)
            }
        }
    })
});

router.post('/submit', (req, res) => {
    var sql = $sql.record.save_answer;
    var sql1 = $sql.record.update_answer;
    var sql2 = $sql.record.find_record;
    var data = req.body
    var record_id = ''
    const querystring = require("querystring");
    let results = ''
    console.log('触发路由为submit', data)
    data.result.forEach((element, index) => {
        if (index == data.result.length - 1) {
            results += querystring.stringify(element)
        } else {
            results += querystring.stringify(element) + ','
        }
    });
    conn.query(sql2, [data.user_id, data.client_id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result)
            if (result.length != 0) {
                record_id = result[0].id
                conn.query(sql1, [results, record_id], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result)
                        res.send({msg:'success'})
                    }
                })
            } else {
                conn.query(sql, [data.user_id, data.client_id, results], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(result)
                        res.send({msg:'success'})
                    }
                })
            }

        }
    })

});

module.exports = router;