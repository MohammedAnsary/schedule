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

    var slotNames = JSON.stringify(data.parsed.slotsNames).replace(/['"]+/g, '').toLowerCase()

    var creditHours = new Array();
    for(var i = 0; i < data.parsed.courseNames.length; i++) {
        var value = data.parsed.slotsNames[i].length * 2;
        creditHours.push(value);
    }
    creditHours = JSON.stringify(creditHours);
    console.log(creditHours);

    // index.ask("choose_subjects_and_generate_schedule(" + variables.allowedCreditHours + "," + variables.ObligatoryCourses + "," + variables.coursesCreditHours + "," + variables.probation + "," + variables.history + "," + variables.prerequisites + "," + variables.coursesTimings + "," + variables.coursesGroups + "," + variables.slotsNames + "," + variables.condensed + "," + variables.totalCreditHours + "," + variables.newCoursesSched + "," + variables.groupsSched + ")", parseInt(req.body.chunk), function(result) {
    //     return res.send({
    //         response: result
    //     });
    // });
    // res.send(user_id + ' ' + token + ' ' + geo);
    // console.log(req.body);
    res.send(req.body);
});

module.exports = router;
