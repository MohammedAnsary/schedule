var express = require('express');
var router = express.Router();
var index = require('../connection');
var fs = require('fs');

/* GET home page. */
// router.get('/', function(req, res, next) {
//  index.connect()
// });

router.get('/ask', function(req, res) {
    // index.ask("assign_sched(CoursesSched,GroupsSched,[[[2,10], [8,3], [13,25]]],[[[], [1,2], [1,2]]], 1, 3, 2 )");
    index.ask("assign_sched(CoursesSched,GroupsSched,[[[2,10], [8,3], [13,25]]],[[[], [1,2], [1,2]]], 1, 3, 2 )",function(result) {
            return res.send({
                response: result
            });            
    });
    

});

router.get('/next', function(req, res) {   
 index.getNext( function(result){
        return res.send({
            response: result
        });
    });
 
});

router.post('/upload', function(req, res) {
    fs.writeFile("uploads/data.csv", req.files.fileToUpload, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
    });
    // console.log(req.files)

    res.send('test');
});

module.exports = router;
