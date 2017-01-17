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
	var slotsNames = new Array();
    var groupMap = {};
    var groupSoFar = 0;
	for (var w = 0; w < entries.length - 1; w++) {
		var str = entries[w][5].trim().replace(/ +/g, ' ');
		console.log(str);
		var length = str.length;
		var idx = length - 3;
		entries[w][5] = str.substr(0, idx) + str.substr(idx + 1, length);
	}
    for (var i = 0; i < entries.length - 1;) {
        var timingsCourse = new Array();
        var groupsCourse = new Array();
		var groupSlots = new Array();
        var course = entries[i][0];
		slotsNames.push(groupSlots);
		parsedTimings.push(timingsCourse);
		parsedGroups.push(groupsCourse);
        courseNames.push(course);
        for (var j = i; j < entries.length && course == entries[j][0];) {
            var type = entries[j][4];
			var idx;
            for (var k = j; k < entries.length && type == entries[k][4];) {
                var group = entries[k][5];
                idx = 0;
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
			for(var index = 0; index < idx; index++) {
				groupSlots.push(type);
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
		groupMap: groupMap,
		slotsNames: slotsNames
	}
	return parsed;
}

function csvToArray(csv) {
    rows = csv.split("\n");
    return rows.map(function(row) {
        return row.split(",");
    });
}
