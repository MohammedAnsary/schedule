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
// peng = pengines({
//   server: "http://localhost:3030/pengine",
//   chunk: 1,
//   ask: 'assign_sched(CoursesSched,GroupsSched,[[[2,10], [8,3], [13,25]]],[[[], [1,2], [1,2]]], 1, 3, 2 ).',
//   destroy:false
// }).on('success', function(result) {
//   var i, len, ref, resultData, results;
//   ref = result.data;
//   results = [];
//   for (i = 0, len = ref.length; i < len; i++) {
//     resultData = ref[i];
//     results.push(console.log(resultData.CoursesSched));
//   }
//   return results;
// });
var peng = require('./connection')
peng.connect();

//peng.next();
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

app.post('/', (req, res) => {
	console.log(req.body);
	var childProcess = cp.spawn('swipl');

	childProcess.stdin.write('1 + 2');

	var stdin = process.openStdin();
	stdin.addListener('data', (data) => {
		childProcess.stdin.write(';\n');
		console('haaah');
	});

	childProcess.stderr.on('data', (data) => {
		console.log(`${data}`);
	});

	childProcess.stdout.on('data', (data) => {
		console.log(`${data}`);
	});

	res.send('lol');
});
app.locals.test = "omar"

  app.listen(8888);



















// var childProcess = cp.spawn('swipl', ['mini3.pl']);
//
// childProcess.stdout.setEncoding('utf8');
//
// var data_line = '';
// childProcess.stdin.write(query);
// var stdin = process.openStdin();
// stdin.addListener("data", function(d) {
//     childProcess.stdin.write(';\n');
// });
// childProcess.stdout.on("data", function(data) {
//   data_line += data;
//   if (data_line.split('=').length - 1 == 2) {
//     console.log(data_line);
//     data_line = '';
//     var stdin = process.openStdin();
//   }
// });
