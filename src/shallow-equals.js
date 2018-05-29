function isSet(a) {
  return typeof a !== 'undefined' && a !== null;
}

// Note: this does not support multiple global environments
// For more, see: http://web.mit.edu/jwalden/www/isArray.html
function isObject(a) {
  return isSet(a) && a.constructor === Object;
}

function isArray(a) {
  return Array.isArray(a);
}

export default function shallowEquals(a, b) {
  // Handle exact object matches and primitives
  if (a === b) {
    return true;
  }

  // We only handle comparing "regular" objects and
  // arrays; everything else is considered not equal.
  else if (
    (isObject(a) || Array.isArray(a)) &&
    (isObject(b) || Array.isArray(b))
  ) {
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
  } else {
    return false;
  }
}
