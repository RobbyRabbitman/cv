import { mod } from './mod.js';
describe('mod', () => {
  it('should return the correct modulo when the dividend is positive', () => {
    expect(mod(10, 3)).toBe(1);
    expect(mod(15, 7)).toBe(1);
    expect(mod(20, 6)).toBe(2);
  });

  it('should return the correct modulo when the dividend is negative', () => {
    expect(mod(-10, 3)).toBe(2);
    expect(mod(-15, 7)).toBe(6);
    expect(mod(-20, 6)).toBe(4);
  });

  it('should return 0 when the dividend is 0', () => {
    expect(mod(0, 3)).toBe(0);
    expect(mod(0, 7)).toBe(0);
    expect(mod(0, 6)).toBe(0);
  });

  it('should return NaN when the divisor is 0', () => {
    expect(mod(10, 0)).toBeNaN();
    expect(mod(-15, 0)).toBeNaN();
    expect(mod(0, 0)).toBeNaN();
  });
});
