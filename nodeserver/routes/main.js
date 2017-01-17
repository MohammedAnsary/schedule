var express = require('express');
var router = express.Router();
var index = require('../connection');

/* GET home page. */
// router.get('/', function(req, res, next) {
//  index.connect()
// });

router.get('/ask', function(req, res) {
    chunk = 1;
    // index.ask("assign_sched(CoursesSched,GroupsSched,[[[2,10], [8,3], [13,25]]],[[[], [1,2], [1,2]]], 1, 3, 2 )");
    index.ask("assign_sched(CoursesSched,GroupsSched,[[[2,10], [8,3], [13,25]]],[[[], [1,2], [1,2]]], 1, 3, 2 )", chunk, function(result) {
            return res.send({
                response: result
            });
    });


});

router.get('/next/:chunk', function(req, res) {
    console.log(req.params.chunk);
    index.ask("assign_sched(CoursesSched,GroupsSched,[[[2,10], [8,3], [13,25]]],[[[], [1,2], [1,2]]], 1, 3, 2 )", parseInt(req.params.chunk), function(result) {
            return res.send({
                response: result
            });
    });

});

module.exports = router;
