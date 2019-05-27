var express         =   require("express");
var fs              =   require('fs');
var mysql           =   require('mysql');
var http            =   require("http");
var redis           =   require('redis');
var ip              =   "10.0.0.6";
//var client          = redis.createClient(6379,ip); // this creates a new client
var client          =   redis.createClient(); // this creates a new client
var request         =   require('request');
var async           =   require('async');

/**************************************************/
/********************** redis connection*********************************/
client.on('connect', function() {
        console.log('Redis client connected');
});
client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});
/*************************************************/
/*var con = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'tutorial_database'
});
var pool  = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'tutorial_database'
});*/
/*con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});*/
/************************** add query ************************/
/*function addRow(data) {
    let insertQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
    let query = mysql.format(insertQuery,["todo","user","notes",data.user,data.value]);
    con.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows added
        console.log(response.insertId);
    });
}*/
/********************************************************************/
/*function handle_database(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
        connection.query("select * from user_tbl",function(err,rows){
            connection.release();
            if(!err) {
                //connection.release();
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}*/
/**************************** Insert query****************************************/
/*function insert_query(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
         var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
        connection.query(sql,function(err,rows){
            connection.release();
            if(!err) {
                //connection.release();
                res.json(rows);
            }           
        });

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}*/
/**************************************************************************/
module.exports = function (app) {

   
    // user routs
    app.post('/api/userRegistation', function (req, res) {
      //handle_database(req,res);
        res.json(req.body);

    });
   /************************Aadhar no and dob auth service *******************/
   app.post('/api/aadharAuthService',function(req,res){

      //client.setex('1234567', 3600, JSON.stringify(req.body))
      res.json(req.body);
    
   })
   /***************************auth service *****************************/
   app.post('/api/otpAuthService',function(req,res){
      //client.get('123', (err, photos) => {console.log(JSON.parse(photos));})
      async.waterfall([
          function (callback) {
              console.log('First Step --> ');
              callback(null, '1', '2');
          },
          function (arg1, arg2, callback) {
              console.log('Second Step --> ' + arg1 + ' ' + arg2);
              callback(null, '3');
          },
          function (arg1, callback) {
              console.log('Third Step --> ' + arg1);
              callback(null, 'final result');
          }
      ], function (err, result) {
          console.log('Main Callback --> ' + result);
          res.json(req.body);
      });
      
    
   })
   /************************** print uwin details otp verification ********************/
   
   app.post('/api/otpAuthServiceForUwinPrint',function(req,res){
      //client.get('123', (err, photos) => {console.log(JSON.parse(photos));})
      
      //https://interconnectsoft.com/sendurlcomma.aspx?user=20081030&pwd=nzz2zp&senderid=VSPLEB&smstype=0&mobileno=8670021081&msgtext=test
      
      var uwinNo = req.body.uwinNo;
      async.waterfall([
          function (callback) {
              /**************** check uwin no is valid or not **************/
              var validate=true;

              if(uwinNo=='12345678')
              {
                /******** if true save data in rdish cache ****************/
                console.log('First Step --> vaid data');
                callback(null, '1', '2');
              }
              else
              {
                console.log('First Step --> invaid data');
                callback(null, '2', '2');
              }
              
          },
          function (arg1, arg2, callback) {
              if(arg1=='1')
              {
                /**************** insert data in to redish here ***************/
                console.log('Second Step store data in redish --> ' + arg1 + ' ' + arg2);
                callback(null, '1');
              }
              else
              {
                /****************** no need to store data just pass to next step ************/
                console.log('Second Step no need to store data --> ' + arg1 + ' ' + arg2);
                callback(null, '2');
              }
              
          },
          function (arg1, callback) {
              if(arg1=='1')
              {
                  /************************* send otp ***************/
                  console.log('Third Step --> ' + arg1);
                  callback(null, '1');
              }
              else
              {
                console.log('Third Step --> ' + arg1);
                callback(null, '2');
              }
              
          }
      ], function (err, result) {
          if(result=='1')
          {
            console.log('otp send success fully --> ' + result);
            var response={
              "status" : "success",
              "message": "Otp send to your mobileno."
            };
            res.status(200).json(response);
          }
          else
          {
              console.log('invalid uwin--> ' + result);
              var response={
                "status" : "failed",
                "message": "Otp not send."
              };
              res.status(202).json(response);
            }
          
      });

      //res.json(req.body);
   })
   /***************************validate otp and send print data  *****************************/
   app.post('/api/otpVerificationAndSendPrintData',function(req,res){
      //client.get('123', (err, photos) => {console.log(JSON.parse(photos));})
      var otp =true;
      if(req.body.otp=='1234' && req.body.uwinNo=='12345678')
      {
        var response={
              "status"          : "success",
              "aadharNo"        : "**** **** **** 5555",
              "fname"           : "UserFirstName",
              "lname"           : "UserLastName",
              "dob"             : "02/09/1999",
              "motherName"      : "UserMotherName",
              "fatherName"      : "UserFatherName",
              "mobileNo"        : "8888888888",
              "bankAccountNo"   : "847938998434899837893",
              "ifscCode"        : "sbi6565",
              "note"            : "this data are demo data for testing."
            };
        res.status(200).json(response);
      }
      else
      {
        var response={
              "status" : "failed",
              "message": "sorry no data avlable."
            };
        res.status(202).json(response);
      }
      
    
   })
}