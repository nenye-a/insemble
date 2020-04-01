import numberFormatter from '../numberFormatter';

describe('commaSeparator', () => {
  it('should return correct string', () => {
    let numberArr = [
      1000000.25,
      2000,
      90,
      0.24,
      '1000000.25',
      '2000',
      '90',
      '0.24',
      'foo',
      -1000,
      -20.25,
    ];
    let convertedArr = numberArr.map((item) => numberFormatter(item));
    expect(convertedArr).toEqual([
      '1,000,000.25',
      '2,000',
      '90',
      '0.24',
      '1,000,000.25',
      '2,000',
      '90',
      '0.24',
      'foo',
      '-1,000',
      '-20.25',
    ]);
  });
});
