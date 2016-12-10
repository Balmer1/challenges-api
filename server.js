var express = require('express');
var app = express();

index1 = function(req, res) {
    var date = req.params.date;
    //date = Number(date) || date;
    date = Number(date) * 1000 || date;
    date = new Date(date);
    res.json({ 
        "unix": isNaN(date) ? null : date.getTime(),
        "natural": isNaN(date) ? null : date.toDateString()
    });
};

index2 = function(req, res){
  res.render('index');
};

app.engine('jade', require('jade').__express);
app.set('views', __dirname + '/');
app.set('view engine', 'jade');


app.get('/:date',index1 );
app.get('/',index2 );

app.listen(process.env.PORT || 3000);


//app.listen(3002, function () {  console.log('Example app listening on port 3002!');});



