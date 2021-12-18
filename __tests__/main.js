const { assert } = require('chai');

exports.run = (launchApp) => {
  let electronApp;
  let window;

  beforeEach(async () => {
    ({ electronApp, window } = await launchApp());
  });

  afterEach(async () => {
    await electronApp.close();
  });

  describe('Test app window', () => {
    it('tests the title', async () => {
      const title = await window.title();
      assert.equal(title, 'Server Stats');
    });
  });
};
