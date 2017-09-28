import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { assert } from 'chai'

import SSHConnection from '../SSHConnection'

global.before(function () {
  chai.should()
  chai.use(chaiAsPromised)
})

describe('SSHConnection', () => {
  it('establish with wrong key', () => {
    var connPromise = SSHConnection.establish('ssh.yourserver.com', 'username',
      'fake key')
    return connPromise.should.be.rejected
  })
})
