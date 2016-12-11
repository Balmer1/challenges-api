var express = require('express');
var app = express();

timestamp = function(req, res) {
    var date = req.params.date;
    date = Number(date) * 1000 || date;
    date = new Date(date);
    res.json({ 
        "unix": isNaN(date) ? null : date.getTime(),
        "natural": isNaN(date) ? null : date.toDateString()
    });
};

whoami = function(req, res) {
    var date = req.params.date;
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //console.log(req);
    res.json({ 
        "unix": ip,
        "natural": 2,
        "natural2": 3,
    });
};


index = function(req, res){
  res.render('index');
};

app.engine('jade', require('jade').__express);
app.set('views', __dirname + '/');
app.set('view engine', 'jade');

app.get('/timestamp/:date',timestamp );
app.get('/timestamp',index );
app.get('/whoami',whoami );
app.get('/',index );

app.listen(process.env.PORT || 3001);


//app.listen(3002, function () {  console.log('Example app listening on port 3002!');});



