var Neuron = require('../lib/neuron.js');
var MJ = require('mathjs');

var Expect = require('chai').expect

describe('Neuron', function() {
  it('should predict repeating sequences', function() {
    this.timeout(7000);
    var OPTIONS = {
      h_size: 2,
      x_size: 2,
      y_size: 2
    }
    var n = new Neuron(OPTIONS);

    var MAX_DIFF = .05;
    var NUM_STEPS = 5000;
    var IN_SEQ = [
      MJ.matrix([.1, .7]),
      MJ.matrix([.5, -.2]),
      MJ.matrix([-.3, -.3])
    ]

    for (var i = 0; i < NUM_STEPS * IN_SEQ.length; ++i) {
      var seqIdx = i % IN_SEQ.length;
      var input = IN_SEQ[seqIdx];
      var expected = IN_SEQ[(seqIdx + 1) % IN_SEQ.length];
      var output = n.probe(input);
      n.train(input, output, expected);
      n.step();
    }

    for (var i = 0; i < IN_SEQ.length; ++i) {
      var output = n.probe(IN_SEQ[i]);
      n.step();
      var expected = IN_SEQ[(i + 1) % IN_SEQ.length];
      console.log(output._data, expected._data);
      var diff = MJ.subtract(output, expected);
      diff.forEach(function(val) {
        Expect(Math.abs(val)).to.be.lessThan(MAX_DIFF);
      })
    }
  });
});
