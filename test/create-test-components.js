import React from 'react';
import createStateContext from '../src';

const defaultActions = {
  setValue() {
    return {
      number: 10,
    };
  },

  increment: () => setState => {
    setState(prevState => {
      return {
        number: prevState.number + 1,
      };
    });
  },

  updateToTheSame: () => setState => {
    setState(prevState => {
      return {
        number: prevState.number,
      };
    });
  },

  badAction() {
    return [];
  },

  badThunkAction: () => setState => {
    setState([]);
  },

  returnsUndefined() {},
};

export default function createTestComponents(
  actions = defaultActions,
  initialNumber = 2
) {
  const initialState = {
    number: initialNumber,
  };

  const StateContext = createStateContext(actions, initialState);

  const Usage = () => (
    <StateContext.Consumer>
      {value => {
        return (
          <div>
            <span>The number is: {value.state.number}</span>
            <button onClick={value.setValue}>Set value</button>
            <button onClick={value.increment}>Increment value</button>
            <button onClick={value.badAction}>Bad action</button>
            <button onClick={value.badThunkAction}>Bad thunk action</button>
            <button onClick={value.returnsUndefined}>Sets undefined</button>
            <button onClick={value.updateToTheSame}>Stays the same</button>
          </div>
        );
      }}
    </StateContext.Consumer>
  );

  return { StateContext, Usage };
}
