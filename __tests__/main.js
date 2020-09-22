import { assert } from 'chai';

exports.run = (app) => {
  describe('Test app window', function () {
    this.timeout(15000);

    beforeEach(() => app.start());

    afterEach(() => app.stop());

    it('opens a window', async () => {
      const count = await app.client.getWindowCount();
      assert.equal(count, 1);
    });

    it('tests the title', async () => {
      const title = await app.client.getTitle();
      assert.equal(title, 'Server Stats');
    });
  });
};
