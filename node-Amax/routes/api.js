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
                console.log("inside query execution rows " + JSON.stringify(rows));
                res.json(rows);
            } else {
                console.log("inside query error execution");
                res.sendStatus(400);
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
    handle_database(req,res, "select * from employee   left outer join  training_finished on employee.emp_id = " +
        "training_finished.emp_id  left outer join training on training_finished.training_id = training.Id " +
        "where f_name='" + req.query.employeeName + "'") ;
});

router.get('/employeeId', function(req, res, next) {
    console.log("employeeId = " + req.query.employeeId);
    handle_database(req,res, "select * from employee  left outer join  training_finished on employee.emp_id = " +
        "training_finished.emp_id  left outer join training on training_finished.training_id = training.Id " +
        "where employee.emp_id='" + req.query.employeeId + "'") ;
});

router.get('/employeeByTraining', function(req, res, next) {
    console.log("trainingName = " + req.query.trainingName);
    handle_database(req,res, "select * from employee  join  training_finished on employee.emp_id = " +
        "training_finished.emp_id join training on training_finished.training_id = training.Id " +
        "where training_name='" + req.query.trainingName + "'") ;
});


router.get('/join_Employee', function(req, res, next) {
    console.log(req.query.addEmployee);
    handle_database(req,res, "select * from employee  join  training_finished on employee.emp_id = " +
        "training_finished.emp_id join training on training_finished.training_id = training.Id " +
        "where f_name='" + req.query.employeeName + "'") ;
});


// for adding new employee information
router.get('/addEmployee', function(req, res, next) {

    var insert_str = "insert into employee  (department,f_name,l_name,emp_id,position)" +
        " values (\"" + req.query.department + "\",\"" + req.query.firstName +  "\",\"" + req.query.lastName + "\",\""
        + req.query.employeeId + "\",\"" + req.query.position + "\")";
    console.log("insert_str= " + insert_str);
    handle_database(req,res, insert_str );
})

router.get('/addTraining', function(req, res, next) {

    var insert_str = "insert into training (training_name,trainer,course_descriptions)" +
        " values (\"" + req.query.trainingName + "\",\"" + req.query.Trainer +  "\",\"" + req.query.courseDescriptions + "\")";
    console.log("insert_str= " + insert_str);
    handle_database(req,res, insert_str );
})

router.get('/trainingFinished', function(req, res, next) {

    var insert_str = "insert into training_finished (emp_id,training_id,s_date,f_date)" +
        " values (\"" + req.query.employeeId+  "\",\" "+ req.query.trainingId +  "\",\"" + req.query.startDate+ "\",\""+ req.query.finishedDate + "\")";
    console.log("insert_str= " + insert_str);
    handle_database(req,res, insert_str );
})

router.get('/trainingDisplay', function(req, res, next) {

    var insert_str = "insert into training_finished (emp_id,training_id,s_date,f_date)" +
        " values (\"" + req.query.employeeID +  "\",\" "+ req.query.trainingID+  "\",\"" + req.query.startDate+ "\",\""+ req.query.finishDate + "\")";
    console.log("insert_str= " + insert_str);
    handle_database(req,res, insert_str );
})

module.exports = router;
