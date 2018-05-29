export default function shallowEquals(a, b) {
  // Handle exact object matches and primitives
  if (a === b) {
    return true;
  }

  // If either are null, then we can do a
  if (a === null || b === null) {
    return a === b;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  // If they are both objects, then they must have the same
  // number of keys.
  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (var prop in b) {
    if (a.hasOwnProperty(prop)) {
      if (a[prop] !== b[prop]) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
}
