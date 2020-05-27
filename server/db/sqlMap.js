var sqlMap = {
    admin: {
        select: 'select * from admin where username = ?'
    },
    user: {
        select: 'select * from user',
        select_username: 'select * from user where username = ?',
        select_id: 'select * from user where id = ?',
    },
    table: {
        select: 'select Q.id as question_id, C.id,category_name,question,Q.weight as weight2,C.weight as weight1 from question as Q,question_category as C where Q.category_id = C.id',
    },
    question: {
        get_question: 'select question from question,(select id from question_category where user like "%?%") as C where category_id = C.id',
        get_answer: 'select * from answer,(select question.id from question,(select id from question_category where user like "%?%") as C where category_id = C.id) as Q where Q.id = question_id',
        get_op_question: 'select question from question,(select id from question_category where user not like "%?%") as C where category_id = C.id',
        get_op_answer: 'select * from answer,(select question.id from question,(select id from question_category where user not like "%?%") as C where category_id = C.id) as Q where Q.id = question_id',
    },
    client: {
        select:'select * from client',
        add:'insert into client (clientname,sex,phone,idcard,source) values (?,?,?,?,?)',
    },
    record: {
        select_userid:'select * from record where user_id = ?',
        select_clientid:'select * from user,(select * from record where client_id = ?) as R where R.user_id = user.id',
        find_record:'select * from record where user_id = ? and client_id = ?',
        update_answer:'update record set answer = ? where id = ?',
        save_answer:'insert into record (user_id,client_id,answer) values (?,?,?)'
    }
}

module.exports = sqlMap