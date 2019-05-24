var express         =   require("express");
var fs              =   require('fs');
var mysql           =   require('mysql');
var http            = require("http");
var redis           = require('redis');
var client          = redis.createClient(); // this creates a new client

/**************************************************/
/********************** redis connection*********************************/
client.on('connect', function() {
        console.log('Redis client connected');
});
client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});
/*************************************************/
var con = mysql.createConnection({
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
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
/************************** add query ************************/
function addRow(data) {
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
}
/********************************************************************/
function handle_database(req,res) {
    
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
}
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
      handle_database(req,res);
        //res.json(req.body.uid);

    });
   /************************Aadhar no and dob auth service *******************/
   app.post('/api/aadharAuthService',function(req,res){
    const userRedisKey = 'user:adharData';
    //client.set('my test key', 'my test value', redis.print);
    client.get(userRedisKey, (err, data) => {
 
        // If that key exists in Redis store
        if (data) {
            
            res.json({ source: 'cache', data: JSON.parse(data) })
 
        } else { // Key does not exist in Redis store
 
            
 
                    // Save the  API response in Redis store,  data expire time in 3600 seconds, it means one hour
                    client.setex(userRedisKey, 3600, req)
                    //client.setex(userRedisKey, 3600, JSON.stringify(req))
                    res.json(req.body);
                    // Send JSON response to client
                    //return res.json({ source: 'api', data: photos })
 
                
        }
    });
    
   })
   

}