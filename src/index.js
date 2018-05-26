
import React, { PureComponent } from 'react';
import createReactContext from 'create-react-context';

export default function createStateContext(actions = {}, initialState = null) {
  const Context = createReactContext();

  class ProviderComponent extends PureComponent {
    render() {
      const { children } = this.props;

      const value = {
        ...this.actions,
        state: this.state,
      };

      return <Context.Provider value={value} children={children} />;
    }

    constructor(...args) {
      super(...args);

      this.state = initialState;

      let boundActions = {};
      for (let key in actions) {
        const action = actions[key];

        if (typeof action !== 'function') {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              `An action with key ${key} was passed to createStateContext that was not a function. Actions` +
                ` must be functions. The ${key} action has been ignored. You should check your call to createStateContext().`
            );
          }

          continue;
        }

        if (key === 'state') {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(
              `An action was passed with the key "state". This is a reserved name, so your action has been ignored.`
            );
          }

          continue;
        }

        boundActions[key] = action.bind(this);
      }

      this.actions = boundActions;
    }

    state = null;
  }

  return {
    Provider: ProviderComponent,
    Consumer: Context.Consumer,
  };
}