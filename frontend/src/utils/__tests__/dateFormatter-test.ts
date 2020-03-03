import dateFormatter from '../dateFormatter';

describe('dateFormatter', () => {
  it('should return an Array of formatted date', () => {
    let arr = ['2020-03-19', '2022-04-05'];

    let convertedArr = arr.map((item) => dateFormatter(item));
    expect(convertedArr).toEqual(['19-Mar-2020', '5-Apr-2022']);
  });
});
