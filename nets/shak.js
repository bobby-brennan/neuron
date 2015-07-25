var Neuron = require('../lib/neuron.js');

var FS = require('fs');
var MJ = require('mathjs');
var BitArray = require('node-bitarray');


var n = new Neuron({
  h_size: 20,
  x_size: 8,
  y_size: 256
})

FS.createReadStream(__dirname + '/../data/shak-short.txt', {encoding: 'utf8'}).on('data', function(data) {
  for (var i = 0; i < data.length; ++i) {
    var c = data.charCodeAt(i);
    var arr = BitArray.parse(c);
    while (arr.length < 8) arr.unshift(0);
    var input = MJ.matrix(arr);
    var output = n.probe(input);
    /*
    var cOut = 0;
    var maxProb = 0;
    for (var j = 0; j < output._data.length; ++j) {
      if (maxProb < output._data[j]) {
        maxProb = output._data[j];
        cOut = j;
      }
    }
    */
    //console.log(' in: ' + String.fromCharCode(c), input._data);
    if (i < data.length - 1) {
      var nextC = data.charCodeAt(i+1);
      var expected = MJ.squeeze(MJ.zeros(256));
      expected._data[nextC] = 1;
      n.train(input, output, expected);
    }
    n.step();
  }
  var start = 'a'.charCodeAt(0);
  console.log('start', start);
  for (var i = start; i < start + 52; ++i) {
    var input = BitArray.parse(i);
    while (input.length < 8) input.unshift(0);
    var next = n.probe(MJ.matrix(input));
    console.log(String.fromCharCode(i), next._data);
  }
}).on('end', function(data) {
  console.log('done');
})
