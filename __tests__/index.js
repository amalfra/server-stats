const path = require('path');
const { _electron: electron } = require('playwright');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const mainTest = require('./main');

const appPath = path.join(__dirname, '..');

global.before(() => {
  chai.should();
  chai.use(chaiAsPromised);
});

const launchApp = async () => {
  const electronApp = await electron.launch({ args: [appPath] });
  const window = await electronApp.firstWindow();

  return { electronApp, window };
};

mainTest.run(launchApp);
