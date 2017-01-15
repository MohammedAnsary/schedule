var express = require('express')
var app = express()
var session = require('express-session')
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cp = require('child_process');

// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());

app.post('/', (req, res) => {
	console.log(req.body);
	var childProcess = cp.spawn('swipl');

	childProcess.stdin.write('X is 1.');

	var stdin = process.openStdin();
	stdin.addListener('data', (data) => {
		childProcess.stdin.write(';\n');
		console('haaah');
	});

	// childProcess.stderr.on('data', (data) => {
	// 	console.log(`${data}`);
	// 	var stdin = process.openStdin();
	// });

	childProcess.stdout.on('data', (data) => {
		console.log(`${data}`);
		var stdin = process.openStdin();
	});



	childProcess.addListener('data', (data)=> {
		childProcess.stdin.write(';\n');

	});

	// childProcess.stdout.on('data', (data) => {
	// 	console.log(`${data}`);
	// });
	// childProcess.stdout.setEncoding('utf8');
	res.send('lol');
});

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
