var MathUtil = require('../lib/math.js');

var MJ = require('mathjs');
var Expect = require('chai').expect;

describe('distance', function() {
  it('should compute 0 distance for identity', function() {
    var v1 = MJ.matrix([1,1]);
    Expect(MathUtil.distance(v1, v1)).to.equal(0);
  })
  it('should compute distance to 0 vector', function() {
    var v0 = MJ.matrix([0,0]);
    var v1 = MJ.matrix([3,4]);
    Expect(MathUtil.distance(v0, v1)).to.equal(1 - 1 / 6);
    var v2 = MJ.matrix([6,8]);
    Expect(MathUtil.distance(v0, v2)).to.equal(1 - 1 / 11);
  });
  it('should commute', function() {
    var v1 = MJ.matrix([.2, .7]);
    var v2 = MJ.matrix([-.9, 17]);
    Expect(MathUtil.distance(v1, v2)).to.equal(MathUtil.distance(v2, v1))
  });
})
