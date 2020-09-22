exports.run = (app) => {
  describe('Test app window', function () {
    this.timeout(15000);

    beforeEach(() => app.start());

    afterEach(() => app.stop());

    it('opens a window', () => app.client.waitUntilWindowLoaded()
      .getWindowCount().should.eventually.equal(1));

    it('tests the title', () => app.client.waitUntilWindowLoaded()
      .getTitle().should.eventually.equal('Server Stats'));
  });
};
