import React from 'react';
import shallowEquals from '../src/shallow-equals';

const symbolOne = Symbol();
const symbolTwo = Symbol();

describe('shallowEquals', () => {
  it('is a function', () => {
    expect(typeof shallowEquals === 'function').toBe(true);
  });

  it('returns true for primitives that are the same', () => {
    expect(shallowEquals(true, true)).toBe(true);
    expect(shallowEquals(false, false)).toBe(true);
    expect(shallowEquals('', '')).toBe(true);
    expect(shallowEquals('abc', 'abc')).toBe(true);
    expect(shallowEquals('0', '0')).toBe(true);
    expect(shallowEquals(1, 1)).toBe(true);
    expect(shallowEquals(0, 0)).toBe(true);
    expect(shallowEquals(null, null)).toBe(true);
    expect(shallowEquals(undefined, undefined)).toBe(true);

    expect(shallowEquals(symbolOne, symbolOne)).toBe(true);
  });

  it('returns false for primitives that are not the same', () => {
    expect(shallowEquals(true, false)).toBe(false);
    expect(shallowEquals(true, 1)).toBe(false);
    expect(shallowEquals(true, 'asdf')).toBe(false);
    expect(shallowEquals(false, 0)).toBe(false);
    expect(shallowEquals(null, undefined)).toBe(false);
    expect(shallowEquals(undefined, '')).toBe(false);
    expect(shallowEquals(symbolOne, symbolTwo)).toBe(false);
  });

  describe('objects', () => {
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

  describe('arrays', () => {
    it('returns true for arrays that are the same', () => {
      const arr = [{ name: 'please' }];
      expect(shallowEquals(arr, arr)).toBe(true);
    });

    it('returns false for arrays that are different, and not shallowly equal', () => {
      expect(shallowEquals([{ name: 'james' }], [{ name: 'please' }])).toBe(
        false
      );
    });

    it('returns true for arrays that are shallowly equal', () => {
      expect(shallowEquals([1], [1])).toBe(true);
    });

    it('returns false for arrays that are deeply equal', () => {
      expect(
        shallowEquals([{ name: { first: 'j' } }, { name: { first: 'j' } }])
      ).toBe(false);
    });
  });
});
