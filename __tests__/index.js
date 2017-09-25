const Application = require('spectron').Application
const path = require('path')
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

var main_test = require('./main')

var electronPath = path.join(__dirname, '..', 'node_modules', '.bin',
  'electron')
if (process.platform === 'win32') {
  electronPath += '.cmd'
}
var appPath = path.join(__dirname, '..')
var app = new Application({
  path: electronPath,
  args: [appPath]
})

global.before(function () {
  chai.should()
  chai.use(chaiAsPromised)
})

main_test.run(app)
