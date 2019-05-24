var express          =  require("express");
var cors             =  require('cors');
var app              =  express();
var morgan           =  require('morgan');
var bodyParser       =  require('body-parser');
var methodOverride   =  require('method-override');
var fs               =  require('fs');
var multer           =  require('multer');
var path             =  require('path');
var port             =  process.env.PORT || 3600;
var router           =  express.Router(); 
var serveStatic      =  require('serve-static');
const helmet         =  require('helmet')


/***************************************************/

app.use(helmet())
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request
 

//CORS middleware
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    next();
}

//app.use(express.static('uploads'))
//app.use(express.static('uploads'));
require('./webservice/service.js')(app);
//app.post('/api', router);

app.listen(port,function(){
  console.log("server created "+port);
})
