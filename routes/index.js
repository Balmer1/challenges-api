var os = require("os");
var imageSearch = require('node-google-image-search');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var url = process.env.MONGOLAB_URI;
var CSE_ID = process.env.CSE_ID;
var CSE_API_KEY = process.env.CSE_API_KEY;


exports.index = function (req, res) {
  res.render('index');
}

exports.timestamp = function (req, res) {
  res.render('timestamp');
}

exports.who = function (req, res) {
  res.render('whoami');
}

exports.shorturl = function (req, res) {
  res.render('shorturl');
}

exports.image = function (req, res) {
  res.render('imagesearch');
}

exports.timestampdate = function(req, res) {
    var date = req.params.date;
    date = Number(date) * 1000 || date;
    date = new Date(date);
    res.json({ 
        "unix": isNaN(date) ? null : date.getTime(),
        "natural": isNaN(date) ? null : date.toDateString()
    });
}


exports.whoami = function(req, res) {
    res.json({ 
        "ipaddress": req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        "language": req.headers["accept-language"].split(',', 1)[0],
        "software": os.type()
    });
};

exports.newurl = function(req, res, next) {
    var path = req.path.substr(1);
    var heroku_path = 'https://freecodecamp-balmer.herokuapp.com/shorturl/';
    var id = Math.floor(Math.random()*9000) + 1000;

    if(isURL(path)){
		MongoClient.connect(url, function (err, db) {
		  if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		  } else {
			var collection = db.collection('urls');
			var row = {url_id: id, url: path };

			collection.insert([row], function (err, result) {
			  if (err) {
				console.log(err);
			  } else {
				res.json({ 
					"original_url": path,
					"short_url": heroku_path + id
				});
			  }
			  db.close();
			});
		  }
		});
    }else{
		res.json({ 
		    "error": "Wrong url format, make sure you have a valid protocol and real site.",
		});
    }
};

function isURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    return false;
  } else {
    return true;
  }
}

exports.geturl = function(req, res){
	var id = req.params.id;
	if(isNaN(id)){
		res.json({ 
			"error":"This url is not on the database."
		});
	}else{
        MongoClient.connect(url, function (err, db) {
		  if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		  } else {
			var collection = db.collection('urls');
			collection.find({url_id: Number(id)}).toArray(function (err, result) {
			  if (err) {
				console.log(err);
			  }else if (result.length) {
			    res.redirect(result[0].url);
			  }else {
				res.json({ 
					"error":"This url is not on the database."
				});
			  }
			  db.close();
			});
		  }
		});		
	}
}

function makeList(img) {
	return {
	  "url": img.link,
	  "snippet": img.title,
	  //"thumbnail": img.thumbnail.url,
	  "context": img.image.contextLink
	};
}

exports.imagesearch = function(req, res) {
	imageSearch(req.params.searchterm, function (results) {
		MongoClient.connect(url, function (err, db) {
		  if (err) {
			console.log('Unable to connect to the mongoDB server. Error:', err);
		  } else {
			var collection = db.collection('search-terms');
			var d = new Date();
			var n = d.toISOString();
			var row = {term: req.params.searchterm, when: n };
			collection.insert([row], function (err, result) {
			if (err) {
				console.log(err);
			}
			db.close();
			});
		  }
		});
        res.send(results.map(makeList));
	}, Number(req.query.offset), 10);
}


exports.latestimagesearch = function(req, res, next) {
	MongoClient.connect(url, function (err, db) {
	  if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	  } else {
		var collection = db.collection('search-terms');

		collection.find().limit(10).sort({when: -1}).toArray(function (err, results) {
			if (err) {
				console.error(err);
				return res.status(500).end(err.message);
			}
			res.json(results.map(function (el) {
				return {
					term: el.term,
					when: el.when
				};
			}));
		});

		db.close();
	  }
	});		
}

exports.upload = function (req, res) {
  res.render('upload');
}

exports.uploaded = function(req, res){
  console.log(req.file);
  res.json({ size: req.file.size });
}