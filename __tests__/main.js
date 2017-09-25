exports.run = (app) => {
  describe('Test app window', function () {
    this.timeout(15000)

    beforeEach(() => {
      return app.start()
    })

    afterEach(() => {
      return app.stop()
    })

    it('opens a window', () => {
      return app.client.waitUntilWindowLoaded()
        .getWindowCount().should.eventually.equal(1)
    })

    it('tests the title', () => {
      return app.client.waitUntilWindowLoaded()
        .getTitle().should.eventually.equal('Server Stats')
    })
  })
}
