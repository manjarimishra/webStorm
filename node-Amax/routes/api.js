var express = require('express');
var http = require('http');
var router = express.Router();
var mysql      = require('mysql');
var pool      =    mysql.createPool({
    connectionLimit : 1000, //important
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'manjari',
    debug    :  false
});


function handle_database(req,res, query) {

    pool.getConnection(function(err,connection){
        if (err) {
            connection.release();
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(query ,function(err,rows){
            console.log("inside query execution" + err);
            connection.release();
            if(!err) {
                res.json(rows);
            }
        });

        connection.on('error', function(err) {
            console.log("inside query error execution");
            res.json({"code" : 100, "status" : "Error in connection database"});
            return;
        });
    });
}



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('{"name" : "respond with a resource manjari"}');
});

router.get('/example', function(req, res, next) {
    http.request('http://example.com', function(response) {
        response.pipe(res);
    }).on('error', function(e) {
        res.sendStatus(500);
    }).end();
});



router.get('/employee', function(req, res, next) {
    console.log(req.query.employeeName);
 //   handle_database(req,res, "select * from employee where f_name='" + req.query.employeeName + "'") ;
    handle_database(req,res, "select * from employee  join  training_finished on employee.emp_id = " +
        "training_finished.emp_id join training on training_finished.training_id = training.Id " +
        "where f_name='" + req.query.employeeName + "'") ;
});


module.exports = router;
