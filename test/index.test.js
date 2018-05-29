import React from 'react';
import {
  render,
  wait,
  fireEvent,
  renderIntoDocument,
  cleanup,
} from 'react-testing-library';
import 'jest-dom/extend-expect';
import createStateContext from '../src';
import createTestComponents from './create-test-components';
import { warning } from '../src/warning';

afterEach(cleanup);

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

  it('logs an error when an invalid actions value is passed', () => {
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

  it('renders the initial value before actions are called', () => {
    const { StateContext, Usage } = createTestComponents();

    const tree = (
      <StateContext.Provider>
        <Usage />
      </StateContext.Provider>
    );

    const { getByText } = render(tree);
    expect(getByText(/^The number is:/)).toHaveTextContent('The number is: 2');
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('updates after an action is called', async () => {
    const { StateContext, Usage } = createTestComponents();

    const tree = (
      <StateContext.Provider>
        <Usage />
      </StateContext.Provider>
    );

    const { getByText } = renderIntoDocument(tree);
    expect(getByText(/^The number is:/)).toHaveTextContent('The number is: 2');

    fireEvent(
      getByText('Increment value'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    await wait();
    expect(getByText(/^The number is:/)).toHaveTextContent('The number is: 3');
    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('logs an error when an action returns an invalid state value', async () => {
    const { StateContext, Usage } = createTestComponents();

    const tree = (
      <StateContext.Provider>
        <Usage />
      </StateContext.Provider>
    );

    const { getByText } = renderIntoDocument(tree);
    expect(getByText(/^The number is:/)).toHaveTextContent('The number is: 2');

    fireEvent(
      getByText('Bad action'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    await wait();

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('INVALID_ACTION_UPDATE');
  });

  it('does not log an error when setState is called with undefined', async () => {
    const { StateContext, Usage } = createTestComponents();

    const tree = (
      <StateContext.Provider>
        <Usage />
      </StateContext.Provider>
    );

    const { getByText } = renderIntoDocument(tree);
    expect(getByText(/^The number is:/)).toHaveTextContent('The number is: 2');

    fireEvent(
      getByText('Sets undefined'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    await wait();

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('does not log an error when setState leaves the state shallowly equal', async () => {
    const { StateContext, Usage } = createTestComponents();

    const tree = (
      <StateContext.Provider>
        <Usage />
      </StateContext.Provider>
    );

    const { getByText } = renderIntoDocument(tree);
    expect(getByText(/^The number is:/)).toHaveTextContent('The number is: 2');

    fireEvent(
      getByText('Stays the same'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      })
    );

    await wait();

    expect(warning).toHaveBeenCalledTimes(0);
  });

  it('logs an error when non-function actions are passed', () => {
    const { StateContext } = createTestComponents({
      stuff: true,
    });

    render(<StateContext.Provider />);

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('ACTION_MUST_BE_FN');
  });

  it('logs an error when an action called "state" is passed', () => {
    const { StateContext } = createTestComponents({
      state: () => () => {},
    });

    render(<StateContext.Provider />);

    expect(warning).toHaveBeenCalledTimes(1);
    expect(warning.mock.calls[0][1]).toEqual('INVALID_ACTION_KEY');
  });
});
