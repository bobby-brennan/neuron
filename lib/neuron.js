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

Neuron.prototype.toString = function() {
  var ret = '';
  ret += '-----' + '\n';
  ret += '  h     ' + this.h._data + '\n';
  ret += '  w_hh  ' + this.weights.hh._data + '\n';
  ret += '  w_xh  ' + this.weights.xh._data + '\n';
  ret += '  w_hy  ' + this.weights.hy._data + '\n';
  ret += '-----' + '\n';
  return ret + '\n';
}

Neuron.prototype.probe = function(input, isTest) {
  if (LOG) console.log(this.toString());
  if (LOG) console.log('  x', input._data);
  
  var history = MJ.multiply(this.h, this.weights.hh);
  if (typeof history === 'number') history = MJ.matrix([history]);
  if (LOG) console.log('  h', history._data);
  
  var newInfo = MJ.multiply(input, this.weights.xh);
  if (typeof newInfo === 'number') newInfo = MJ.matrix([newInfo]);
  if (LOG) console.log('  i', newInfo._data);
  
  var sum = MJ.add(history, newInfo);
  if (typeof sum === 'number') sum = MJ.matrix([sum]);
  if (LOG) console.log('  i+h', sum._data);
  
  var nextH = MathUtil.sigmoid(sum);
  if (LOG) console.log('  s(i+h)', this.h._data)
  
  var output = MJ.multiply(nextH, this.weights.hy);
  if (typeof output === 'number') output = MJ.matrix([output]);
  if (LOG) console.log('  o', output._data);

  if (!isTest) this.nextH = nextH;
  return output;
}

Neuron.prototype.train = function(input, actual, expected) {
  var loss = this.getLoss(actual, expected);
  console.log('loss', loss);
  for (name in this.weights) {
    var newLoss = loss;
    var iter = 0;
    var oldW = this.weights[name];
    while (iter < 10 && newLoss >= loss) {
      ++iter;
      this.weights[name] = oldW.map(function(w) {
        var randPct = (Math.random() - .5) * 2;
        var adj = randPct * loss * .5;
        return w + adj;
      });
      var newActual = this.probe(input, true);
      newLoss = this.getLoss(newActual, expected);
    }
  }
}

Neuron.prototype.step = function() {
  this.h = this.nextH;
}


Neuron.prototype.normalizeWeights = function() {
  for (name in this.weights) {
    var weights = this.weights[name];
    for (var i = 0; i < weights._data.length; ++i) {
      var tot = 0;
      for (var j = 0; j < weights._data[i].length; ++j) {
        tot += weights._data[i][j];
      }
      for (var j = 0; j < weights._data[i].length; ++j) {
        weights._data[i][j] /= tot;
      }
    }
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
