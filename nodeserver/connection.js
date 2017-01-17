var pengines = require('pengines');
var request = require('request');
var peng;
var nextCount;
module.exports = {

    connect: function() {
        peng = pengines({
            server: "http://localhost:3030/pengine",
            chunk: 1,
        }).on('create', function() {
            console.log('connected to pl server');
        });
    },
    ask: function(q, chunk, callback) {
        if(peng != undefined ) peng.destroy();
        peng = pengines({
            server: "http://localhost:3030/pengine",
            chunk: chunk,
            ask:q,
        });
        peng.on('success', function(result) {
            console.log('connected to server')
                var i, len, ref, resultData, results;
                ref = result.data;
                results = [];
                    resultData = (ref.length == chunk )? ref[chunk - 1] : "No more solutions";
                    results.push(resultData);
               callback(results)              
            });   
           
    },
    getNext: function(callback) {
        var prologRequest = peng.next();
        prologRequest.on('success', function(result) {
            var i, len, ref, resultData, results;
            ref = result.data;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
                resultData = ref[i];
                results.push(resultData);
            }
            console.log(results[0].CoursesSched);
            callback(results);
        });
        prologRequest.on('error',function(result){
            callback(result);
        });
    },
    next: function(q, callback) {
        if(peng != undefined ) peng.destroy();
        peng = pengines({
            server: "http://localhost:3030/pengine",
            chunk: 2,
            ask:q,
        }).on('success', function(result) {
            console.log('connected to server')
                var i, len, ref, resultData, results;
                ref = result.data;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    resultData = ref[i];
                    results.push(resultData);
                }
               callback(results)              
            });       
    },
}
