import * as warning from '../src/warning';

beforeEach(() => {
  if (console.error.mockRestore) {
    console.error.mockRestore();
  }

  if (warning.warning.mockRestore) {
    warning.warning.mockRestore();
  }

  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(warning, 'warning').mockImplementation(() => {});

  warning.resetCodeCache();
});
