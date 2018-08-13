var describe = require("mocha").describe;
var it = require("mocha").it;
var expect = require("chai").expect;

var mat = require("../../compilejs/math/matrix4");
var vect = require("../../compilejs/math/vector2");

describe("Testing Matrix4 math", () => {
  let identityMat = new mat.Matrix4();
  identityMat.setAsIdentity();

  describe("Matrix with initial value", () => {
    it("Matrix initalized with all 2's", () => {
      let data = new Float32Array(16).fill(2);
      let _mat = new mat.Matrix4(data);

      expect(_mat.flatten()).to.eql(new Float32Array(16).fill(2));
    });
  });

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
    });
  });

  describe("Matrix translate", () => {
    it("translate an identity matrix by x: 5, y: 10", () => {
      let myMat = new mat.Matrix4();
      let arr = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 5, 10, 0, 1]);
      myMat.translate(new vect.Vector2(5, 10));

      expect(myMat.flatten()).to.eql(arr);
    });
  });

  describe("Matrix multipulcation", () => {
    it("multiple matrix A and B", () => {
      let matA = new mat.Matrix4();
      let matB = new mat.Matrix4();
      const correct = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 13, 7, 0, 1]);

      matA.translate(new vect.Vector2(5, 5));
      matB.translate(new vect.Vector2(8, 2));

      let AB = matA.mult(matB);

      expect(AB.flatten()).to.eql(correct);
    });
  });
});
