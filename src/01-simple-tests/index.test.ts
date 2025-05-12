import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    expect(simpleCalculator({ a: 4, b: 5, action: Action.Add })).toBe(9);
  });

  test('should subtract two numbers', () => {
    expect(simpleCalculator({ a: 10, b: 3, action: Action.Subtract })).toBe(7);
  });

  test('should multiply two numbers', () => {
    expect(simpleCalculator({ a: 6, b: 7, action: Action.Multiply })).toBe(42);
  });

  test('should divide two numbers', () => {
    expect(simpleCalculator({ a: 20, b: 4, action: Action.Divide })).toBe(5);
  });

  test('should exponentiate two numbers', () => {
    expect(simpleCalculator({ a: 2, b: 4, action: Action.Exponentiate })).toBe(
      16,
    );
  });

  test('should return null for invalid action', () => {
    expect(simpleCalculator({ a: 3, b: 2, action: '%' })).toBeNull();
  });

  test('should return null for invalid arguments', () => {
    // a is not a number
    expect(simpleCalculator({ a: '10', b: 2, action: Action.Add })).toBeNull();

    // b is not a number
    expect(
      simpleCalculator({ a: 10, b: '2', action: Action.Subtract }),
    ).toBeNull();

    // both a and b are not numbers
    expect(
      simpleCalculator({ a: 'x', b: null, action: Action.Multiply }),
    ).toBeNull();

    // a is undefined
    expect(
      simpleCalculator({ a: undefined, b: 3, action: Action.Divide }),
    ).toBeNull();

    // b is undefined
    expect(
      simpleCalculator({ a: 3, b: undefined, action: Action.Exponentiate }),
    ).toBeNull();

    // a is NaN
    expect(simpleCalculator({ a: NaN, b: 2, action: Action.Add })).toBeNull();

    // b is NaN
    expect(
      simpleCalculator({ a: 2, b: NaN, action: Action.Subtract }),
    ).toBeNull();

    // a is Infinity
    expect(
      simpleCalculator({ a: Infinity, b: 2, action: Action.Multiply }),
    ).toBeNull();

    // b is -Infinity
    expect(
      simpleCalculator({ a: 2, b: -Infinity, action: Action.Divide }),
    ).toBeNull();
  });
});
