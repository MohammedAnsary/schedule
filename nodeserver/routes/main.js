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

// router.get('/next/:chunk', function(req, res) {
//     console.log(req.params.chunk);
//     index.ask("assign_sched(CoursesSched,GroupsSched,[[[2,10], [8,3], [13,25]]],[[[], [1,2], [1,2]]], 1, 3, 2 )", parseInt(req.params.chunk), function(result) {
//             return res.send({
//                 response: result
//             });
//     });
// });
router.post('/next', function(req, res) {
    var data = req.body;

    var probation = data.probation? 1:0;
    var condensed = data.condensed? 1:0;
    var allowedCreditHours = data.credits.length > 0? parseInt(data.credits):0;

    var obligatoryCourses = new Array();
    for(var i = 0; i < data.parsed.courseNames.length; i++) {
        var val = data[`oblig${i+1}`]? 1:0;
        obligatoryCourses.push(val);
    }
    obligatoryCourses = JSON.stringify(obligatoryCourses);

    var history = new Array();
    for(var i = 0; i < data.parsed.courseNames.length; i++) {
        var val = parseInt(data[`history${i+1}`]);
        history.push(val);
    }
    history = JSON.stringify(history);

    var coursesTimings = JSON.stringify(data.parsed.parsedTimings).replace(/['"]+/g, '');
    var coursesGroups = JSON.stringify(data.parsed.parsedGroups).replace(/['"]+/g, '');
    console.log(coursesTimings)
    var slotNames = JSON.stringify(data.parsed.slotsNames).replace(/['"]+/g, '').toLowerCase()

    var creditHours = new Array();
    for(var i = 0; i < data.parsed.courseNames.length; i++) {
        var value = data.parsed.slotsNames[i].length * 2;
        creditHours.push(value);
    }
    creditHours = JSON.stringify(creditHours);
    prerequisites = "[[],[1],[],[3,6],[3,5],[3],[3,6],[3,6],[3,6],[3,6],[3,6],[3,6],[3,6],[3,6],[3,6],[3,6],[3,6],[3,6],[],[],[20,19],[],[22],[22],[],[25],[25],[],[1]]"  
    index.ask(`choose_subjects_and_generate_schedule(${allowedCreditHours}, ${obligatoryCourses}, ${creditHours}, ${probation}, ${history}, ${prerequisites}, ${coursesTimings}, ${coursesGroups}, ${slotNames}, ${condensed}, TotalCreditHours, NewCoursesSched, GroupsSched, TakenCourses )`, parseInt(1), function(result) {
        return res.send({
            response: result
        });
    });
});

module.exports = router;
