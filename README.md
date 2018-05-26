# React State Context

[![Travis build status](http://img.shields.io/travis/jamesplease/react-state-context.svg?style=flat)](https://travis-ci.org/jamesplease/react-state-context)
[![npm version](https://img.shields.io/npm/v/react-state-context.svg)](https://www.npmjs.com/package/react-state-context)
[![gzip size](http://img.badgesize.io/https://unpkg.com/react-state-context/dist/react-state-context.min.js?compression=gzip)](https://unpkg.com/react-state-context/dist/react-state-context.min.js)

Lightweight state management using React Context.

✔ Built on React primitives  
✔ Provides a familiar API  
✔ Designed with a minimal learning curve in mind  
✔ Reasonable file size (~2kb gzipped)

## Motivation

When you are getting started with React, storing your application state within an individual Component's [state](https://reactjs.org/docs/state-and-lifecycle.html#adding-local-state-to-a-class)
tends to work well.

An inherent limitation of component state is that it can be tedious to share it between components
that are not near one another within your application's component tree. As your application grows,
this problem may become more pronounced.

React provides an API to solve this problem: **[Context](https://reactjs.org/docs/context.html)**. Context is a
mechanism to more easily share data between components that are not close.

As delightful as the Context API is, it is a low-level tool, so using it directly can be a little verbose sometimes.
It also doesn't provide opinions on _how_ it should be used, so it can take some time to figure out a good system for
working with it. Which is where **React State Context** comes in.

React State Context is a small wrapper around Context that provides you with a small amount of structure. This reduces
the boilerplate that you must write, freeing you up to spend more time developing the other parts of your application.

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

React State Context has three concepts you need to learn about before getting started with it.

### StateContext

A StateContext is a wrapper around a normal React Context object. Like a regular Context object, it has two properties:
`Provider` and `Consumer`.

You use StateContexts in the same way as regular Context. If you have used the new Context API, then it should feel
familiar to use StateContexts. If you haven't, then don't worry – if I was able to learn it, then you can, too!

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

Every StateContext object has an internal state object. Behind the scenes, it is just a regular Component's state object. When you use
a `StateContext.Consumer`, you value that you are passed will have a `state` attribute.

```jsx
<MyStateContext.Consumer>
  {(value) => {
    console.log('The current state is:', value.state);
  }}
</MyStateContext.Consumer>
```

### Actions

Actions are functions that you define where you can update the state using `setState`. If you have used Redux, then they could be
considered analagous to action creators.

We recommend defining the actions for each of your StateContexts together on an object. Here is an example actions object:

```js
const todoActions = {
  createTodo(newTodo) {
    this.setState({
      todos: this.state.todos.push(newTodo)
    });
  },

  getTodo(id) {
    return this.state.todos.find(todo => todo.id === id);
  }
};
```

These actions will be included in the `value` that you receive from the Consumer:

```jsx
<MyStateContext.Consumer>
  {(value) => {
    console.log('I can add a todo using:', value.createTodo);
    console.log('I can retrieve todos using:', value.getTodo);
  }}
</MyStateContext.Consumer>
```

Once you feel comfortable with these concepts, you should be ready to start using React State Context!

## API

This library has one, default export: `createStateContext`.

### `createStateContext( actions, initialState )`

Creates a [StateContext](#state-context).

- `actions` [Object]: The actions that modify the state.
- `initialState` [any]: The initial state of the StateContext

```js
const TodoContext = createStateContext(todoActions, {
  todos: []
});
```

Once you have a StateContext, you can use it as you would any other Context.

```jsx
import TodoContext from './contexts/todo';

export function App() {
  // First, you must set up the Provider somewhere high in our Component tree.
  return (
    <TodoContext.Provider>
      <SomeComponent/>
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
        console.log('I can retrieve todos using:', value.getTodo);
      }}
    </TodoContext.Consumer>
  );
}
```

## FAQ

#### Do I need to be using React >= 16.3.0 for this?

You don't! This library is built on top of the excellent [create-react-context](https://github.com/jamiebuilds/create-react-context) library,
which means you can use it as far back as React v0.14.

#### Why use this over Redux?

The reason that I initially started using Redux was to more easily share data between components. Although Redux can seem like a simple system once you become
familiar with it, the number of concepts it has can make it daunting to newcomers. At least, that's how I felt when I was learning it.

For me, React State Context solves the problems that I originally used Redux for in a more straightforward way, which is why I prefer it.

#### What do you lose by not using Redux?

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
