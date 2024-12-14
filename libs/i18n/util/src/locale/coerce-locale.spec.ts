import { coerceLocale, type CoerceLocaleOptions } from './coerce-locale';

describe('[Unit Test] coerceLocale', () => {
  it('should return the best matching locale based on weights', () => {
    const options = {
      locale: 'en-US',
      candidates: ['en', 'de'],
      weights: { language: 1 },
    } satisfies CoerceLocaleOptions;

    expect(coerceLocale(options)).toBe('en');
  });

  it('should return the fallback locale if no match is found', () => {
    const options = {
      locale: 'fr-FR',
      candidates: ['en', 'de'],
      fallback: 'es',
      weights: { language: 1 },
    } satisfies CoerceLocaleOptions;

    expect(coerceLocale(options)).toBe('es');
  });

  it('should throw an error if no match is found and requireMatch is true', () => {
    const options: CoerceLocaleOptions = {
      locale: 'fr-FR',
      candidates: ['en', 'de'],
      requireMatch: true,
    };

    expect(() => coerceLocale(options)).toThrowError(
      "Could not coerce locale 'fr-FR' to one of the candidates: en, de. You may adjust the weights or the candidates.",
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
