# React State Context

[![Travis build status](http://img.shields.io/travis/jamesplease/react-state-context.svg?style=flat)](https://travis-ci.org/jamesplease/react-state-context)
[![npm version](https://img.shields.io/npm/v/react-state-context.svg)](https://www.npmjs.com/package/react-state-context)
[![Test Coverage](https://coveralls.io/repos/github/jamesplease/react-state-context/badge.svg?branch=master)](https://coveralls.io/github/jamesplease/react-state-context?branch=master)
[![gzip size](http://img.badgesize.io/https://unpkg.com/react-state-context/dist/react-state-context.min.js?compression=gzip)](https://unpkg.com/react-state-context/dist/react-state-context.min.js)

Lightweight state management using React Context.

✔ Built on React primitives  
✔ Provides a familiar API  
✔ Designed with a minimal learning curve in mind  
✔ Reasonable file size (~2kb gzipped)

## Motivation

When you are getting started with React, storing all of your application state within individual Components'
[state](https://reactjs.org/docs/state-and-lifecycle.html#adding-local-state-to-a-class) tends to work well.
Component state is a good solution for storing data.

A limitation of component state is that it can be tedious to share it between components
that are not near one another within your application's component tree. This problem may become more pronounced
as your application grows, and as some of your data needs to be made available to a larger number of separated
components.

React provides an API to solve this problem: **[Context](https://reactjs.org/docs/context.html)**. Context is a
mechanism to more easily share data between components, even when they are not close.

As delightful as the Context API is, it is a low-level tool, so using it directly can be a little verbose sometimes.
It also doesn't provide opinions on _how_ it should be used, so it can take some time to figure out an organized system for
working with it. Lastly, it has [some caveats](https://reactjs.org/docs/context.html#caveats) that can trip you up. For these
reasons I created **React State Context**.

React State Context is a thin wrapper around Context that provides a small amount of structure. This structure
helps reduce the boilerplate that you must write, and it also helps you to stay organized. Plus, when you use State
Context, you can be confident that you are avoiding the caveats that accompany using Context directly.

### Installation

Install using [npm](https://www.npmjs.com):

```
npm install react-state-context
```

or [yarn](https://yarnpkg.com/):

```
yarn add react-state-context
```

## Concepts

React State Context has three concepts.

### StateContext

A StateContext is a wrapper around a normal React Context object. Like a regular Context object, it has two properties:
`Provider` and `Consumer`.

You use StateContexts in the same way as regular Context. If you have used the new Context API, then it should feel
familiar to use StateContexts. If you haven't, don't worry. If I was able to learn it, then you can, too!

> :information_desk_person: The [React documentation on Context](https://reactjs.org/docs/context.html#when-to-use-context)
> is a great resource. It can be helpful to familiarize yourself with the content on that page before using State Context.

What is different about a StateContext is that the value that the Consumer provides you with has the
following structure:

```
{
  state,
  ...actions
}
```

State and actions are the other two concepts of React State Context. Let's take a look!

### State

Every StateContext object has an internal state object. Behind the scenes, it is a regular Component's state object. When you render
a `StateContext.Consumer`, the value passed to the render prop will include a `state` attribute.

```jsx
<MyStateContext.Consumer>
  {value => {
    console.log('The current state is:', value.state);
  }}
</MyStateContext.Consumer>
```

Like a React Component's state, the StateContext state must be an object or null.

### Actions

Actions are functions that you define, and they are how you modify the state. If you have used Redux, then you can
think of them as serving a similar role to action creators.

To update state, return a new value from your action. The returned value will be shallowly merged
with the existing state.

Let's take a look at an example action:

```js
export function openModal() {
  return {
    isOpen: true,
  };
}
```

When you call an action from within your application, you can pass arguments to it. Let's use this to
create an action to toggle a modal state based on what is passed into the action:

```js
export function toggleModal(isOpen) {
  return { isOpen };
}
```

Sometimes, you may need the previous state within an action. In these situations, you can return a
function from your action. This function will be called with one argument, `setState`. Use `setState` to update
the state as you would using a React Component's `setState`:

```js
export function createTodo(newTodo) {
  return function(setState) {
    setState(prevState => {
      // Shallow clone our todos, so that we do not modify the state
      const clonedTodos = [...prevState.todos];

      return {
        todos: clonedTodos.push(newTodo),
      };
    });
  };
}
```

Note that `setState` differs from the Component `setState` in that there is no second argument.

> :information_desk_person: Heads up! The actions API was inspired by [redux-thunk](https://github.com/reduxjs/redux-thunk).
> If you have used that API, you may notice the similarity. In redux-thunk, the thunks are passed the arguments `(dispatch, getState)`.
> In this library, you are passed `(setState)`.

Along with `state`, the actions that you define will be included in the `value` that you receive from the Consumer:

```jsx
<MyStateContext.Consumer>
  {value => {
    console.log('I can add a todo using:', value.createTodo);
    console.log('I can delete todos using:', value.deleteTodo);
  }}
</MyStateContext.Consumer>
```

Once you feel comfortable with these concepts, you are ready to start using React State Context.

## API

This library has one, default export: `createStateContext`.

### `createStateContext( actions, [initialState] )`

Creates and returns a [StateContext](#state-context).

* `actions` _[Object]_: The actions that modify the state.
* `[initialState]` _[Object|null]_: Optional initial state for the StateContext.

```js
import createStateContext from 'react-state-context';
import * as todoActions from './actions';

const TodoContext = createStateContext(todoActions, {
  todos: [],
});

export default TodoContext;
```

Use a StateContext as you would any other Context.

```jsx
import TodoContext from './contexts/todo';

export function App() {
  // To begin, you must render the Provider somewhere high up in the Component tree.
  return (
    <TodoContext.Provider>
      <SomeComponent />
    </TodoContext.Provider>
  );
}
```

```jsx
import TodoContext from './contexts/todo';

export function DeeplyNestedChild() {
  // From anywhere within the Provider, you can access the value of the StateContext.
  return (
    <TodoContext.Consumer>
      {value => {
        console.log('The current state is', value.state);
        console.log('All of the todos are here', value.state.todos);

        console.log('I can add a todo using:', value.createTodo);
        console.log('I can delete todos using:', value.deleteTodo);
      }}
    </TodoContext.Consumer>
  );
}
```

## FAQ

#### What version of React is required?

You need to be using at least React v0.14.

Although the new Context API was introduced in 16.3.0, this library is built using the excellent
[create-react-context](https://github.com/jamiebuilds/create-react-context) library, which polyfills the
API for older React versions.

#### Why would someone use this over Redux?

The reason that I initially started using Redux was to more easily share data between components. Although Redux can seem like a simple system once you become
familiar with it, the number of concepts it has can make it daunting to newcomers. At least, that's how I felt when I was learning it.

For me, React State Context solves the problems that I originally used Redux for in a more straightforward way, which is why I think a solution like this seems promising.

#### What does one lose by migrating away from Redux?

The Redux library supports middleware, and it enables time travel debugging, which are both things that you do not get from React State Context. If you
rely heavily on those features of Redux, then this library may not be suitable for your needs.

Outside of the Redux source code itself, there is an enormous community around that library. There are considerable benefits to using a library that has such a
large number of users, and you will lose that community by switching to this library, or most other alternative state management libraries, for that matter.

With that said, React State Context is built on top of React's built-in Context API. Although the new Context API is likely not very familiar to most React
developers today, we believe that that will change as time goes on.

#### How is this different from Unstated?

[Unstated](https://github.com/jamiebuilds/unstated) is a fantastic library, and it served as inspiration for this library. The primary difference is that
Unstated introduces new concepts for state management, like `Container` and `Subscribe`. One of the design goals of React State Context was to avoid
introducing additional concepts whenever possible in an effort to reduce the learning curve.

We believe that we avoided introducing those new concepts while still getting a remarkably similar developer experience. Perhaps you will
feel the same way!

## Contributing

Are you interested in helping out with this project? That's awesome – thank you! Head on over to
[the contributing guide](./CONTRIBUTING.md) to get started.
