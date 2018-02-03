var describe = require("mocha").describe;
var it = require("mocha").it;
var assert = require("chai").assert;
var expect = require("chai").expect;
var mat = require("../../compilejs/math/matrix4");
var vect = require("../../compilejs/math/vector2");
var types = require("../../compilejs/math/types");


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

describe("Testing Matrix4 math", () => {
  let identityMat = new mat.Matrix4();
  identityMat.setAsIdentity();


  describe("Matrix identity", () => {
    it("Our matrix should be an identity matrix", () => {
      let _mat = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
      expect(identityMat.flatten()).to.eql(_mat);
    });
  });

  describe("Matrix scale", () => {
    it("scaling an identity matrix by 3", () => {
      let _smat = new Float32Array([3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 0, 1]);
      let _scalMat = identityMat.scale(3);

      expect(_scalMat.flatten()).to.eql(_smat);
    })
  });

  describe("Matrix translate", () => {
    it("translate an identity matrix by x: 5, y: 10", () => {
      let _tmat = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 10, 0, 1]);
      let newMat = identityMat.translate({ x: 5, y: 10 });

      // check our override function
      let v = new vect.Vector2(5, 10);
      let vecMat = identityMat.translate(v);

      expect(newMat.flatten()).to.eql(_tmat);
      expect(vecMat.flatten()).to.eql(_tmat);
    });
  });
});
