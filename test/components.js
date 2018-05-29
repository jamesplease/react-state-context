import React from 'react';
import createStateContext from '../src';

const defaultActions = {
  increment: setState => () => {
    setState(prevState => {
      return {
        number: prevState.number + 1,
      };
    });
  },

  updateToTheSame: setState => () => {
    setState(prevState => {
      return {
        number: prevState.number,
      };
    });
  },

  badAction: setState => () => {
    setState([]);
  },

  setsUndefined: setState => () => {
    setState();
  },
};

export default function createComponents(
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
            <button onClick={value.increment}>Increment value</button>
            <button onClick={value.badAction}>Bad action</button>
            <button onClick={value.setsUndefined}>Sets undefined</button>
            <button onClick={value.updateToTheSame}>Stays the same</button>
          </div>
        );
      }}
    </StateContext.Consumer>
  );

  return { StateContext, Usage };
}
