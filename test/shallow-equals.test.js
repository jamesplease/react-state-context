import React from 'react';
import shallowEquals from '../src/shallow-equals';

describe('shallowEquals', () => {
  it('is a function', () => {
    expect(typeof shallowEquals === 'function').toBe(true);
  });

  it('returns true for null values', () => {
    expect(shallowEquals(null, null)).toBe(true);
  });

  it('returns false for null and objects', () => {
    expect(shallowEquals(null, {})).toBe(false);
    expect(shallowEquals({}, null)).toBe(false);
  });

  it('returns true for objects that are the same', () => {
    const obj = { name: 'please' };
    expect(shallowEquals(obj, obj)).toBe(true);
  });

  it('returns false for objects that are different, and not shallowly equal', () => {
    expect(shallowEquals({ name: 'j' }, { name: 'p' })).toBe(false);
  });

  it('returns false for objects that are shallow-equal subsets of one another', () => {
    expect(shallowEquals({ name: 'j', age: 30 }, { name: 'j' })).toBe(false);
    expect(shallowEquals({ name: 'j' }, { name: 'j', age: 30 })).toBe(false);
  });

  it('returns true for objects that are shallowly equal', () => {
    expect(shallowEquals({ name: 'j' }, { name: 'j' })).toBe(true);
  });

  it('returns false for objects that are deeply equal', () => {
    expect(
      shallowEquals({ name: { first: 'j' } }, { name: { first: 'j' } })
    ).toBe(false);
  });
});
