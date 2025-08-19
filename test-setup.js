import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

jest.mock('electron', () => ({
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
