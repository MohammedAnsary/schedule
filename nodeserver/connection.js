var pengines = require('pengines');
var peng;
module.exports = {
    getNext: function() {
        return 5;
    },
    connect: function() {
        peng = pengines({
            server: "http://localhost:3030/pengine",
            chunk: 1,
            destroy: false
        }).on('create', function() {
            console.log('connected to pl server');
        });
    },
    ask: function(q, callback) {
        peng.ask(q).on('success', function(result) {
            var i, len, ref, resultData, results;
            ref = result.data;
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
                resultData = ref[i];
                results.push(resultData);
            }
            callback(results);
        });
    }

}
