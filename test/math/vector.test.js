var describe = require("mocha").describe;
var it = require("mocha").it;
var expect = require("chai").expect;
var vect = require("../../compilejs/math/vector2");
var vect3 = require("../../compilejs/math/vector3");

describe("Testing Vector math", () => {
  let vec1 = new vect.Vector2(2, 3);
  let vec2 = new vect.Vector2(4, 5);
  let vec3_1 = new vect3.Vector3(2, 3, 4);
  let vec3_2 = new vect3.Vector3(4, 5, 6);

  describe("Vector addition", () => {
    it("vect(2,3) + vect(4, 5) should equal vect(6, 8)", () => {
      expect(vec1.add(vec2)).to.eql(new vect.Vector2(6, 8));

      // testing overload function
      expect(vec1.add({x: 4, y: 5})).to.eql(new vect.Vector2(6, 8));
    });

    it("vect(2, 3, 4) + vect(4, 5, 6) should equal vect(6, 8, 10)", () => {
      expect(vec3_1.add(vec3_2)).to.eql(new vect3.Vector3(6, 8, 10));

      // testing overload function
      expect(vec3_1.add({x: 4, y: 5, z: 6})).to.eql(new vect3.Vector3(6, 8, 10));
    });
  });

  describe("Vector subtraction", () => {
    it("vect(2, 3) - vect(4, 5) should equal vect(2, 2)", () => {
      expect(vec1.sub(vec2)).to.eql(new vect.Vector2(2, 2));

      // testing overload function
      expect(vec1.sub({x: 4, y: 5})).to.eql(new vect.Vector2(2, 2));
    });

    it("vect(2, 3, 4) - vect(4, 5, 6) should equal vect(2, 2, 2)", () => {
      expect(vec3_1.sub(vec3_2)).to.eql(new vect3.Vector3(2, 2, 2));

      // testing overload function
      expect(vec3_1.sub({x: 4, y: 5, z: -2})).to.eql(new vect3.Vector3(2, 2, -6));
    });
  });

  describe("Vector multiplication", () => {
    it("vect(2, 3) * vect(4, 5) should equal vect(8, 15)", () => {
      expect(vec1.mult(vec2)).to.eql(new vect.Vector2(8, 15));

      // testing overload function
      expect(vec1.mult({x: 4, y: 5})).to.eql(new vect.Vector2(8, 15));
    });

    it("vect(2, 3, 4) * vect(4, 5 ,6) should equal vect(8, 15, 24)", () => {
      expect(vec3_1.mult(vec3_2)).to.eql(new vect3.Vector3(8, 15, 24));

      // testing overload function
      expect(vec3_1.mult({x: 4, y: 5, z: 6})).to.eql(new vect3.Vector3(8, 15, 24));
    });
  });

  describe("Vector division", () => {
    it("vect(2, 3) / vect(4, 5) should equal vect(2/4, 3/5)", () => {
      expect(vec1.div(vec2)).to.eql(new vect.Vector2(2 / 4, 3 / 5));

      // testing overload function
      expect(vec1.div({x: 4, y: 5})).to.eql(new vect.Vector2(2 / 4, 3 / 5));
    });

    it("vect(2, 3) / vect(2, 0) should throw a divide by zero error", () => {
      expect(() => { vec1.div(new vect.Vector2(2, 0)); }).to.throw();
    });

    it("vect(2, 3, 4) / vect(4, 5, 6) should equal vect(2/4, 3/5, 4/6)", () => {
      expect(vec3_1.div(vec3_2)).to.eql(new vect3.Vector3(2 / 4, 3 / 5, 4 / 6));

      // testing overload function
      expect(vec3_1.div({x: 4, y: 5, z: 6})).to.eql(new vect3.Vector3(2 / 4, 3 / 5, 4 / 6));
    });

    it("vect(2, 3, 4) / vect(2, 2, 0) should throw a divide by zero error", () => {
      expect(() => { vec3_1.div(new vect3.Vector3(2, 2, 0)); }).to.throw();
    });
  });

  describe("Vector scale", () => {
    it("vect(2, 3) scale by 3 should equal vect(6, 9)", () => {
      expect(vec1.scale(3)).to.eql(new vect.Vector2(6, 9));
    });

    it("vect(2, 3, 4) scale by 3 should equal vect(6, 9, 12)", () => {
      expect(vec3_1.scale(3)).to.eql(new vect3.Vector3(6, 9, 12));
    });
  });

  describe("Vector length", () => {
    it("vect(2, 3) length should be sqrt(13)", () => {
      expect(vec1.length()).to.equal(Math.sqrt(13));
    });

    it("vect(2, 3, 4) length should be sqrt(29)", () => {
      expect(vec3_1.length()).to.equal(Math.sqrt(29));
    });
  });

  describe("Vector normalize", () => {
    it("vect(3, 4) normalized should equal vect(3/5, 4/5)", () => {
      let v = new vect.Vector2(3, 4);

      expect(v.normalize()).to.eql(new vect.Vector2(3 / 5, 4 / 5));
    });
  });

  describe("Vector dot product", () => {
    it("vec(2, 3) and vec(4, 5) dot product should be > 0", () => {
      expect(vec1.dot(vec2)).to.be.gt(0);
    });

    it("vec(2, 3) and vec(-4, -3) dot product should be < 0", () => {
      expect(vec1.dot({ x: -4, y: -3 })).to.be.lt(0);
    });
  });

  describe("Vector distance", () => {
    it("vec(2, 3) distance from vec(10, 1) should be sqrt(68)", () => {
      const v1 = new vect.Vector2(2, 3);
      const v2 = new vect.Vector2(10, 1);
      const vv = v1.distance(v2);

      expect(vv).to.equal(Math.sqrt(68));
    });

    it("vec(3.95, 4.95) distance from vec(4, 5) should be less than 0.09", () => {
      const v1 = new vect.Vector2(3.95, 4.95);
      const v2 = new vect.Vector2(4, 5);
      const vv = v1.distance(v2);

      expect(vv).to.be.lessThan(0.09);
    });
  });
});
