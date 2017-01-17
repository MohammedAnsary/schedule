var express = require('express')
var path = require('path')
var app = express()
var session = require('express-session')
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cp = require('child_process');
var pengines = require('pengines');
var routes = require('./routes/main');
app.use('/', routes);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

var peng = require('./connection')
//peng.connect();

//peng.next();
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

app.get('/', (req, res) => {
	res.send("Use /upload to upload csv and /plquery to start scheduler");
});


app.listen(8888);



function parse(entries) {
	var parsedTimings = new Array();
	var parsedGroups = new Array();
	var courseNames = new Array();
	var parsedGroupNames = new Array();
	var groupMap = new Array();
	var groupSoFar = 0;
	for(var i = 0; i < entries.length;) {
		var timingsCourse = new Array();
		var groupsCourse = new Array();
		var course = entries[i][0];
		courseNames.push(course);
		for(var j = i; j < entries.length && course == entries[j][0];) {
			var type = entries[j][4];
			for(var k = j; k < entries.length && type == entries[k][4];) {
				var group = entries[k][5];
				var idx = timingsCourse.length;
				if(!groupMap[group]) {
					groupSoFar++;
					groupMap[group] = groupSoFar;
				}
				for(var l = k; l < entries.length && group == entries[l][5]; l++) {
					if(!timingsCourse[idx])
						timingsCourse[idx] = new Array();
					if(!groupsCourse[idx]) {
						groupsCourse[idx] = new Array();
						parsedGroupNames[idx] = new Array();
					}
					timingsCourse[idx].push(entries[l][3]);
					if(type != 'Lecture') {
						groupsCourse[idx].push(groupMap[group]);
						parsedGroupNames[idx].push(course + ' ' + group);
					}
				}
				k = l;
			}
			j = k;
		}
		i = j;
	}
}

function csvToArray (csv) {
	rows  = csv.split("\n");
	return rows.map(function (row) {
		return row.split(",");
	});
};

