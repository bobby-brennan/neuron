var MathUtil = require('./math.js');
var MJ = require('mathjs');

var LOG = false;

var Neuron = module.exports =  function(options) {
  this.h = MathUtil.getVector(options.h_size, 0);
  this.weights = {};
  this.weights.hh = MathUtil.getMatrix(options.h_size, options.h_size, Math.random);
  this.weights.xh = MathUtil.getMatrix(options.x_size, options.h_size, Math.random);
  this.weights.hy = MathUtil.getMatrix(options.h_size, options.y_size, Math.random);
  if (LOG) console.log(this.weights);
}

Neuron.prototype.step = function(input) {
  if (LOG) console.log('  x', input._data);
  var history = MJ.multiply(this.weights.hh, this.h);
  if (LOG) console.log('  h', history._data);
  var newInfo = MJ.multiply(this.weights.xh, input);
  if (LOG) console.log('  i', newInfo._data);
  var sum = MJ.add(history, newInfo);
  if (LOG) console.log('  i+h', sum._data);
  this.h = MathUtil.sigmoid(sum);
  if (LOG) console.log('  s(i+h)', this.h._data)
  var output = MJ.multiply(this.weights.hy, this.h);
  if (LOG) console.log('  o', output._data);
  if (LOG) {
    console.log('-----');
    console.log('  y', this.weights.hy._data);
    console.log('  h', this.h._data);
    console.log('  o', output._data);
    console.log('-----');
  }
  return output;
}

Neuron.prototype.train = function(actual, expected) {
  var loss = this.getLoss(actual, expected);
  console.log('loss', loss);
  for (name in this.weights) {
    this.weights[name] = this.weights[name].map(function(w) {
      var randPct = (Math.random() - .5) * 2;
      randPct = randPct * .05;
      var adj = .9 * loss + .1 * randPct;
      return w + (w * adj)
    })
  }
}

Neuron.prototype.getCosLoss = function(actual, expected) {
  var dot = MJ.dot(actual, expected);
  var size = MJ.norm(actual) * MJ.norm(expected);
  var similarity = dot / size;
  return 1 - (similarity + 1) / 2;
}

Neuron.prototype.getLoss = function(actual, expected) {
  return MathUtil.distance(actual, expected);
}
