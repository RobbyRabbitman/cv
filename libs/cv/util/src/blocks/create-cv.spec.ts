import { MOCK_BLOCK_PROTOTYPES } from '@robby-rabbitman/cv-libs-cv-types/testing';
import { createCv } from './create-cv';

describe('createCv', () => {
  const idMatch = jasmine.stringMatching(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  ) as unknown as string;

  it('should create a cv', () => {
    expect(createCv(MOCK_BLOCK_PROTOTYPES)).toEqual({
      prototypeId: 'cvPrototype',
      type: 'cv',
      id: idMatch,
      children: [],
    });
  });

  it("should throw if there's not exactly one cv prototype", () => {
    expect(() => createCv({})).toThrowError(
      '[createCv]: need exactly 1 cv prototype, when creating a cv from a list of prototypes. Found 0.',
    );

    expect(() =>
      createCv({
        ...MOCK_BLOCK_PROTOTYPES,
        anotherCvPrototype: {
          ...MOCK_BLOCK_PROTOTYPES.cvPrototype,
          id: 'anotherCvPrototype',
        },
      }),
    ).toThrowError(
      '[createCv]: need exactly 1 cv prototype, when creating a cv from a list of prototypes. Found 2.',
    );
  });
});
