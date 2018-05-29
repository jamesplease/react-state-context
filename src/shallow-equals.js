// This is a quick little shallow equals. It will be made a little more
// robust before this PR gets merged.
export default function shallowEquals(a, b) {
  for (let key in a) {
    if (a[key] !== b[key]) {
      return false;
    }
  }

  return true;
}
