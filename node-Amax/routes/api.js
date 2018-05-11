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
            connection.release();
            if(!err) {
                res.json(rows);
            }
        });

        connection.on('error', function(err) {
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
    handle_database(req,res, "select * from employee where employee_name='" + req.query.employeeName + "'") ;
});

module.exports = router;
