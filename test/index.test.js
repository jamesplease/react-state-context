import React from 'react';
import createStateContext from '../src';
import { warning } from '../src/warning';

describe('React State Context', () => {
  it('is a function', () => {
    expect(typeof createStateContext === 'function').toBe(true);
  });

  describe('calling it with no arguments', () => {
    it('returns an object with the right keys, and does not log an error', () => {
      const Context = createStateContext();
      expect(warning).toHaveBeenCalledTimes(0);
      expect(typeof Context.Provider).toBe('function');
      expect(typeof Context.Consumer).toBe('object');
    });
  });

  it('does not log an error when called with null actions and null initial state', () => {
    const Context = createStateContext(null, null);
    expect(warning).toHaveBeenCalledTimes(0);
    expect(typeof Context.Provider).toBe('function');
    expect(typeof Context.Consumer).toBe('object');
  });

  it('does not log an error when called with empty actions and empty initial state', () => {
    const Context = createStateContext({}, {});
    expect(warning).toHaveBeenCalledTimes(0);
    expect(typeof Context.Provider).toBe('function');
    expect(typeof Context.Consumer).toBe('object');
  });

  it('logs an error when invalid actions are passed', () => {
    const Context = createStateContext(true);
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('INVALID_ACTIONS_ARGUMENT');
    expect(typeof Context.Provider).toBe('function');
    expect(typeof Context.Consumer).toBe('object');
  });

  it('logs an error when an actions array is passed', () => {
    const Context = createStateContext([]);
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('INVALID_ACTIONS_ARGUMENT');
    expect(typeof Context.Provider).toBe('function');
    expect(typeof Context.Consumer).toBe('object');
  });

  it('logs an error when an array initial state is passed', () => {
    const Context = createStateContext(null, []);
    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('INVALID_INITIAL_STATE');
    expect(typeof Context.Provider).toBe('function');
    expect(typeof Context.Consumer).toBe('object');
  });
});
