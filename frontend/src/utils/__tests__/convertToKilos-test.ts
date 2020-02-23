import convertToKilos from '../convertToKilos';

describe('convertToKilos', () => {
  it('should return an Array of value in kilos', () => {
    let arr = [1234, 1234.567, 0.1234, 123, 12, 12345678];

    let convertedArr = arr.map((item) => convertToKilos(item));
    expect(convertedArr).toEqual(['1.234', '1.234567', '0.0001234', '0.123', '0.012', '12345.678']);
  });
});
