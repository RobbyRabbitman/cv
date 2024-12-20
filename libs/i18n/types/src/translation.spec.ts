import { isTranslation, isTranslationString } from './translation';

describe('[Unit Test] Translation', () => {
  describe('isTranslationString', () => {
    it('should return true if value is a string', () => {
      expect(isTranslationString('Hello')).toBe(true);
    });

    it('should return false if value is a object', () => {
      expect(isTranslationString({})).toBe(false);
    });
  });

  describe('isTranslation', () => {
    it('should return true if value is a object', () => {
      expect(isTranslation({})).toBe(true);
    });

    it('should return false if value is null', () => {
      expect(isTranslation(null)).toBe(false);
    });

    it('should return false if value is a string', () => {
      expect(isTranslation('Hello')).toBe(false);
    });
  });
});
