import { coerceLocale, type CoerceLocaleOptions } from './coerce-locale';

describe('coerceLocale', () => {
  it('should return the best matching locale based on weights', () => {
    const options: CoerceLocaleOptions = {
      locale: 'en-US',
      candidates: ['en', 'de'],
      weights: { language: 1 },
    };

    const result = coerceLocale(options);
    expect(result).toBe('en');
  });

  it('should return the fallback locale if no match is found', () => {
    const options: CoerceLocaleOptions = {
      locale: 'fr-FR',
      candidates: ['en', 'de'],
      fallback: 'en',
    };

    const result = coerceLocale(options);
    expect(result).toBe('en');
  });

  it('should throw an error if no match is found and requireMatch is true', () => {
    const options: CoerceLocaleOptions = {
      locale: 'fr-FR',
      candidates: ['en', 'de'],
      requireMatch: true,
    };

    expect(() => coerceLocale(options)).toThrow(
      "Could not coerce locale 'fr-FR' to one of the candidates: en,de. You may adjust the weights or the candidates.",
    );
  });

  it('should return null if no match is found and requireMatch is false', () => {
    const options: CoerceLocaleOptions = {
      locale: 'fr-FR',
      candidates: ['en', 'de'],
      requireMatch: false,
    };

    const result = coerceLocale(options);
    expect(result).toBeNull();
  });
});
