var Neuron = require('./lib/neuron.js');
var MJ = require('mathjs');

var OPTIONS = {
  h_size: 2,
  x_size: 2,
  y_size: 2
}

var NUM_STEPS = 5;

var n = new Neuron(OPTIONS);

var input = MJ.matrix([.2, .3]);
for (var i = 0; i < NUM_STEPS; ++i) {
  var output = n.step(input);
  console.log('step', output._data);
  n.train(output, MJ.matrix([.4, .5]))
}
