var express = require('express');
var router = express.Router();
var index = require('../connection')

/* GET home page. */
router.get('/', function(req, res, next) {
 index.connect()
});

router.get('/ask', function(req, res) {
    // index.ask("assign_sched(CoursesSched,GroupsSched,[[[2,10], [8,3], [13,25]]],[[[], [1,2], [1,2]]], 1, 3, 2 )");
    index.ask("assign_sched(CoursesSched,GroupsSched,[[[2,10], [8,3], [13,25]]],[[[], [1,2], [1,2]]], 1, 3, 2 )", (result) => {
        res.send({
            response: result
        });
    });
});

router.get('/next', function(req, res) {
    // index.ask("assign_sched(CoursesSched,GroupsSched,[[[2,10], [8,3], [13,25]]],[[[], [1,2], [1,2]]], 1, 3, 2 )");
    index.next((result) => {
        res.send({
            response: result
        });
    });
});

module.exports = router;
