const path = require('path');
const { _electron: electron } = require('playwright');

const mainTest = require('./main');

const appPath = path.join(__dirname, '..');

const launchApp = async () => {
  const electronApp = await electron.launch({ args: [appPath] });
  const window = await electronApp.firstWindow();

  return { electronApp, window };
};

mainTest.run(launchApp);
