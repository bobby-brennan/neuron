var Neuron = require('./lib/neuron.js');
var MJ = require('mathjs');

var OPTIONS = {
  h_size: 2,
  x_size: 2,
  y_size: 2
}

var NUM_STEPS = 5000;

var n = new Neuron(OPTIONS);

var IN_SEQ = [
  MJ.matrix([.1, .7]),
  MJ.matrix([.5, -.2]),
  MJ.matrix([-.3, -.3])
]

for (var i = 0; i < NUM_STEPS; ++i) {
  var seqIdx = i % IN_SEQ.length;
  var input = IN_SEQ[seqIdx];
  var expected = IN_SEQ[(seqIdx + 1) % IN_SEQ.length];
  var output = n.probe(input);
  console.log('\n\nstep', output._data);
  n.train(input, output, expected);
  console.log('train', input._data, output._data, expected._data);
  n.step();
}

console.log('\n\nNeuron:\n', n.toString());
