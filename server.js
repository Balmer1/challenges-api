var express = require('express');
var app = express();
var routes = require('./routes')
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' });
var favicon = require('serve-favicon');
var path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/timestamp/:date', routes.timestampdate );
app.get('/timestamp', routes.timestamp );

app.get('/whoami', routes.whoami );
app.get('/who', routes.who );

app.use('/shorturl/new', routes.newurl);
app.get('/shorturl/:id', routes.geturl);
app.get('/shorturl', routes.shorturl);

app.get('/imagesearch/:searchterm', routes.imagesearch);
app.use('/latest/imagesearch', routes.latestimagesearch);
app.get('/imagesearch', routes.image);


app.get('/upload',routes.upload );
app.post('/upload', upload.single('file'), routes.uploaded);

app.get('/',routes.index );

app.use(favicon(path.join(__dirname,'favicon.ico')));



app.listen(process.env.PORT || 3000);