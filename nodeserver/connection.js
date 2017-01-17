var pengines = require('pengines');
var request = require('request');
var peng;
var func;
module.exports = {
    getNext: function() {
        return 5;
    },
    connect: function() {
        peng = pengines({
            server: "http://localhost:3030/pengine",
            chunk: 1,
        }).on('create', function() {
            console.log('connected to pl server');
        });
    },
    ask: function(q, callback) {
        if(peng != undefined ) peng.destroy();
        peng = pengines({
            server: "http://localhost:3030/pengine",
            chunk: 1,
        }).on('create', function() {
            console.log('connected to pl server');
            peng.ask(q).on('success', function(result) {
                var i, len, ref, resultData, results;
                ref = result.data;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    resultData = ref[i];
                    results.push(resultData);
                }
                func = peng.next;
                callback(results);
            });  
        });        

    
    },
    getNext: function(callback) {
        var prologRequest = func();
        prologRequest.on('success', function(result) {
            var i, len, ref, resultData, results;
            ref = result.data;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
                resultData = ref[i];
                results.push(resultData);
            }
            callback(results);
        });
        prologRequest.on('error',function(result){
            callback(result);
        });
    }    

}
