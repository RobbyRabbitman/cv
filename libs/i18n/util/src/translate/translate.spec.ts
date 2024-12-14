import { type Translation } from '@robby-rabbitman/cv-libs-i18n-types';
import { translate } from './translate';

describe('[Unit Test] translate', () => {
  const someTranslation = {
    greeting: 'Hello, {{ name }}!',
    farewell: 'Goodbye, {{ name }}!',
    nested: {
      message: 'This is a nested message.',
    },
  } satisfies Translation;

  it('should return the key if translation is not a valid translation', () => {
    expect(
      translate({
        key: 'greeting',
        translation: null as unknown as Translation,
      }),
    ).toBe('greeting');
  });

  it('should return the key if key is not found in translation', () => {
    expect(translate({ key: 'not a key', translation: someTranslation })).toBe(
      'not a key',
    );
  });

  it('should return the translation string if key is found', () => {
    expect(translate({ key: 'greeting', translation: someTranslation })).toBe(
      'Hello, {{ name }}!',
    );
  });

  it('should return the translation if key is found', () => {
    expect(translate({ key: 'nested', translation: someTranslation })).toBe(
      someTranslation.nested,
    );
  });

  it('should replace placeholders with params', () => {
    expect(
      translate({
        key: 'greeting',
        translation: someTranslation,
        params: { name: 'John' },
      }),
    ).toBe('Hello, John!');
  });

  it('should return nested translation string if key is found', () => {
    expect(
      translate({ key: 'nested.message', translation: someTranslation }),
    ).toBe('This is a nested message.');
  });

  it('should throw an error if assert type does not match Translation', () => {
    expect(() =>
      translate({
        key: 'greeting',
        translation: someTranslation,
        assert: 'Translation',
      }),
    ).toThrowError(
      "Expected a 'Translation' for key 'greeting' but got a 'Translation String'.",
    );
  });

  it('should throw an error if assert type does not match Translation String', () => {
    expect(() =>
      translate({
        key: 'nested',
        translation: someTranslation,
        assert: 'string',
      }),
    ).toThrowError(
      "Expected a 'string' for key 'nested' but got a 'Translation'.",
    );
  });

  it('should throw an error if value is not a translation or translation string', () => {
    expect(() =>
      translate({
        key: 'greeting',
        translation: { greeting: 123 } as unknown as Translation,
      }),
    ).toThrowError(
      "Expected a 'Translation' or a 'Translation String' - provided: 123",
    );
  });
});
