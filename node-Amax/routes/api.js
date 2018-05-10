var express = require('express');
var http = require('http');
var router = express.Router();
var mysql      = require('mysql');
var pool      =    mysql.createPool({
    connectionLimit : 1000, //important
    host     : '54.245.34.77',
    user     : 'user',
    password : 'user',
    database : 'amax',
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
    res.send('respond with a resource manjari');
});

router.get('/example', function(req, res, next) {
    http.request('http://example.com', function(response) {
        response.pipe(res);
    }).on('error', function(e) {
        res.sendStatus(500);
    }).end();
});



router.get('/employees', function(req, res, next) {
    handle_database(req,res, "select * from Employee");
});

module.exports = router;
