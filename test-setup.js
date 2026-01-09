import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { jest } from '@jest/globals';

Enzyme.configure({ adapter: new Adapter() });

jest.unstable_mockModule('electron', () => ({
  ipcRenderer: {
    on: jest.fn(),
    send: jest.fn(),
  },
  remote: {
    getCurrentWindow: jest.fn(),
  },
}));

beforeEach(() => {
  if (!window.electronAPI) {
    window.electronAPI = {};
  }

  window.electronAPI.execSSH = jest.fn();
  window.electronAPI.startSSH = jest.fn();
  jest.spyOn(window.electronAPI, 'execSSH');
  jest.spyOn(window.electronAPI, 'startSSH');
});
