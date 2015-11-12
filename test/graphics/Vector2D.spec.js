import Vector2D from '../../src/containers/graphics/Vector2d';
import chai from 'chai';

describe('Vector2D', () => {
  it('should make a vector', () => {
    const vector = new Vector2D(2, 4);

    chai.expect(vector.x).to.equal(2);
    chai.expect(vector.y).to.equal(4);
    chai.expect(vector.add).to.exist;
  });
});
