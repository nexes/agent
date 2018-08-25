var describe = require("mocha").describe;
var it = require("mocha").it;
var expect = require("chai").expect;

var math = require("../../compilejs/math");

describe("Testing degree radian conversion", () => {
  describe("Degree to Radian", () => {
    it("45 degree to 0.78539 Radian", () => {
      let x = math.Math.toRadian(45);

      expect(x.toFixed(4)).to.equal("0.7854");
    });
  });

  describe("Radian to Degree", () => {
    it("0.78539 radian to 45 degree", () => {
      let x = math.Math.toDegree(0.7854);

      expect(x).to.equal(45);
    });
  });
});

describe("linear interpolation", () => {
  describe("lerp between two points", () => {
    it("point 5 and point 30 at time step 0.5 should be ", () => {
      const value = math.Math.lerp(5, 30, 0.5);
      expect(value).to.equal(17.5);
    });
  });

  describe("lerp between two vectors", () => {
    it("vector {4, 5} and vector{10, -25} should interpolate to vector{7, -10}", () => {
      const vec1 = new math.Vector2(4, 5);
      const vec2 = new math.Vector2(10, -25);
      const lerpVect = math.Math.lerpVec2(vec1, vec2, 0.5);

      expect(lerpVect.x).to.equal(7);
      expect(lerpVect.y).to.equal(-10);
    });
  });

  describe("clamp between [0-1]", () => {
    it("clamp value 3 between [0-1]: should be 1: 0.75 between [0-1]: should be 0.75", () => {
      const x = math.Math.clamp(3, 0, 1);
      const y = math.Math.clamp(0.75, 0, 1);

      expect(x).to.equal(1);
      expect(y).to.equal(0.75);
    });
  });

  describe("sigmoid functions", () => {
    it("smooth step 0.25 between [0-1], should be 0.15625", () => {
      const x = math.Math.smoothStep(0.25);

      expect(x).to.equal(0.15625);
    });

    it("smoother step 0.25 between [0-1], should be 0.10351", () => {
      const x = math.Math.smootherStep(0.25);

      expect(x).to.equal(0.103515625);
    });
  });
});
