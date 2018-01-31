var describe = require('mocha').describe;
var it = require('mocha').it;
var assert = require('chai').assert;
var expect = require('chai').expect;
var vect = require('../../build/math/vector2');



describe('Testing Vector math', () => {
	let vec1 = new vect.Vector2(2, 3);
	let vec2 = new vect.Vector2(4, 5);

	describe('Vector addition', () => {
		it('vect(2,3) + vect(4, 5) should equal vect(6, 8)', () => {
			expect(vec1.add(vec2)).to.eql(new vect.Vector2(6, 8));

			// testing overload function
			expect(vec1.add({x: 4, y: 5})).to.eql(new vect.Vector2(6, 8));
		});
	});

	describe('Vector subtraction', () => {
		it('vect(2, 3) - vect(4, 5) should equal vect(-3, 2)', () => {
			expect(vec1.sub(vec2)).to.eql(new vect.Vector2(-2, -2));

			// testing overload function
			expect(vec1.sub({x: 4, y: 5})).to.eql(new vect.Vector2(-2, -2));
		});
	});

	describe('Vector multiplication', () => {
		it('vect(2, 3) * vect(4, 5) should equal vect(8, 15)', () => {
			expect(vec1.mult(vec2)).to.eql(new vect.Vector2(8, 15));

			// testing overload function
			expect(vec1.mult({x: 4, y: 5})).to.eql(new vect.Vector2(8, 15));
		});
	});

	describe('Vector division', () => {
		it('vect(2, 3) / vect(4, 5) should equal vect(2/4, 3/5)', () => {
			expect(vec1.div(vec2)).to.eql(new vect.Vector2(2 / 4, 3 / 5));

			// testing overload function
			expect(vec1.div({x: 4, y: 5})).to.eql(new vect.Vector2(2/4, 3/5));
		});

		it('vect(2, 3) / vect(2, 0) should throw a divide by zero error', () => {
			expect(() => { vec1.div(new vect.Vector2(2, 0)) }).to.throw();
		});
	});

	describe('Vector scale', () => {
		it('vect(2, 3) scale by 3 should equal vect(6, 9)', () => {
			expect(vec1.scale(3)).to.eql(new vect.Vector2(6, 9));
		});
	});

	describe('Vector length', () => {
		it('vect(2, 3) length should be sqrt(13)', () => {
			expect(vec1.length()).to.equal(Math.sqrt(13))
		});
	});

	describe('Vector normalize', () => {
		it('vect(3, 4) normalized should equal vect(3/5, 4/5)', () => {
			let v = new vect.Vector2(3, 4);

			expect(v.normalize()).to.eql(new vect.Vector2(3/5, 4/5));
		});
	});

	describe('Vector dot product', () => {
		it('vec(2, 3) and vec(4, 5) dot product should be > 0', () => {
			expect(vec1.dot(vec2)).to.be.gt(0);
		});

		it('vec(2, 3) and vec(-4, -3) dot product should be < 0', () => {
			expect(vec1.dot({ x: -4, y: -3 })).to.be.lt(0);
		})
	});
});
