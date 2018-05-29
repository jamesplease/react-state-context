export default function shallowEquals(a, b) {
  // Handle exact object matches and primitives
  if (a === b) {
    return true;
  }

  // When either value are null, then a strict equals comparison will return
  // the expected value.
  if (a === null || b === null) {
    return a === b;
  }

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  // If they are both objects, then they must have the same
  // number of keys. Otherwise, they can't be shallowly equal!
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
