import getKeyfactsValue from '../getKeyfactsValue';

describe('convertToKilos', () => {
  it('should return the correct value', () => {
    let a = 7939;
    let b = 193820;
    let c = 12000;
    expect(getKeyfactsValue(a)).toEqual(7939);
    expect(getKeyfactsValue(b)).toEqual('193K');
    expect(getKeyfactsValue(c)).toEqual('12K');
  });
});
