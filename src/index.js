import React, { Component } from 'react';
import createReactContext from 'create-react-context';
import shallowEquals from './shallow-equals';
import { warning } from './warning';

function isValidState(state) {
  if ((state && typeof state !== 'object') || Array.isArray(state)) {
    return false;
  } else {
    return true;
  }
}

export default function createStateContext(actions = {}, initialState) {
  const Context = createReactContext();

  let initialStateToUse;
  if (!isValidState(initialState)) {
    if (process.env.NODE_ENV !== 'production') {
      warning(
        `Warning: StateContext state must be an object or null. You passed an invalid value to createStateContext` +
          ` that has been ignored.`,
        'INVALID_INITIAL_STATE'
      );
    }
  } else {
    initialStateToUse = initialState;
  }

  if (process.env.NODE_ENV !== 'production') {
    if ((actions && typeof actions !== 'object') || Array.isArray(actions)) {
      warning(
        `You passed invalid actions to createStateContext. actions must be an object.`,
        'INVALID_ACTIONS_ARGUMENT'
      );
    }
  }

  class ProviderComponent extends Component {
    render() {
      const { children } = this.props;

      return <Context.Provider value={this.state} children={children} />;
    }

    constructor(...args) {
      super(...args);

      let boundActions = {};

      for (let key in actions) {
        const action = actions[key];

        if (typeof action !== 'function') {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              `Warning: an action with key ${key} was passed to createStateContext that was not a function. Actions` +
                ` must be functions. The ${key} action has been ignored. You should check your call to createStateContext().`,
              'ACTION_MUST_BE_FN'
            );
          }

          continue;
        }

        if (key === 'state') {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              `Warning: an action was passed to createStateContext with the key "state". This is a reserved key,` +
                ` so your action has been ignored.`,
              'INVALID_ACTION_KEY'
            );
          }

          continue;
        }

        // We pass a wrapper of `setState` to every action that you pass in.
        // This is what allows you to update the state.
        boundActions[key] = action(this.setStateWrapper);
      }

      // The Provider's `value` is this Component's state.
      // From the API of ReactStateContext, we know that a Provider's value has the form:
      //
      // {
      //   state,
      //   ...actions
      // }
      //
      // Together, those two facts lead to there being a state attribute on this Component's
      // state.
      this.state = {
        state: initialStateToUse,
        ...boundActions,
      };
    }

    // This function is what is called when you call an action.
    // `stateUpdate` is just similar to the first argument of `setState`, in that it can be
    // a function that is passed the previous state, or an update object.
    setStateWrapper = stateUpdate => {
      this.setState(prevState => {
        // To compute the new state to merge with the old, we mimic the behavior of a Component's
        // `setState`, allowing you to pass either an object or a function.
        const newState =
          typeof stateUpdate === 'function'
            ? stateUpdate(prevState.state)
            : stateUpdate;

        const newStateType = typeof newState;

        if (typeof newState === 'undefined') {
          return;
        }

        if (!isValidState(newState)) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              `Warning: The value returned from StateContext actions must be an object or null. You called an action that` +
                ` returned an invalid value. This value has been ignored, and the state has not been updated.`,
              'INVALID_ACTION_RETURN'
            );
          }

          return;
        }

        // To compute the _potential_ new state, we shallow merge the two.
        let mergedState =
          newState === null
            ? null
            : Object.assign({}, prevState.state, newState);

        // If the previous value and the new value are shallowly equal, then we avoid the update altogether.
        // In this way, a StateContext.Provider behaves similarly to a PureComponent.
        if (shallowEquals(prevState.state, mergedState)) {
          return;
        }

        // If we've made it this far, then that means the state was changed in a way that was not
        // shallowly equal. We update our Component's state, which causes the Provider to rerender,
        // and then, because the state object changes, all of the Consumers also rerender.
        return {
          state: mergedState,
        };
      });
    };
  }

  return {
    Provider: ProviderComponent,
    Consumer: Context.Consumer,
  };
}
