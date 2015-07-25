var MathUtil = module.exports = {};

var MJ = require('mathjs');

MathUtil.getVector = function(dim, source) {
  var val = source || 0;
  if (typeof source !== 'function') source = function() {return val}
  return MJ.zeros(dim).map(source);
}

MathUtil.getMatrix = function(width, height, source) {
  var val = source || 0;
  if (typeof source !== 'function') source = function() {return val}
  return MJ.zeros(width, height).map(source);
}

MathUtil.sigmoid = function(input) {
  if (typeof input === 'number') {
    if (input < -4) return -.9999;
    if (input > 4) return .9999;
    return MJ.tanh(input);
  }
  return input.map(MathUtil.sigmoid)
}

MathUtil.distance = function(a, b, strategy) {
  strategy = strategy || 'euclidean';
  if (strategy === 'euclidean') {
    var negB = MJ.multiply(b, -1);
    var dists = MJ.add(a, negB);
    dists = dists.map(function(v) {return Math.pow(v, 2)});
    var dist = 0;
    dists.forEach(function(v) {dist += v});
    dist = MJ.sqrt(dist);
    return 1 - (1 / (1 + dist));
  }
  throw new Error('No strategy ' + strategy)
}
