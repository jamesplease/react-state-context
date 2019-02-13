# Changelog

### v1.0.0 (2019/2/12)

No changes; this release marks API stability.

### v0.3.0 (2018/5/29)

This update is largely a response to @gaearon's great feedback.

* The Provider is now more performant. It will no longer render its Consumers
  when its parents rerender.
* Another performance improvement: the Provider will only render its Consumers
  when the state value has changed (using a shallow equality check).
* The actions API is simpler, drawing inspiration from redux-thunk. Note that
  this is a breaking change, although no functionality has been removed.
* State must now be an object or null, like a React component's state.
* New, helpful warnings have been introduced.

### v0.2.1 (2018/5/25)

* Fixes a bug where calling `setState` would not work as intended.

### v0.2.0 (2018/5/25)

* Refactor the API to no longer bind actions to the Component instance.

### v0.1.0 (2018/5/25)

* Expand the React `peerDependency` range to include v0.14.0.

### v0.0.2 (2018/5/25)

This was the first release of the library.
