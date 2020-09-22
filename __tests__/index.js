const { Application } = require('spectron');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const main_test = require('./main');

let electronPath = path.join(__dirname, '..', 'node_modules', '.bin',
  'electron');
if (process.platform === 'win32') {
  electronPath += '.cmd';
}
const appPath = path.join(__dirname, '..');
const app = new Application({
  path: electronPath,
  args: [appPath],
});

global.before(() => {
  chai.should();
  chai.use(chaiAsPromised);
});

main_test.run(app);
