var express = require('express')
var path = require('path')
var app = express()
var session = require('express-session')
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cp = require('child_process');
var pengines = require('pengines');
var routes = require('./routes/main');
var fileUpload = require('express-fileupload');
var fs = require('fs');

app.use(fileUpload());
app.use('/', routes);
app.use(function(req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

var peng = require('./connection')
    //peng.connect();

//peng.next();
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({
    extended: true
}));
// app.use(cors());

app.get('/', (req, res) => {
    res.send("Use /upload to upload csv and /plquery to start scheduler");
});

app.post('/upload', function(req, res) {
	// console.log(req.files.fileToUpload.data);
	fs.writeFile("uploads/data.csv", req.files.fileToUpload.data, function(err) {
		if (err) {
	        return console.log(err);
	    }
	    console.log("The file was saved!");
	    // var arr = csvToArray(req.files.fileToUpload);
	    // var parsed = parse(arr);
		fs.readFile('uploads/data.csv', 'utf8', function (err,data) {
			if (err) {
				res.send(JSON.stringify(err));
			}
			var arr = csvToArray(data);
			var parsed = parse(arr);
			console.log(parsed.groupMap)
			res.json(parsed);
		});
	});

});
app.listen(8888);

function parse(entries) {
    var parsedTimings = new Array();
    var parsedGroups = new Array();
    var courseNames = new Array();
    var parsedGroupNames = new Array();
    var groupMap = {};
    var groupSoFar = 0;
    for (var i = 0; i < entries.length;) {
        var timingsCourse = new Array();
        var groupsCourse = new Array();
        var course = entries[i][0];
		parsedTimings.push(timingsCourse);
		parsedGroups.push(groupsCourse);
        courseNames.push(course);
        for (var j = i; j < entries.length && course == entries[j][0];) {
            var type = entries[j][4];
            for (var k = j; k < entries.length && type == entries[k][4];) {
                var group = entries[k][5];
                var idx = 0;
                if (!groupMap[group]) {
                    groupSoFar++;
                    groupMap[group] = groupSoFar;
                }
                for (var l = k; l < entries.length && group == entries[l][5]; l++) {
                    if (!timingsCourse[idx])
                        timingsCourse[idx] = new Array();
                    if (!groupsCourse[idx]) {
                        groupsCourse[idx] = new Array();
                        parsedGroupNames[idx] = new Array();
                    }
                    timingsCourse[idx].push(entries[l][3]);
                    if (type != 'Lecture') {
                        groupsCourse[idx].push(groupMap[group]);
                        parsedGroupNames[idx].push(course + ' ' + group);
                    }
					idx++;
                }
                k = l;
            }
            j = k;
        }
        i = j;
    }
	var parsed = {
		parsedTimings: parsedTimings,
		parsedGroups: parsedGroups,
		courseNames: courseNames,
		parsedGroupNames: parsedGroupNames,
		groupMap: groupMap
	}
	return parsed;
}

function csvToArray(csv) {
    rows = csv.split("\n");
    return rows.map(function(row) {
        return row.split(",");
    });
}
