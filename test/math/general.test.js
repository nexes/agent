var describe = require("mocha").describe;
var it = require("mocha").it;
var expect = require("chai").expect;

var math = require("../../compilejs/math");
var types = require("../../compilejs/math");

describe("Testing degree radian conversion", () => {
  describe("Degree to Radian", () => {
    it("45 degree to 0.78539 Radian", () => {
      let x = types.toRadian(45);

      expect(x).to.equal(0.7854);
    });
  });

  describe("Radian to Degree", () => {
    it("0.78539 radian to 45 degree", () => {
      let x = types.toDegree(0.7854);

      expect(x).to.equal(45);
    });
  });
});

describe("linear interpolation", () => {
  describe("lerp between two points", () => {
    it("point 5 and point 30 at time step 0.5 should be ", () => {
      const value = math.lerp(5, 30, 0.5);
      expect(value).to.equal(17.5);
    });
  });

  describe("lerp between two vectors", () => {
    it("vector {4, 5} and vector{10, -25} should interpolate to vector{7, -10}", () => {
      const vec1 = new math.Vector2(4, 5);
      const vec2 = new math.Vector2(10, -25);
      const lerpVect = math.lerpVec2(vec1, vec2, 0.5);

      expect(lerpVect.x).to.equal(7);
      expect(lerpVect.y).to.equal(-10);
    });
  });
});
