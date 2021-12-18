import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import SSHConnection from '../SSHConnection';

global.before(() => {
  chai.should();
  chai.use(chaiAsPromised);
});

describe('SSHConnection', () => {
  it('establish with wrong key', () => {
    const connPromise = SSHConnection.establish(
      'ssh.yourserver.com',
      'username',
      'fake key',
    );
    return connPromise.should.be.rejected;
  });
});
