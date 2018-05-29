import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as warning from '../src/warning';

Enzyme.configure({ adapter: new Adapter() });

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
